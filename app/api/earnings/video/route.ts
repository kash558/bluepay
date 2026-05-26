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

    const { videoLength } = await req.json();

    // Validate video length (must be 30 seconds)
    if (videoLength < 29 || videoLength > 31) {
      return NextResponse.json(
        { error: 'Invalid video length' },
        { status: 400 }
      );
    }

    // Get user profile to check tier and daily limit
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

    // Determine earning amount based on tier
    let earningAmount = 50; // Free tier
    if (profile.tier === 'Premium') earningAmount = 150;
    else if (profile.tier === 'Gold') earningAmount = 250;

    // Check daily limit (videos watched today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: dailyEarnings } = await supabase
      .from('earnings_history')
      .select('amount')
      .eq('user_id', user.id)
      .eq('source', 'video')
      .gte('created_at', today.toISOString());

    const totalEarningsToday = (dailyEarnings || []).reduce(
      (sum, e) => sum + parseFloat(e.amount.toString()),
      0
    );

    // Get daily limit based on tier
    let dailyLimit = 500; // Free tier
    if (profile.tier === 'Premium') dailyLimit = 1500;
    else if (profile.tier === 'Gold') dailyLimit = 3000;

    if (totalEarningsToday + earningAmount > dailyLimit) {
      return NextResponse.json(
        {
          error: 'Daily limit exceeded',
          currentEarnings: totalEarningsToday,
          dailyLimit: dailyLimit,
          remainingAllowance: dailyLimit - totalEarningsToday,
        },
        { status: 429 }
      );
    }

    // Record the earning
    const { data: earning, error: earningError } = await supabase
      .from('earnings_history')
      .insert([
        {
          user_id: user.id,
          amount: earningAmount,
          source: 'video',
          daily_limit_exceeded: false,
        },
      ])
      .select()
      .single();

    if (earningError) {
      return NextResponse.json(
        { error: 'Failed to record earning' },
        { status: 500 }
      );
    }

    // Update user balance
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ balance: profile.balance + earningAmount })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update balance' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      earningAmount,
      newBalance: updatedProfile.balance,
      totalEarningsToday: totalEarningsToday + earningAmount,
      remainingDaily: dailyLimit - (totalEarningsToday + earningAmount),
    });
  } catch (error) {
    console.error('[v0] Video earning error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
