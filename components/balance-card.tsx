'use client'

import { Wallet } from 'lucide-react'

interface BalanceCardProps {
  balance: number
  tier: string
}

export default function BalanceCard({ balance, tier }: BalanceCardProps) {
  const tierLimits: Record<string, { daily: number; monthly: number }> = {
    'Free': { daily: 500, monthly: 5000 },
    'Silver': { daily: 1000, monthly: 15000 },
    'Gold': { daily: 2000, monthly: 50000 },
    'Platinum': { daily: 5000, monthly: 100000 },
  }

  const limits = tierLimits[tier] || tierLimits['Free']

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary rounded-xl p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Your Balance</h2>
        <Wallet className="w-6 h-6 text-primary" />
      </div>
      
      <div className="space-y-2">
        <div className="text-5xl font-bold text-primary">
          ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <p className="text-sm text-foreground/70">Ready to withdraw</p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4">
        <div className="bg-primary/20 border border-primary/30 rounded-lg p-3">
          <p className="text-xs text-foreground/60">Daily Limit</p>
          <p className="text-sm font-bold text-primary">₦{limits.daily.toLocaleString()}</p>
        </div>
        <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-3">
          <p className="text-xs text-foreground/60">Monthly Limit</p>
          <p className="text-sm font-bold text-secondary">₦{limits.monthly.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
