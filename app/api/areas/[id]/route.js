import { NextResponse } from 'next/server';
import Areas from '@/models/Areas';

// GET  area by ID
export async function GET(req) {
  try {
    const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from the URL
    const area = await Areas.findByPk(id); // Use Sequelize's `findByPk` method

    if (!area) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }

    return NextResponse.json(area, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching Area' }, { status: 500 });
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

    const area = await Areas.findByPk(id); // Find the record by ID
    if (!area) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }

    await Areas.update({ name }); // Update the record with new data

    return NextResponse.json({ message: 'Area updated', area }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating area' }, { status: 500 });
  }
}

// DELETE area
export async function DELETE(req) {
  try {
    const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from the URL
    const area = await Areas.findByPk(id); // Find the record by ID

    if (!area) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }

    await area.destroy(); // Delete the record

    return NextResponse.json({ message: 'Area deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error deleting area' }, { status: 500 });
  }
}
