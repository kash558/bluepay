"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Shield } from "lucide-react"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f6f7]">
      {/* Header */}
      <div className="bg-gray-800 text-white p-5 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => router.back()} className="hover:opacity-80">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">About FairMonie</h1>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-3xl p-8 text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-[#e8f5ec] flex items-center justify-center mx-auto">
              <Shield className="w-12 h-12 text-[#1a9b5c]" />
            </div>
            <h2 className="text-3xl font-bold text-[#1a9b5c]">FairMonie Pay</h2>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#e8f5ec]">
            <p className="text-[#1a9b5c] text-base leading-relaxed">
              FairMonie is an automated online moneylender that provides single payment loans and bonus claims, installment loans and payroll loans for borrowers. The amount borrowed is then deducted from your account.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#e8f5ec]">
            <h3 className="text-xl font-bold text-[#1a9b5c] mb-4 flex items-center gap-2">
              <span className="text-2xl">✓</span> What we offer:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#1a9b5c] text-xl flex-shrink-0">●</span>
                <span className="text-gray-700 font-semibold">Data purchase</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1a9b5c] text-xl flex-shrink-0">●</span>
                <span className="text-gray-700 font-semibold">Airtime purchase</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1a9b5c] text-xl flex-shrink-0">●</span>
                <span className="text-gray-700 font-semibold">All TV subscriptions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1a9b5c] text-xl flex-shrink-0">●</span>
                <span className="text-gray-700 font-semibold">Betting subscription</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1a9b5c] text-xl flex-shrink-0">●</span>
                <span className="text-gray-700 font-semibold">Withdrawals</span>
              </li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="bg-[#e8f5ec] rounded-2xl p-6 border-2 border-[#1a9b5c] text-center">
            <p className="text-[#1a9b5c] font-semibold">
              FairMonie Pay is licensed by CBN. All payments are sure and secured with FairPay.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
