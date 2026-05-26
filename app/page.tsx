'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/navbar'
import BalanceCard from '@/components/balance-card'
import VideoEarning from '@/components/video-earning'
import SpinWheel from '@/components/spin-wheel'
import PaymentInfo from '@/components/payment-info'
import ReceiptUpload from '@/components/receipt-upload'
import ActivationCodeValidator from '@/components/activation-code-validator'
import CustomerCareFooter from '@/components/customer-care-footer'
import { Users } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        setUser(user)

        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setProfile(profileData)
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar user={user} profile={profile} />
      
      <div className="max-w-md mx-auto px-4 py-8 space-y-8">
        <BalanceCard balance={profile.balance} tier={profile.tier} />
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2">💰 Earn Money</h2>
          <VideoEarning userId={user.id} tier={profile.tier} />
          <SpinWheel userId={user.id} tier={profile.tier} />
        </div>

        <Link href="/referrals">
          <div className="bg-gradient-to-r from-secondary/30 to-secondary/20 border-2 border-secondary rounded-lg p-4 flex items-center justify-between hover:from-secondary/40 hover:to-secondary/30 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-secondary" />
              <div>
                <p className="font-bold text-foreground">Invite Friends</p>
                <p className="text-sm text-foreground/70">Earn ₦3,000 per referral</p>
              </div>
            </div>
            <span className="text-secondary font-bold">→</span>
          </div>
        </Link>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-secondary border-b-2 border-secondary pb-2">⭐ Upgrade Account</h2>
          <PaymentInfo />
          <ReceiptUpload userId={user.id} />
          <ActivationCodeValidator userId={user.id} />
        </div>
      </div>

      <CustomerCareFooter />
    </main>
  )
}
