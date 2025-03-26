
import { NextResponse } from 'next/server';
import db from '@/lib/db'; 
import { QueryTypes } from 'sequelize';


// GET all surveyor services
export async function GET() {
    try {
      const surveyorServices = await db.query('SELECT * FROM surveyor_services');
      return NextResponse.json(surveyorServices, { status: 200 });
    } catch (error) {
      console.error("Error in GET /api/surveyor-services:", error); // 👈 Add this
      return NextResponse.json({ error: 'Error fetching surveyor services' }, { status: 500 });
    }
  }
  
// Create a surveyor service
export async function POST(req) {
  try {
    const { surveyorId, surveyTypeId, locationBasketId } = await req.json();

    if (!surveyorId || !surveyTypeId || !locationBasketId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await db.query(
      'SELECT * FROM surveyor_services WHERE surveyorId = ? AND surveyTypeId = ? AND locationBasketId = ?',
      {
        replacements: [surveyorId, surveyTypeId, locationBasketId],
        type: QueryTypes.SELECT,
      }
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Service already exists' }, { status: 409 });
    }

    await db.query(
      'INSERT INTO surveyor_services (surveyorId, surveyTypeId, locationBasketId, active) VALUES (?, ?, ?, ?)',
      {
        replacements: [surveyorId, surveyTypeId, locationBasketId, 1],
        type: QueryTypes.INSERT,
      }
    );

    return NextResponse.json({ message: 'Service added' }, { status: 201 });

  } catch (error) {
    console.error("POST /api/surveyor-services error:", error);
    return NextResponse.json({ error: 'Error adding surveyor service' }, { status: 500 });
  }
}
