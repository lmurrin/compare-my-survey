// Get all leads associated with the logged-in surveyor
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Lead, Surveyor, SurveyType } from '@/models';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const leads = await Lead.findAll({
      include: [
        {
          model: Surveyor,
          as: 'surveyors',
          where: { id: session.id },
          attributes: ['id', 'companyName'],
          through: { attributes: ['quote', 'chargeAmount'] },
        },
        {
          model: SurveyType,
          as: 'survey_type',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error('Error fetching surveyor leads:', error);
    return NextResponse.json({ error: 'Error fetching leads' }, { status: 500 });
  }
}
