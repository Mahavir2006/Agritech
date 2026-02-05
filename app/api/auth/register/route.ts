import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone_number, password, role, company_name, gst_number, address } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    if (!['farmer', 'buyer', 'wholesaler'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},phone_number.eq.${phone_number}`)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone number already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        phone_number,
        password: hashedPassword,
        role,
        company_name: role === 'wholesaler' ? company_name : null,
        gst_number: role === 'wholesaler' ? gst_number : null,
        address: role === 'wholesaler' ? address : null
      })
      .select('id, name, email, phone_number, role, created_at')
      .single();

    if (error) {
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: error.message || 'Registration failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'User registered successfully',
      user: newUser
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}