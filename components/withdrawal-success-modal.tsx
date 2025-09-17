"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface WithdrawalSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  withdrawalData: {
    amount: number
    bank: string
    accountNumber: string
    accountName: string
    transactionId: string
  }
}

export default function WithdrawalSuccessModal({ isOpen, onClose, withdrawalData }: WithdrawalSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[80]">
      <div className="bg-white rounded-lg w-full max-w-sm mx-auto overflow-hidden shadow-xl">
        {/* Purple Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
          <h1 className="text-white text-xl font-bold text-center">Withdrawal Result</h1>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-7 w-7 text-white stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Withdrawal Successful!</h2>
          <p className="text-gray-600 mb-8">Your withdrawal has been processed successfully.</p>

          {/* Withdrawal Details */}
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-lg">₦{withdrawalData.amount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bank:</span>
              <span className="font-semibold text-right max-w-[200px] break-words">{withdrawalData.bank}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Account Number:</span>
              <span className="font-semibold">{withdrawalData.accountNumber}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-600">Account Name:</span>
              <span className="font-semibold text-right max-w-[200px] break-words">{withdrawalData.accountName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-semibold">{withdrawalData.transactionId}</span>
            </div>
          </div>

          {/* Back to Dashboard Button */}
          <Button
            onClick={onClose}
            className="w-full mt-8 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-full text-lg font-medium"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-500 text-sm">CASHTUBE/ADS Ltd</p>
        </div>
      </div>
    </div>
  )
}
