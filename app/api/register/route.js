// app/api/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import Surveyor from '@/models/Surveyor'; // Import the Surveyor model

export async function POST(req) {
  try {
    const { companyName, email, phone, address, description, password } = await req.json();

    // Check if user already exists
    const existingUser = await Surveyor.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await Surveyor.create({
      companyName,
      email,
      phone,
      address,
      description,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}
