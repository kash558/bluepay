"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Copy } from "lucide-react"

export default function InvitationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://fairmoneypay.vercel.app")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const text = "Join FairMonie Pay and earn ₦6,500 for each successful referral! Use my link: https://fairmoneypay.vercel.app"
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 sm:p-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-700 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Invite & Earn</h1>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#e8f5ec] border-t-[#1a9b5c] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading rewards program...</p>
          </div>
        </div>
      )}

      {/* CONTENT */}
      {!isLoading && (
        <div className="p-4 max-w-md mx-auto space-y-6 py-6">
          {/* EARNINGS CARD */}
          <div className="bg-gradient-to-b from-[#2ab973] to-[#1a9b5c] rounded-3xl p-8 text-white text-center space-y-6">
            <div className="text-5xl">🎁</div>
            
            <div>
              <p className="text-2xl font-bold">₦0</p>
              <p className="text-sm opacity-90">Total Earnings</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xl font-bold">0</p>
                <p className="text-xs opacity-90">Referrals</p>
              </div>
              <div>
                <p className="text-xl font-bold">₦6,500</p>
                <p className="text-xs opacity-90">Per Referral</p>
              </div>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div className="bg-white rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">How it Works</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#e8f5ec] flex items-center justify-center flex-shrink-0 text-[#1a9b5c] font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Share your referral link with friends</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#e8f5ec] flex items-center justify-center flex-shrink-0 text-[#1a9b5c] font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="text-gray-900 font-medium">They sign up using your link</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#e8f5ec] flex items-center justify-center flex-shrink-0 text-[#1a9b5c] font-bold text-sm">
                  3
                </div>
                <div>
                  <p className="text-gray-900 font-medium">You earn ₦6,500 for each successful referral automatically</p>
                </div>
              </div>
            </div>
          </div>

          {/* YOUR REFERRAL LINK */}
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Your Referral Link</h2>
            
            <div className="flex items-center gap-2 bg-[#f5f6f7] rounded-lg p-3">
              <input
                type="text"
                value="https://fairmoneypay.vercel.app"
                readOnly
                className="flex-1 bg-transparent text-gray-900 text-xs sm:text-sm outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="text-[#1a9b5c] hover:opacity-80 flex-shrink-0"
                title="Copy link"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copied && <p className="text-[#1a9b5c] text-xs">Copied to clipboard!</p>}

            <button
              onClick={handleShareWhatsApp}
              className="w-full bg-gradient-to-r from-[#0a8f3d] to-[#1a9b5c] hover:from-[#097233] hover:to-[#168a4f] text-white font-bold py-3 rounded-lg transition-all text-sm"
            >
              ⬆ Share on WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat */}
      <button className="fixed right-5 bottom-6 w-14 h-14 rounded-full bg-[#0a8f3d] text-white flex items-center justify-center hover:scale-110 transition-transform z-40 text-xl">
        💬
      </button>
    </div>
  )
}
