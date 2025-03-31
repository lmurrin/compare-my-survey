// app/api/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Surveyor } from '@/models/Surveyor';


export async function POST(req) {
  try {
    const { companyName, email, phone, address, description, password } = await req.json();

    // Check if user already exists
    const existingUser = await Surveyor.findOne({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default logo path (served from /public folder)
    const defaultLogo = '/user-icon.png';

    // Create new user
    await Surveyor.create({
      companyName,
      email,
      phone,
      address,
      description,
      password: hashedPassword,
      isAdmin: false,
      logo: defaultLogo,
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}
