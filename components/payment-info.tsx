'use client'

import { Copy, Wallet } from 'lucide-react'
import { useState } from 'react'

export default function PaymentInfo() {
  const [copied, setCopied] = useState(false)

  const accountInfo = {
    bank: 'Moniepoint MFB',
    accountNumber: '9201234567',
    accountName: 'Cashloop Premium',
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-background border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Payment Details</h3>
      </div>

      <div className="space-y-2 bg-card/50 rounded-lg p-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Bank</p>
          <p className="text-sm font-semibold text-foreground">{accountInfo.bank}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Account Number</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{accountInfo.accountNumber}</p>
            <button
              onClick={() => handleCopy(accountInfo.accountNumber)}
              className="p-1 hover:bg-muted rounded transition-colors"
              title="Copy account number"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Account Name</p>
          <p className="text-sm font-semibold text-foreground">{accountInfo.accountName}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Make a bank transfer to upgrade your account. After transfer, upload the receipt below.
      </p>
    </div>
  )
}
