import { NextResponse } from 'next/server';
import Locations from '@/models/Locations'; 

// GET all locations
export async function GET() {
  try {
    // Fetch all locations using Sequelize
    const locations = await Locations.findAll();

    // If no locations are found, return an empty array or a 404 response
    if (locations.length === 0) {
      return NextResponse.json({ message: 'No locations found' }, { status: 404 });
    }

    // Return the list of locations
    return NextResponse.json(locations, { status: 200 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching locations' }, { status: 500 });
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
    const newLocation = await Locations.create({ name });

    // Return a response with the newly created location's id
    return NextResponse.json({ message: 'Location added', id: newLocation.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error adding location' }, { status: 500 });
  }
}
