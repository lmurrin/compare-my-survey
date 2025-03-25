import { NextResponse } from 'next/server';
import SurveyType from '@/models/SurveyType'; 

// GET all survey types
export async function GET() {
  try {
    // Fetch all survey types using Sequelize
    const surveyTypes = await SurveyType.findAll();

    // If no survey types are found, return an empty array or a 404 response
    if (surveyTypes.length === 0) {
      return NextResponse.json({ message: 'No survey types found' }, { status: 404 });
    }

    // Return the list of survey types
    return NextResponse.json(surveyTypes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching survey types' }, { status: 500 });
  }
}

// POST a new survey type
export async function POST(req) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new survey type using Sequelize
    const newSurveyType = await SurveyType.create({ name });

    // Return a response with the newly created survey type's id
    return NextResponse.json({ message: 'Survey type added', id: newSurveyType.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error adding survey type' }, { status: 500 });
  }
}
