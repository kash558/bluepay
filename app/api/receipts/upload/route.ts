'use server';

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const filename = `${user.id}/${uuidv4()}.${file.name.split('.').pop()}`;
    const blob = await put(filename, file, {
      access: 'private',
    });

    // Create receipt record in database
    const { data: receipt, error: receiptError } = await supabase
      .from('receipts')
      .insert([
        {
          user_id: user.id,
          receipt_url: blob.url,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (receiptError) {
      return NextResponse.json(
        { error: 'Failed to create receipt record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      receiptId: receipt.id,
      status: 'pending',
      message: 'Receipt uploaded successfully. Awaiting admin approval.',
    });
  } catch (error) {
    console.error('[v0] Receipt upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
