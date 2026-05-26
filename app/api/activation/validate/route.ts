'use server';

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid activation code' },
        { status: 400 }
      );
    }

    // Find the activation code
    const { data: activationCode, error: codeError } = await supabase
      .from('activation_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (codeError || !activationCode) {
      return NextResponse.json(
        { error: 'Activation code not found' },
        { status: 404 }
      );
    }

    // Check if code is already used
    if (activationCode.used_by) {
      return NextResponse.json(
        { error: 'Activation code already used' },
        { status: 400 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Update activation code to mark as used
    const { error: updateCodeError } = await supabase
      .from('activation_codes')
      .update({
        used_by: user.id,
        used_at: new Date().toISOString(),
      })
      .eq('id', activationCode.id);

    if (updateCodeError) {
      return NextResponse.json(
        { error: 'Failed to use activation code' },
        { status: 500 }
      );
    }

    // Determine bonus balance based on tier
    const tierBonuses: { [key: string]: number } = {
      'Free': 1000,
      'Premium': 5000,
      'Gold': 10000,
    };

    const bonus = tierBonuses[activationCode.tier] || 1000;

    // Update user profile with new tier and bonus balance
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        tier: activationCode.tier,
        balance: profile.balance + bonus,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Upgraded to ${activationCode.tier} tier!`,
      newTier: activationCode.tier,
      bonusReceived: bonus,
      newBalance: updatedProfile.balance,
    });
  } catch (error) {
    console.error('[v0] Activation code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
