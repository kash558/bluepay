"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingChat } from "@/components/floating-chat"

export default function PaymentStatusPage() {
  const router = useRouter()

  // Mock withdrawal data - in real app, would come from props or state
  const withdrawalData = {
    amount: "₦250000",
    bank: "Opay",
    account: "7086231186",
    status: "Completed",
    date: new Date().toLocaleDateString("en-NG"),
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      {/* Header */}
      <div className="bg-[#1a9b5c] text-white p-5 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => router.push("/dashboard")} className="hover:opacity-80">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Withdrawal Successful</h1>
      </div>

      {/* Content */}
      <div className="p-5 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-[#e8f5ec] flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-[#1a9b5c] flex items-center justify-center text-4xl font-bold text-white">
                ✓
              </div>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-bold text-[#1a9b5c] mb-2">Withdrawal Successful!</h2>
            <p className="text-gray-700">
              Your withdrawal has been processed successfully. Here are your transaction details:
            </p>
          </div>

          {/* Transaction Receipt */}
          <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4 border border-gray-200">
            <h3 className="font-bold text-gray-900 text-center mb-4">Transaction Receipt</h3>

            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-[#1a9b5c]">{withdrawalData.amount}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-600">Bank:</span>
              <span className="font-bold text-gray-900">{withdrawalData.bank}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-600">Account:</span>
              <span className="font-bold text-gray-900">{withdrawalData.account}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-600">Status:</span>
              <span className="font-bold text-green-600">{withdrawalData.status}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date:</span>
              <span className="font-bold text-gray-900">{withdrawalData.date}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => {
                navigator.share?.({
                  title: "Withdrawal Successful",
                  text: `I just successfully withdrew ${withdrawalData.amount} from FairMonie Pay!`,
                })
              }}
              className="w-full py-3 bg-[#1a9b5c] hover:bg-[#168a4f] text-white font-bold rounded-full"
            >
              Share Success Story
            </Button>

            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="w-full py-3 border-2 border-[#1a9b5c] text-[#1a9b5c] font-bold rounded-full hover:bg-[#e8f5ec]"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <FloatingChat />
    </div>
  )
}
