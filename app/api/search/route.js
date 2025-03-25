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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const surveyType = searchParams.get('surveyType');
    const location = searchParams.get('location');
    const propertyPrice = parseFloat(searchParams.get('propertyPrice'));

    if (!surveyType || !location || isNaN(propertyPrice)) {
      return NextResponse.json(
        { error: 'surveyType, location, and propertyPrice are required' },
        { status: 400 }
      );
    }

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
            attributes: ['id', 'companyName', 'email', 'address', 'phone', 'description'],
          },
        ],
        order: Sequelize.literal('RAND()'),
        limit: 6,
      });
      

    if (services.length === 0) {
      return NextResponse.json({ message: 'No surveyor services found' }, { status: 404 });
    }

    const formattedServices = services.map(service => {
        const quotes = service.quotes || [];
        const applicableQuote = quotes.find(q =>
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
          surveyor: service.surveyor
            ? {
                id: service.surveyor.id,
                companyName: service.surveyor.companyName,
                email: service.surveyor.email,
                address: service.surveyor.address,
                phone: service.surveyor.phone,
                description: service.surveyor.description,
              }
            : null,
        };
      });
      

    return NextResponse.json({ services: formattedServices }, { status: 200 });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
