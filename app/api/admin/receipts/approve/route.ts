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

    const { receiptId, approved } = await req.json();

    if (!receiptId || typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Get receipt
    const { data: receipt, error: receiptError } = await supabase
      .from('receipts')
      .select('*')
      .eq('id', receiptId)
      .single();

    if (receiptError || !receipt) {
      return NextResponse.json(
        { error: 'Receipt not found' },
        { status: 404 }
      );
    }

    // Update receipt
    const newStatus = approved ? 'approved' : 'rejected';
    const { error: updateError } = await supabase
      .from('receipts')
      .update({
        status: newStatus,
        approved_at: new Date().toISOString(),
        approved_by: user.id,
      })
      .eq('id', receiptId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update receipt' },
        { status: 500 }
      );
    }

    // If approved, add bonus to user balance
    if (approved) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', receipt.user_id)
        .single();

      if (userProfile) {
        const bonusAmount = 2000; // ₦2000 bonus for receipt approval
        await supabase
          .from('profiles')
          .update({ balance: userProfile.balance + bonusAmount })
          .eq('id', receipt.user_id);

        // Record the earning
        await supabase.from('earnings_history').insert({
          user_id: receipt.user_id,
          amount: bonusAmount,
          source: 'receipt_approval',
        });
      }
    }

    // Log admin action
    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: approved ? 'approve_receipt' : 'reject_receipt',
      target_type: 'receipt',
      target_id: receiptId,
      details: { user_id: receipt.user_id },
    });

    return NextResponse.json({
      success: true,
      status: newStatus,
    });
  } catch (error) {
    console.error('[v0] Receipt approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
