import { NextResponse } from 'next/server';
import { Lead, Surveyor, SurveyType } from '@/models';
import ApiKey from '@/models/ApiKey';

async function isValidApiKey(request) {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) return false;

  const key = await ApiKey.findOne({
    where: { key: apiKey, isActive: true }
  });

  return !!key;
}

export async function GET(req) {
  // ✅ Step 1: Check API key
  const apiKey = req.headers.get('x-api-key');

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 401 });
  }

  const keyRecord = await ApiKey.findOne({
    where: { key: apiKey, isActive: true }
  });

  if (!keyRecord) {
    return NextResponse.json({ error: 'Invalid or inactive API key' }, { status: 403 });
  }

  // ✅ Step 2: Fetch leads with relationships
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
          through: { attributes: [] }, 
        },
      ],
    });

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Error fetching leads' }, { status: 500 });
  }
}


export async function POST(request) {
    const valid = await isValidApiKey(request);
    if (!valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const { firstName, lastName, email, phone, surveyTypeId, surveyorIds } = await request.json();
  
      const lead = await Lead.create({ firstName, lastName, email, phone, surveyTypeId });
  
      if (Array.isArray(surveyorIds) && surveyorIds.length > 0) {
        await lead.setSurveyors(surveyorIds);
      }
  
      return NextResponse.json({ message: 'Lead created', leadId: lead.id });
    } catch (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    }
  }