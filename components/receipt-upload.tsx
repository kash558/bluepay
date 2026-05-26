'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Check } from 'lucide-react'

interface ReceiptUploadProps {
  userId: string
}

export default function ReceiptUpload({ userId }: ReceiptUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setUploading(true)

    try {
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('receipts')
        .upload(`${userId}/${Date.now()}.jpg`, file)

      if (error) throw error

      // Record receipt in database
      await supabase.from('receipts').insert({
        user_id: userId,
        receipt_url: data?.path || '',
        status: 'pending',
      })

      setUploaded(true)
      setTimeout(() => setUploaded(false), 3000)
    } catch (error) {
      console.error('Error uploading receipt:', error)
      alert('Error uploading receipt. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-background border border-border rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-foreground">Upload Receipt</h3>

      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center space-y-2 hover:border-accent transition-colors cursor-pointer relative overflow-hidden">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        
        {uploaded ? (
          <>
            <Check className="w-6 h-6 text-accent mx-auto" />
            <p className="text-sm font-semibold text-foreground">Receipt uploaded!</p>
            <p className="text-xs text-muted-foreground">Pending admin approval</p>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-muted-foreground mx-auto" />
            <p className="text-sm font-semibold text-foreground">
              {uploading ? 'Uploading...' : 'Click to upload'}
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
          </>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Upload a screenshot of your bank transfer. Admin will verify and upgrade your account.
      </p>
    </div>
  )
}
