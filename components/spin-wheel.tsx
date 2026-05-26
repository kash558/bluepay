'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Zap } from 'lucide-react'

interface SpinWheelProps {
  userId: string
  tier: string
}

const SPIN_REWARDS = [10, 25, 50, 75, 100, 150, 200, 500]

export default function SpinWheel({ userId, tier }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [canSpin, setCanSpin] = useState(false)
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null)
  const [lastReward, setLastReward] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    checkSpinStatus()
    const interval = setInterval(checkSpinStatus, 1000)
    return () => clearInterval(interval)
  }, [userId, supabase])

  const checkSpinStatus = async () => {
    try {
      const { data } = await supabase
        .from('spin_history')
        .select('spun_at')
        .eq('user_id', userId)
        .order('spun_at', { ascending: false })
        .limit(1)

      if (data && data.length > 0) {
        const lastSpin = new Date(data[0].spun_at)
        const nextAllowedSpin = new Date(lastSpin.getTime() + 24 * 60 * 60 * 1000)
        const now = new Date()

        if (now < nextAllowedSpin) {
          setNextSpinTime(nextAllowedSpin)
          setCanSpin(false)
        } else {
          setNextSpinTime(null)
          setCanSpin(true)
        }
      } else {
        setCanSpin(true)
        setNextSpinTime(null)
      }
    } catch (error) {
      console.error('Error checking spin status:', error)
    }
  }

  const spin = async () => {
    if (!canSpin || isSpinning) return

    setIsSpinning(true)
    
    try {
      const reward = SPIN_REWARDS[Math.floor(Math.random() * SPIN_REWARDS.length)]
      setLastReward(reward)

      // Record spin
      await supabase.from('spin_history').insert({
        user_id: userId,
        reward_amount: reward,
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
          .update({ balance: profile.balance + reward })
          .eq('id', userId)
      }

      // Set next spin time
      const nextSpin = new Date(Date.now() + 24 * 60 * 60 * 1000)
      setNextSpinTime(nextSpin)
      setCanSpin(false)

      // Reset after showing result
      setTimeout(() => {
        setIsSpinning(false)
        setLastReward(null)
      }, 3000)
    } catch (error) {
      console.error('Error spinning:', error)
      setIsSpinning(false)
    }
  }

  const getTimeUntilSpin = () => {
    if (!nextSpinTime) return ''
    const now = new Date()
    const diff = nextSpinTime.getTime() - now.getTime()
    
    if (diff <= 0) {
      return ''
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">🎡 Daily Spin</h3>

      <div className="bg-gradient-to-br from-secondary/15 to-secondary/5 border-2 border-secondary rounded-lg p-6 space-y-4 shadow-lg">
        <div className="flex justify-center">
          <div
            className={`w-32 h-32 rounded-full border-8 border-secondary flex items-center justify-center text-4xl font-bold transition-transform shadow-lg ${
              isSpinning ? 'animate-spin' : ''
            }`}
            style={{
              backgroundColor: 'hsl(var(--card))',
              backgroundImage: `conic-gradient(
                from 0deg,
                hsl(162 72% 31%) 0deg 45deg,
                hsl(38 92% 50%) 45deg 90deg,
                hsl(162 72% 31%) 90deg 135deg,
                hsl(38 92% 50%) 135deg 180deg,
                hsl(162 72% 31%) 180deg 225deg,
                hsl(38 92% 50%) 225deg 270deg,
                hsl(162 72% 31%) 270deg 315deg,
                hsl(38 92% 50%) 315deg 360deg
              )`,
            }}
          >
            🎁
          </div>
        </div>

        {lastReward && (
          <div className="text-center space-y-2 bg-gradient-to-r from-secondary/30 to-secondary/20 rounded-lg p-4 border border-secondary/50">
            <p className="text-sm font-semibold text-foreground">✨ You Won! ✨</p>
            <p className="text-3xl font-bold text-secondary">₦{lastReward}</p>
          </div>
        )}

        <button
          onClick={spin}
          disabled={!canSpin || isSpinning}
          className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/95 hover:to-secondary disabled:opacity-50 disabled:cursor-not-allowed text-secondary-foreground font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          {isSpinning ? '⚡ Spinning...' : canSpin ? '🎲 Spin Now' : '⏳ Come Back Later'}
        </button>

        {nextSpinTime && !canSpin && (
          <p className="text-xs text-center font-semibold text-secondary">
            ⏰ Next spin in {getTimeUntilSpin()}
          </p>
        )}
      </div>
    </div>
  )
}
