'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle } from 'lucide-react'

interface Receipt {
  id: string
  user_id: string
  receipt_url: string
  status: string
  created_at: string
}

export default function ReceiptApproval() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchReceipts()
  }, [])

  const fetchReceipts = async () => {
    try {
      const { data } = await supabase
        .from('receipts')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      setReceipts(data || [])
    } catch (error) {
      console.error('Error fetching receipts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (receiptId: string, userId: string) => {
    try {
      // Update receipt status
      await supabase
        .from('receipts')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('id', receiptId)

      // Upgrade user to Silver tier
      await supabase
        .from('profiles')
        .update({ tier: 'Silver' })
        .eq('id', userId)

      fetchReceipts()
      alert('Receipt approved! User upgraded to Silver.')
    } catch (error) {
      console.error('Error approving receipt:', error)
    }
  }

  const handleReject = async (receiptId: string) => {
    try {
      await supabase
        .from('receipts')
        .update({ status: 'rejected' })
        .eq('id', receiptId)

      fetchReceipts()
      alert('Receipt rejected!')
    } catch (error) {
      console.error('Error rejecting receipt:', error)
    }
  }

  if (loading) {
    return <div className="text-muted-foreground">Loading receipts...</div>
  }

  if (receipts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No pending receipts</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Receipt Approval Queue</h2>

      <div className="space-y-3">
        {receipts.map((receipt) => (
          <div key={receipt.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Receipt ID: {receipt.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">{new Date(receipt.created_at).toLocaleString()}</p>
              </div>
              <span className="px-3 py-1 bg-yellow-600/20 text-yellow-300 text-xs font-semibold rounded">
                Pending
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(receipt.id, receipt.user_id)}
                className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 rounded-lg transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => handleReject(receipt.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-destructive/20 hover:bg-destructive/30 text-destructive font-semibold py-2 rounded-lg transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
