export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { Lead, Surveyor, LeadSurveyor, SurveyType, LeadPrice } from '@/models';
import ApiKey from '@/models/ApiKey';
import sequelize from '@/lib/db';

async function isValidApiKey(request) {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) return false;

  const key = await ApiKey.findOne({
    where: { key: apiKey, isActive: true },
  });

  return !!key;
}

// GET: Fetch leads
export async function GET(req) {
  const valid = await isValidApiKey(req);
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const leads = await Lead.findAll({
      include: [
        {
          model: SurveyType,
          as: 'survey_type',
          attributes: ['id', 'name'],
        },
        {
          model: Surveyor,
          as: 'surveyors',
          attributes: ['id', 'companyName', 'email', 'website'],
          through: { attributes: ['quote', 'chargeAmount'] },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Error fetching leads' }, { status: 500 });
  }
}

// POST: Create lead + associate surveyors with quote
export async function POST(request) {
  const valid = await isValidApiKey(request);
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { firstName, lastName, email, phone, surveyTypeId, surveyors } = await request.json();

    if (!surveyTypeId || !Array.isArray(surveyors) || surveyors.length === 0) {
      return NextResponse.json({ error: 'Missing surveyTypeId or surveyors' }, { status: 400 });
    }

    // Retrieve dynamic pricing
    const leadPriceEntry = await LeadPrice.findOne({ where: { surveyTypeId } });

    if (!leadPriceEntry) {
      return NextResponse.json({ error: 'No pricing config found for this survey type' }, { status: 500 });
    }

    const numSurveyors = surveyors.length;
    const multipliers = leadPriceEntry.multiplier;


    const multiplier = multipliers[numSurveyors.toString()] ?? 1.0;
    const chargeAmount = parseFloat(leadPriceEntry.basePrice) * multiplier;

    // Create lead
    const lead = await Lead.create({ firstName, lastName, email, phone, surveyTypeId });

    // Add entries to join table with quote
    const leadSurveyorData = surveyors.map((s) => ({
      leadId: lead.id,
      surveyorId: s.id,
      quote: s.quote,
      chargeAmount,
    }));

    await LeadSurveyor.bulkCreate(leadSurveyorData);

    // Deduct from each surveyor
    await Promise.all(
      surveyors.map((s) =>
        Surveyor.update(
          { balance: sequelize.literal(`balance - ${chargeAmount}`) },
          { where: { id: s.id } }
        )
      )
    );

    return NextResponse.json({ message: 'Lead created', leadId: lead.id });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
