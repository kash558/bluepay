'use client'

import { useEffect, useState } from 'react'
import { authStorage, profileStorage, referralStorage } from '@/lib/storage'
import Navbar from '@/components/navbar'
import CustomerCareFooter from '@/components/customer-care-footer'
import ReferralCard from '@/components/referral-card'
import ReferralStats from '@/components/referral-stats'
import ReferralList from '@/components/referral-list'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  tier: string
  balance: number
  referral_code: string
  referral_earnings: number
}

interface Referral {
  id: string
  referred_id: string
  status: string
  bonus_amount: number
  created_at: string
}

export default function ReferralsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = () => {
      try {
        const user = authStorage.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const profileData = profileStorage.getProfile()
        if (!profileData) {
          router.push('/auth/login')
          return
        }

        setProfile(profileData)

        const referralData = referralStorage.getUserReferrals(user.id)
        setReferrals(referralData || [])
      } catch (err) {
        console.error('[v0] Referral fetch error:', err)
        setError('Failed to load referral data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading referral data...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-destructive/20 border border-destructive rounded-lg p-4 text-destructive text-sm">
            {error || 'Failed to load referral information'}
          </div>
        </div>
      </div>
    )
  }

  const completedReferrals = referrals.filter(r => r.status === 'completed').length
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={{ id: profile.id }} profile={profile} />
      
      <div className="max-w-md mx-auto px-4 py-8 space-y-8 flex-1">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Invite Friends</h1>
          <p className="text-foreground/70">Earn ₦3,000 for every friend who joins</p>
        </div>

        <ReferralCard referralCode={profile.referral_code} userId={profile.id} />
        
        <ReferralStats 
          totalEarnings={profile.referral_earnings}
          completedReferrals={completedReferrals}
          pendingReferrals={pendingReferrals}
        />

        {referrals.length > 0 && (
          <ReferralList referrals={referrals} />
        )}

        {referrals.length === 0 && (
          <div className="bg-card border-2 border-primary/30 rounded-lg p-8 text-center space-y-3">
            <div className="text-5xl">👥</div>
            <h3 className="font-semibold text-foreground">No invites yet</h3>
            <p className="text-sm text-foreground/70">Share your referral link to start earning!</p>
          </div>
        )}
      </div>

      <CustomerCareFooter />
    </div>
  )
}
