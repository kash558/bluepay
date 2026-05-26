interface ReferralStatsProps {
  totalEarnings: number
  completedReferrals: number
  pendingReferrals: number
}

export default function ReferralStats({
  totalEarnings,
  completedReferrals,
  pendingReferrals,
}: ReferralStatsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Your Stats</h2>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary rounded-lg p-4 text-center space-y-2">
          <div className="text-3xl font-bold text-primary">₦{totalEarnings.toLocaleString()}</div>
          <p className="text-xs text-foreground/70 font-semibold">Referral Earnings</p>
        </div>

        <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-2 border-secondary rounded-lg p-4 text-center space-y-2">
          <div className="text-3xl font-bold text-secondary">{completedReferrals}</div>
          <p className="text-xs text-foreground/70 font-semibold">Completed</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/10 border-2 border-amber-500 rounded-lg p-4 text-center space-y-2">
          <div className="text-3xl font-bold text-amber-500">{pendingReferrals}</div>
          <p className="text-xs text-foreground/70 font-semibold">Pending</p>
        </div>
      </div>
    </div>
  )
}
