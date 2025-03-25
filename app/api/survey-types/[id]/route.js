import { NextResponse } from 'next/server';
import SurveyType from '@/models/SurveyType';

// GET survey type by ID
export async function GET(req) {
  try {
    const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from the URL
    const surveyType = await SurveyType.findByPk(id); // Use Sequelize's `findByPk` method

    if (!surveyType) {
      return NextResponse.json({ error: 'Survey type not found' }, { status: 404 });
    }

    return NextResponse.json(surveyType, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching survey type' }, { status: 500 });
  }
}

// UPDATE survey type (PUT)
export async function PUT(req) {
  try {
    const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from the URL
    const { name } = await req.json(); // Parse JSON body

    if (!name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const surveyType = await SurveyType.findByPk(id); // Find the record by ID
    if (!surveyType) {
      return NextResponse.json({ error: 'Survey type not found' }, { status: 404 });
    }

    await surveyType.update({ name }); // Update the record with new data

    return NextResponse.json({ message: 'Survey type updated', surveyType }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating survey type' }, { status: 500 });
  }
}

// DELETE survey type
export async function DELETE(req) {
  try {
    const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from the URL
    const surveyType = await SurveyType.findByPk(id); // Find the record by ID

    if (!surveyType) {
      return NextResponse.json({ error: 'Survey type not found' }, { status: 404 });
    }

    await surveyType.destroy(); // Delete the record

    return NextResponse.json({ message: 'Survey type deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error deleting survey type' }, { status: 500 });
  }
}
