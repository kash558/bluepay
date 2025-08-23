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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-[60]">
      <div className="relative w-full max-w-xs">
        {/* Background matching the design */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-xl p-4 relative overflow-hidden shadow-md max-h-[95vh] overflow-y-auto">
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white hover:bg-white/20 z-10 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-lg font-semibold text-white mb-1">CashTube.com</h1>
            {selectedPlan.duration && (
              <p className="text-white/90 text-xs font-medium">
                {selectedPlan.name} Plan - {selectedPlan.duration}
              </p>
            )}
            {!selectedPlan.duration && <p className="text-white/90 text-xs font-medium">{selectedPlan.name}</p>}
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Amount Field */}
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Amount</label>
                <Input
                  type="text"
                  value={`₦${selectedPlan.price.toLocaleString()}`}
                  readOnly
                  className="w-full h-9 text-sm font-medium bg-gray-50 border border-gray-200 rounded-md px-3 text-center"
                />
              </div>

              {/* Full Name Field */}
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Full Name</label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full h-9 text-sm font-medium border border-gray-200 rounded-md px-3"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Your Email Address</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email address"
                  className="w-full h-9 text-sm font-medium border border-gray-200 rounded-md px-3"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full h-9 bg-indigo-800 hover:bg-indigo-900 text-white text-sm font-medium rounded-md shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed"
                )}
              </Button>
            </form>

            {/* Powered by Flutterwave */}
            <div className="flex items-center justify-center mt-3 text-gray-600">
              <span className="text-xs font-medium mr-1">Powered by</span>
              <div className="flex items-center">
                <img
                  src="/images/flutterwave-logo.jpeg"
                  alt="Flutterwave"
                  className="w-4 h-4 rounded-sm mr-1 object-cover"
                />
                <span className="text-xs font-medium">flutterwave</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
