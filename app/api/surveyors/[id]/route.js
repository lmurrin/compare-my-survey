import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const [surveyor] = await db.query('SELECT * FROM surveyors WHERE id = ?', [id]);

    if (!surveyor) return NextResponse.json({ error: 'Surveyor not found' }, { status: 404 });

    return NextResponse.json(surveyor, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching surveyor' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name, email, phone } = await req.json();

    await db.query('UPDATE surveyors SET name=?, email=?, phone=? WHERE id=?', [
      name,
      email,
      phone,
      id,
    ]);

    return NextResponse.json({ message: 'Surveyor updated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating surveyor' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await db.query('DELETE FROM surveyors WHERE id=?', [id]);

    return NextResponse.json({ message: 'Surveyor deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting surveyor' }, { status: 500 });
  }
}
