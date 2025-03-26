import { NextResponse } from 'next/server';
import Areas from '@/models/Areas'; 

// GET all locations
export async function GET() {
  try {
    // Fetch all locations using Sequelize
    const areas = await Areas.findAll();

    // If no locations are found, return an empty array or a 404 response
    if (areas.length === 0) {
      return NextResponse.json({ message: 'No areas found' }, { status: 404 });
    }

    // Return the list of locations
    return NextResponse.json(areas, { status: 200 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching areas' }, { status: 500 });
  }
}

// POST a new location
export async function POST(req) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new location using Sequelize
    const newArea = await Areas.create({ name });

    // Return a response with the newly created location's id
    return NextResponse.json({ message: 'Areas added', id: newArea.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error adding area' }, { status: 500 });
  }
}
