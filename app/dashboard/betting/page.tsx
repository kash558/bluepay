"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TransactionReceipt } from "@/components/transaction-receipt"

export default function BettingPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [fairCode, setFairCode] = useState("")
  const [fairCodeError, setFairCodeError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [receipt, setReceipt] = useState<any>(null)

  const VALID_CODES = ["FAIR12999", "FAIR200612", "FAIR112299"]
  const platforms = ["SportyBet", "Bet9ja", "1xBet", "BetKing"]

  const handleFairCodeValidation = () => {
    const codeUpper = fairCode.toUpperCase()
    if (fairCode && !VALID_CODES.includes(codeUpper)) {
      setFairCodeError("Invalid code buy faircode")
    } else {
      setFairCodeError("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const codeUpper = fairCode.toUpperCase()
    
    if (fairCode && !VALID_CODES.includes(codeUpper)) {
      setFairCodeError("Invalid code buy faircode")
      return
    }

    // Add transaction to localStorage
    if (typeof window !== "undefined") {
      const currentUser = JSON.parse(localStorage.getItem("fairmonie_currentUser") || "{}")
      if (currentUser.id) {
        const transactions = JSON.parse(localStorage.getItem("fairmonie_transactions") || "[]")
        const txnId = "TXN" + Date.now()
        const newTransaction = {
          id: txnId,
          userId: currentUser.id,
          transactionType: "betting",
          type: "debit",
          amount: "₦" + (parseFloat(amount) || 0).toLocaleString("en-NG"),
          phoneOrAccount: phoneNumber,
          platform: selectedPlatform,
          status: "completed",
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString("en-NG"),
        }
        transactions.push(newTransaction)
        localStorage.setItem("fairmonie_transactions", JSON.stringify(transactions))

        // Show receipt
        const now = new Date()
        setReceipt({
          title: "Betting Fund Added",
          status: "success",
          amount: "₦" + (parseFloat(amount) || 0).toLocaleString("en-NG"),
          transactionId: txnId,
          date: now.toLocaleDateString("en-NG"),
          time: now.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
          details: [
            { label: "Platform", value: selectedPlatform },
            { label: "Phone Number", value: phoneNumber },
          ],
        })
      }
    }

    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Betting</h1>
        </div>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <TransactionReceipt
          receipt={receipt}
          onClose={() => {
            setReceipt(null)
            router.push("/dashboard")
          }}
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Phone Number */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">Phone Number</label>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-600 placeholder-gray-400"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">Amount</label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-600 placeholder-gray-400"
            required
          />
        </div>

        {/* Select Betting Platform */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">Select Betting Platform</label>
          <div className="grid grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => setSelectedPlatform(platform)}
                className={`py-4 px-4 rounded-lg font-semibold transition-colors ${
                  selectedPlatform === platform
                    ? "bg-[#1a9b5c] text-white"
                    : "border border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Fair Code */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">Fair Code</label>
          <Input
            type="text"
            placeholder="Enter your faircode"
            value={fairCode}
            onChange={(e) => {
              setFairCode(e.target.value)
              setFairCodeError("")
            }}
            onBlur={handleFairCodeValidation}
            className={`w-full h-12 px-4 rounded-lg border text-gray-600 placeholder-gray-400 ${
              fairCodeError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fairCodeError && <p className="text-red-600 text-sm mt-2">✕ {fairCodeError}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-14 text-base font-semibold bg-[#1a9b5c] hover:bg-[#168a4f] text-white rounded-full"
        >
          Submit
        </Button>
      </form>

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#1a9b5c] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
        aria-label="Chat support"
      >
        <MessageCircle className="w-8 h-8" fill="currentColor" />
      </button>
    </div>
  )
}
