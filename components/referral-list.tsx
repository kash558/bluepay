import { CheckCircle2, Clock } from 'lucide-react'

interface Referral {
  id: string
  referred_id: string
  status: string
  bonus_amount: number
  created_at: string
}

interface ReferralListProps {
  referrals: Referral[]
}

export default function ReferralList({ referrals }: ReferralListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Your Referrals</h2>

      <div className="space-y-3">
        {referrals.map((referral) => (
          <div
            key={referral.id}
            className={`border-2 rounded-lg p-4 flex items-center justify-between ${
              referral.status === 'completed'
                ? 'bg-primary/10 border-primary'
                : 'bg-amber-500/10 border-amber-500'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono text-muted-foreground truncate">
                  {referral.referred_id.slice(0, 8)}...
                </span>
                {referral.status === 'completed' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
                    <Clock className="w-4 h-4" />
                    Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground/60">{formatDate(referral.created_at)}</p>
            </div>

            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-bold text-primary">
                +₦{referral.bonus_amount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-4 text-center text-sm text-foreground/70">
        <p>
          Referrals become <span className="text-primary font-semibold">completed</span> when your friend makes their first withdrawal
        </p>
      </div>
    </div>
  )
}
