import { NextResponse } from 'next/server';
import Locations from '@/models/Locations';

// GET survey type by ID
export async function GET(req) {
  try {
    const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from the URL
    const location = await Locations.findByPk(id); // Use Sequelize's `findByPk` method

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json(location, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching Location' }, { status: 500 });
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

    const location = await Locations.findByPk(id); // Find the record by ID
    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    await location.update({ name }); // Update the record with new data

    return NextResponse.json({ message: 'Location updated', surveyType }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating location' }, { status: 500 });
  }
}

// DELETE survey type
export async function DELETE(req) {
  try {
    const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from the URL
    const location = await Locations.findByPk(id); // Find the record by ID

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    await location.destroy(); // Delete the record

    return NextResponse.json({ message: 'Location deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error deleting Location' }, { status: 500 });
  }
}
