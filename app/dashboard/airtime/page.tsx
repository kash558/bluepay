"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TransactionReceipt } from "@/components/transaction-receipt"

export default function AirtimePage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const [amount, setAmount] = useState("")
  const [fairCode, setFairCode] = useState("")
  const [fairCodeError, setFairCodeError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [receipt, setReceipt] = useState<any>(null)

  const VALID_CODES = ["FAIR12999", "FAIR200612", "FAIR112299"]
  const networks = ["MTN", "Airtel", "Glo", "9mobile"]

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
          transactionType: "airtime",
          type: "debit",
          amount: "₦" + (parseFloat(amount) || 0).toLocaleString("en-NG"),
          phoneOrAccount: phoneNumber,
          network: selectedNetwork,
          status: "completed",
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString("en-NG"),
        }
        transactions.push(newTransaction)
        localStorage.setItem("fairmonie_transactions", JSON.stringify(transactions))

        // Show receipt
        const now = new Date()
        setReceipt({
          title: "Airtime Purchased",
          status: "success",
          amount: "₦" + (parseFloat(amount) || 0).toLocaleString("en-NG"),
          transactionId: txnId,
          date: now.toLocaleDateString("en-NG"),
          time: now.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
          details: [
            { label: "Network", value: selectedNetwork },
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
          <h1 className="text-2xl font-bold text-gray-900">Buy Airtime</h1>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1a9b5c]">Transaction Successful!</h2>
            <p className="text-gray-700">Your airtime has been purchased successfully.</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Phone Number */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">Phone Number</label>
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-600 placeholder-gray-400"
            required
          />
        </div>

        {/* Select Network */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">Select Network</label>
          <div className="grid grid-cols-2 gap-4">
            {networks.map((network) => (
              <button
                key={network}
                type="button"
                onClick={() => setSelectedNetwork(network)}
                className={`py-4 px-4 rounded-lg font-semibold transition-colors ${
                  selectedNetwork === network
                    ? "bg-[#1a9b5c] text-white"
                    : "border border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {network}
              </button>
            ))}
          </div>
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
