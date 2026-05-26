'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface ReferralCardProps {
  referralCode: string
  userId: string
}

export default function ReferralCard({ referralCode, userId }: ReferralCardProps) {
  const [copied, setCopied] = useState(false)
  const referralLink = `https://cash-loop.vercel.app/?ref=${referralCode}`
  const referralText = `Hey! 👋 Join CASHLOOP WATCH AND EARN 💰💰 and earn up to ₦500,000 daily! 💸\nClick the link below 👇 to start earning now:\n${referralLink}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('[v0] Copy failed:', err)
    }
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(referralText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('[v0] Copy failed:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cashloop - Watch & Earn',
          text: referralText,
          url: referralLink,
        })
      } catch (err) {
        console.error('[v0] Share failed:', err)
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className="bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary rounded-xl p-6 space-y-4 shadow-lg">
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-foreground">Your Referral Link</h2>
        <p className="text-sm text-foreground/70">Share this link to earn ₦3,000 per friend</p>
      </div>

      <div className="bg-background/80 border border-primary/30 rounded-lg p-4 flex items-center justify-between gap-2">
        <code className="text-xs font-mono text-primary truncate flex-1 break-all">
          {referralLink}
        </code>
        <button
          onClick={handleCopyLink}
          className="flex-shrink-0 p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
          title="Copy link"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          📤 Share
        </button>
        <button
          onClick={handleCopyText}
          className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-secondary-foreground font-semibold py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          💬 Copy Text
        </button>
      </div>
    </div>
  )
}
