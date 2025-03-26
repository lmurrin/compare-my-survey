import { NextResponse } from 'next/server';
import Areas from '@/models/Areas';  // Ensure this points to your Areas model

// GET areas by surveyorId
export async function GET(req, { params }) {
  try {
    const surveyorId = params['surveyor-id'];  // Extract surveyorId from URL

    if (!surveyorId) {
      return NextResponse.json({ error: 'Missing surveyorId' }, { status: 400 });
    }

    // Fetch areas related to the given surveyorId
    const areas = await Areas.findAll({
      where: {
        surveyorId: surveyorId  // Filter areas by the surveyorId
      }
    });

    if (areas.length === 0) {
      return NextResponse.json({ error: 'No areas found for this surveyor' }, { status: 404 });
    }

    // Return the areas data
    return NextResponse.json(areas, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching areas by surveyorId' }, { status: 500 });
  }
}
