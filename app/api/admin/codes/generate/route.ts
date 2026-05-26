'use server';

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

function generateCode(): string {
  return uuidv4().substring(0, 12).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { tier, quantity = 1 } = await req.json();

    if (!tier || !['Free', 'Premium', 'Gold'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }

    if (quantity < 1 || quantity > 100) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Generate codes
    const codes = [];
    for (let i = 0; i < quantity; i++) {
      codes.push({
        code: generateCode(),
        tier,
      });
    }

    // Insert codes into database
    const { data: insertedCodes, error: insertError } = await supabase
      .from('activation_codes')
      .insert(codes)
      .select();

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to generate codes' },
        { status: 500 }
      );
    }

    // Log admin action
    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'generate_codes',
      target_type: 'activation_codes',
      details: {
        tier,
        quantity,
        codes: insertedCodes.map((c) => c.code),
      },
    });

    return NextResponse.json({
      success: true,
      codes: insertedCodes,
    });
  } catch (error) {
    console.error('[v0] Code generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
