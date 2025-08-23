"use client"

import type React from "react"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SubscriptionPaymentFormProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan: {
    type: "basic" | "smart" | "super"
    name: string
    price: number
    duration: string
    description: string
  } | null
  onPaymentComplete: (planType: "basic" | "smart" | "super", formData: PaymentFormData) => void
}

interface PaymentFormData {
  fullName: string
  email: string
  amount: number
}

export default function SubscriptionPaymentForm({
  isOpen,
  onClose,
  selectedPlan,
  onPaymentComplete,
}: SubscriptionPaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    fullName: "",
    email: "",
    amount: selectedPlan?.price || 0,
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlan || !formData.fullName.trim() || !formData.email.trim()) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      onPaymentComplete(selectedPlan.type, formData)
      setIsProcessing(false)

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        amount: selectedPlan?.price || 0,
      })
    }, 2000)
  }

  if (!isOpen || !selectedPlan) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-[60]">
      <div className="relative w-full max-w-lg">
        {/* Background matching the design */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10 h-10 w-10"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">CashTube.com</h1>
            {selectedPlan.duration && (
              <p className="text-white/90 text-lg sm:text-xl font-semibold">
                {selectedPlan.name} Plan - {selectedPlan.duration}
              </p>
            )}
            {!selectedPlan.duration && (
              <p className="text-white/90 text-lg sm:text-xl font-semibold">{selectedPlan.name}</p>
            )}
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Amount Field */}
              <div>
                <label className="block text-gray-700 text-xl sm:text-2xl font-bold mb-4">Amount</label>
                <Input
                  type="text"
                  value={`₦${selectedPlan.price.toLocaleString()}`}
                  readOnly
                  className="w-full h-16 sm:h-20 text-xl sm:text-2xl font-bold bg-gray-50 border-2 border-gray-300 rounded-2xl px-6 text-center"
                />
              </div>

              {/* Full Name Field */}
              <div>
                <label className="block text-gray-700 text-xl sm:text-2xl font-bold mb-4">Full Name</label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full h-16 sm:h-20 text-lg sm:text-xl font-semibold border-2 border-gray-300 rounded-2xl px-6"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 text-xl sm:text-2xl font-bold mb-4">Your Email Address</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email address"
                  className="w-full h-16 sm:h-20 text-lg sm:text-xl font-semibold border-2 border-gray-300 rounded-2xl px-6"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full h-16 sm:h-20 bg-indigo-800 hover:bg-indigo-900 text-white text-xl sm:text-2xl font-black rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 mr-3 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed"
                )}
              </Button>
            </form>

            {/* Powered by Flutterwave */}
            <div className="flex items-center justify-center mt-8 text-gray-600">
              <span className="text-base sm:text-lg font-semibold mr-3">Powered by</span>
              <div className="flex items-center">
                <img
                  src="/images/flutterwave-logo.jpeg"
                  alt="Flutterwave"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg mr-3 object-cover"
                />
                <span className="text-base sm:text-lg font-bold">flutterwave</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
