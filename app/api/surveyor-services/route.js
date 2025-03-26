
import { NextResponse } from 'next/server';
import db from '@/lib/db'; 

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
  