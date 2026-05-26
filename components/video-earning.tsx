'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Play, Clock } from 'lucide-react'

interface VideoEarningProps {
  userId: string
  tier: string
}

const EARNING_AMOUNT = 50
const VIDEOS = [
  { id: 1, title: 'How to Save Money', thumbnail: 'bg-blue-600' },
  { id: 2, title: 'Financial Tips for Beginners', thumbnail: 'bg-green-600' },
  { id: 3, title: 'Investment Guide', thumbnail: 'bg-purple-600' },
]

export default function VideoEarning({ userId, tier }: VideoEarningProps) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [isWatching, setIsWatching] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(VIDEOS[0])
  const [earnedToday, setEarnedToday] = useState(0)
  const [tabActive, setTabActive] = useState(true)
  const supabase = createClient()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const tierLimits: Record<string, number> = {
    'Free': 500,
    'Silver': 1000,
    'Gold': 2000,
    'Platinum': 5000,
  }

  const dailyLimit = tierLimits[tier] || 500

  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabActive(document.visibilityState === 'visible')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    // Fetch today's earnings
    const fetchTodayEarnings = async () => {
      const today = new Date().toLocaleDateString('en-CA')
      const { data } = await supabase
        .from('earnings_history')
        .select('amount')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`)

      const total = data?.reduce((sum, item) => sum + item.amount, 0) || 0
      setEarnedToday(total)
    }

    fetchTodayEarnings()
  }, [userId, supabase])

  useEffect(() => {
    if (!isWatching || !tabActive) return

    if (timeLeft === 0) {
      completeVideo()
      return
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeLeft, isWatching, tabActive])

  const completeVideo = async () => {
    setIsWatching(false)
    setTimeLeft(30)

    if (earnedToday + EARNING_AMOUNT > dailyLimit) {
      alert(`Daily limit of ₦${dailyLimit} reached!`)
      return
    }

    try {
      // Record earnings
      await supabase.from('earnings_history').insert({
        user_id: userId,
        amount: EARNING_AMOUNT,
        source: 'video',
      })

      // Update balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', userId)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({ balance: profile.balance + EARNING_AMOUNT })
          .eq('id', userId)
      }

      setEarnedToday(earnedToday + EARNING_AMOUNT)
      // Show confetti (simplified)
      console.log('[v0] Video completed! Earned ₦50')
    } catch (error) {
      console.error('Error recording earnings:', error)
    }
  }

  const startWatching = () => {
    setIsWatching(true)
    setTimeLeft(30)
  }

  const canWatch = earnedToday < dailyLimit && tabActive

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-foreground">Watch Videos</h3>
        <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded-full">
          ₦{earnedToday} / ₦{dailyLimit}
        </span>
      </div>

      {isWatching ? (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary rounded-lg p-4 space-y-3 shadow-lg">
          <div className={`${currentVideo.thumbnail} w-full h-40 rounded-lg flex items-center justify-center shadow-md`}>
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-foreground/70">Time remaining</p>
            <p className="text-5xl font-bold text-primary">{timeLeft}s</p>
            {!tabActive && (
              <p className="text-xs text-destructive font-semibold">⚠️ Keep tab active to continue</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary rounded-lg p-3 flex items-center gap-3 shadow-md">
          <div className={`${currentVideo.thumbnail} w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md`}>
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{currentVideo.title}</p>
            <p className="text-xs text-primary font-semibold">Earn ₦{EARNING_AMOUNT}</p>
          </div>
        </div>
      )}

      <button
        onClick={startWatching}
        disabled={isWatching || !canWatch}
        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
      >
        {isWatching ? '⏱️ Watching...' : earnedToday >= dailyLimit ? '✓ Daily Limit Reached' : '▶️ Watch Now'}
      </button>
    </div>
  )
}
