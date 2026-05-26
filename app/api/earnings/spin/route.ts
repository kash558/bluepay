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

    // Check last spin time (24-hour cooldown)
    const { data: lastSpin } = await supabase
      .from('spin_history')
      .select('spun_at')
      .eq('user_id', user.id)
      .order('spun_at', { ascending: false })
      .limit(1)
      .single();

    if (lastSpin) {
      const lastSpinTime = new Date(lastSpin.spun_at).getTime();
      const now = Date.now();
      const timeSinceLastSpin = now - lastSpinTime;
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (timeSinceLastSpin < twentyFourHours) {
        const nextSpinTime = new Date(lastSpinTime + twentyFourHours);
        return NextResponse.json(
          {
            error: 'Spin cooldown active',
            nextSpinTime: nextSpinTime.toISOString(),
            hoursUntilNextSpin: Math.ceil(
              (twentyFourHours - timeSinceLastSpin) / (60 * 60 * 1000)
            ),
          },
          { status: 429 }
        );
      }
    }

    // Define rewards for the spin wheel
    const rewards = [10, 20, 50, 100, 20, 50, 150, 30, 25, 500];
    const randomIndex = Math.floor(Math.random() * rewards.length);
    const rewardAmount = rewards[randomIndex];

    // Record the spin
    const { data: spin, error: spinError } = await supabase
      .from('spin_history')
      .insert([
        {
          user_id: user.id,
          reward_amount: rewardAmount,
        },
      ])
      .select()
      .single();

    if (spinError) {
      return NextResponse.json(
        { error: 'Failed to record spin' },
        { status: 500 }
      );
    }

    // Update user balance
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ balance: profile.balance + rewardAmount })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update balance' },
        { status: 500 }
      );
    }

    // Calculate next spin time
    const nextSpinTime = new Date(new Date(spin.spun_at).getTime() + 24 * 60 * 60 * 1000);

    return NextResponse.json({
      success: true,
      rewardAmount,
      newBalance: updatedProfile.balance,
      nextSpinTime: nextSpinTime.toISOString(),
    });
  } catch (error) {
    console.error('[v0] Spin wheel error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
