// Code to handle requests to /api/surveyors

import { NextResponse } from 'next/server';
import db from '@/lib/db'; 
import ApiKey from '@/models/ApiKey'; 


async function isValidApiKey(request) {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) return false;

  const key = await ApiKey.findOne({
    where: { key: apiKey, isActive: true }
  });

  return !!key;
}

// GET all surveyors
export async function GET(request) {
  const valid = await isValidApiKey(request);
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [surveyors] = await db.query('SELECT * FROM surveyors');
    return NextResponse.json(surveyors, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching surveyors' }, { status: 500 });
  }
}
