import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route'; 
import Lead from '@/models/Leads';
import { Surveyor, SurveyType } from '@/models';

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const surveyorId = session.id;
  const isAdmin = session.isAdmin;

  const leadId = parseInt(params.id, 10);

  if (isNaN(leadId)) {
    return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 });
  }

  try {
    // Fetch lead with associations
    const lead = await Lead.findByPk(leadId, {
      include: [
        {
          model: Surveyor,
          as: 'surveyors',
          attributes: ['id', 'companyName', 'email', 'website'],
          through: { attributes: [] },
        },
        {
          model: SurveyType,
          as: 'survey_type',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // 🔐 Authorization: allow if admin or surveyor is associated
    const isAssociated = lead.surveyors.some(s => s.id === surveyorId);

    if (!isAdmin && !isAssociated) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(lead, { status: 200 });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

