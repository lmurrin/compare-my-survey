import { NextResponse } from 'next/server';
import { Op, Sequelize } from 'sequelize';
import {
  Surveyor,
  SurveyorService,
  SurveyType,
  LocationBasket,
  Location,
  Quote
} from '@/models';
import ApiKey from '@/models/ApiKey';
import { LeadPrice } from '@/models';

export async function GET(req) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey) return NextResponse.json({ error: 'API key is required' }, { status: 401 });

  const keyRecord = await ApiKey.findOne({
    where: { key: apiKey, isActive: true }
  });
  if (!keyRecord) return NextResponse.json({ error: 'Invalid or inactive API key' }, { status: 403 });

  try {
    const { searchParams } = new URL(req.url);
    const surveyType = searchParams.get('surveyType');
    const location = searchParams.get('location');
    const propertyPrice = parseFloat(searchParams.get('propertyPrice'));

    if (!surveyType || !location || isNaN(propertyPrice)) {
      return NextResponse.json({ error: 'surveyType, location, and propertyPrice are required' }, { status: 400 });
    }

    // Step 1: Find surveyTypeId
    const surveyTypeRecord = await SurveyType.findOne({ where: { name: surveyType } });
    if (!surveyTypeRecord) throw new Error('Survey type not found');

    // Step 2: Get base price + multiplier
    const leadPrice = await LeadPrice.findOne({ where: { surveyTypeId: surveyTypeRecord.id } });
    if (!leadPrice) throw new Error('Lead price not configured for this survey type');

    const multipliers = leadPrice.multiplier;

    const basePrice = parseFloat(leadPrice.basePrice);

    // Step 3: Temporarily find all matching services (just to get count)
    const allMatchingServices = await SurveyorService.findAll({
      include: [
        { model: SurveyType, as: 'survey_type', where: { name: surveyType } },
        {
          model: LocationBasket,
          as: 'location_basket',
          include: [{ model: Location, where: { name: location } }],
        },
        { model: Surveyor, as: 'surveyor' }, 
      ],
    });

    const numSurveyors = allMatchingServices.length;
    const multiplier = multipliers[numSurveyors.toString()] ?? 1;
    const chargeAmount = basePrice * multiplier;

    // Step 4: Final query with balance filtering
    const services = await SurveyorService.findAll({
      include: [
        {
          model: SurveyType,
          as: 'survey_type',
          where: { name: surveyType },
        },
        {
          model: LocationBasket,
          as: 'location_basket',
          include: [
            {
              model: Location,
              where: { name: location },
            },
          ],
        },
        {
          model: Quote,
          as: 'quotes',
          required: false,
        },
        {
          model: Surveyor,
          as: 'surveyor',
          attributes: ['id', 'companyName', 'email', 'address', 'phone', 'description', 'balance'],
          where: {
            balance: {
              [Op.gte]: chargeAmount,
            },
          },
        },
      ],
      order: Sequelize.literal('RAND()'),
      limit: 6,
    });

    if (services.length === 0) {
      return NextResponse.json({ message: 'No eligible surveyors found' }, { status: 404 });
    }

    const formattedServices = services.map(service => {
      const applicableQuote = (service.quotes || []).find(q =>
        propertyPrice >= parseFloat(q.propertyMinValue) &&
        propertyPrice <= parseFloat(q.propertyMaxValue)
      );

      return {
        id: service.id,
        surveyType: service.survey_type?.name ?? null,
        locationBasket: service.location_basket?.name ?? null,
        applicableQuote: applicableQuote
          ? {
              id: applicableQuote.id,
              price: applicableQuote.price,
              propertyMinValue: applicableQuote.propertyMinValue,
              propertyMaxValue: applicableQuote.propertyMaxValue,
            }
          : null,
        surveyor: {
          id: service.surveyor.id,
          companyName: service.surveyor.companyName,
          email: service.surveyor.email,
          address: service.surveyor.address,
          phone: service.surveyor.phone,
          description: service.surveyor.description,
          balance: service.surveyor.balance,
        },
      };
    });

    return NextResponse.json({ services: formattedServices }, { status: 200 });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}