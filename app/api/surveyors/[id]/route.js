import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { QueryTypes } from 'sequelize';
import Surveyor from '@/models/Surveyor';


export async function GET(req, context) {
  try {
    const { id } = await context.params; 

    console.log("Fetching surveyor with ID:", id);

    const rows = await db.query('SELECT * FROM surveyors WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.SELECT,
    });

    if (!rows.length) {
      return NextResponse.json({ error: 'Surveyor not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/surveyors/[id]:", error);
    return NextResponse.json({ error: 'Error fetching surveyor' }, { status: 500 });
  }
}



export async function PUT(req, context) {
  const { id } = context.params;
  const defaultLogo = "/user-icon.png";

  try {
    const { name, email, phone, address, description, logo } = await req.json();

    await Surveyor.update(
      {
        name,
        email,
        phone,
        address,
        description,
        logo: logo || defaultLogo,
      },
      { where: { id } }
    );

    return NextResponse.json({ message: 'Surveyor updated' }, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
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
