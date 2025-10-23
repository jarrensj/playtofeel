import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Sanitize and validate email
    const sanitizedEmail = email.trim().toLowerCase();
    
    // Check length
    if (sanitizedEmail.length === 0 || sanitizedEmail.length > 255) {
      return NextResponse.json(
        { error: 'Invalid email length' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert email into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email: sanitizedEmail, created_at: new Date().toISOString() }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      
      // Handle duplicate email gracefully
      if (error.code === '23505') { // PostgreSQL unique violation
        return NextResponse.json(
          { message: 'Email already registered' },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to save email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email saved successfully', data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
