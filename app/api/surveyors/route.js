// Code to handle requests to /api/surveyors

import { NextResponse } from 'next/server';
import db from '@/lib/db'; 

// GET all surveyors
export async function GET() {
  try {
    const surveyors = await db.query('SELECT * FROM surveyors');
    return NextResponse.json(surveyors, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching surveyors' }, { status: 500 });
  }
}

// POST a new surveyor
export async function POST(req) {
  try {
    const { name, email, phone } = await req.json();
    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.query(
      'INSERT INTO surveyors (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone]
    );

    return NextResponse.json({ message: 'Surveyor added', id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error adding surveyor' }, { status: 500 });
  }
}
