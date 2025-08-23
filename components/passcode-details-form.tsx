"use client"

import type React from "react"
import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PasscodeDetailsFormProps {
  isOpen: boolean
  onClose: () => void
  onDetailsComplete: (detailsData: PasscodeDetailsData) => void
}

interface PasscodeDetailsData {
  name: string
  number: string
  amount: number
}

export default function PasscodeDetailsForm({ isOpen, onClose, onDetailsComplete }: PasscodeDetailsFormProps) {
  const [formData, setFormData] = useState<PasscodeDetailsData>({
    name: "",
    number: "",
    amount: 6500,
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

    if (!formData.name.trim() || !formData.number.trim()) {
      alert("Please fill in all required fields")
      return
    }

    if (formData.number.length < 10) {
      alert("Please enter a valid phone number")
      return
    }

    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      onDetailsComplete(formData)
      setIsProcessing(false)

      // Reset form
      setFormData({
        name: "",
        number: "",
        amount: 6500,
      })
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-[60]">
      <div className="relative w-full max-w-lg">
        {/* Background */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10 h-10 w-10"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-4">Buy Your passcode</h1>
            <p className="text-base sm:text-lg text-gray-600 font-semibold leading-relaxed">
              Please provide your details, note that your passcode will be reviewed immediately your payment is
              completed
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Name Field */}
            <div>
              <label className="block text-gray-800 text-xl sm:text-2xl font-bold mb-4">Name:</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full h-16 sm:h-20 text-lg sm:text-xl font-semibold border-2 border-gray-300 rounded-2xl px-6 bg-gray-50"
                required
              />
            </div>

            {/* Number Field */}
            <div>
              <label className="block text-gray-800 text-xl sm:text-2xl font-bold mb-4">Number:</label>
              <Input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full h-16 sm:h-20 text-lg sm:text-xl font-semibold border-2 border-gray-300 rounded-2xl px-6 bg-gray-50"
                maxLength={11}
                required
              />
            </div>

            {/* Amount Field */}
            <div>
              <label className="block text-gray-800 text-xl sm:text-2xl font-bold mb-4">Amount:</label>
              <Input
                type="text"
                value={`₦${formData.amount.toLocaleString()}`}
                readOnly
                className="w-full h-16 sm:h-20 text-xl sm:text-2xl font-bold bg-gray-100 border-2 border-gray-300 rounded-2xl px-6 text-center"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full h-16 sm:h-20 bg-purple-600 hover:bg-purple-700 text-white text-xl sm:text-2xl font-black rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 mr-3 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>

          {/* Footer Information */}
          <div className="mt-8 sm:mt-12 space-y-4 text-gray-700">
            <p className="text-base sm:text-lg font-bold leading-relaxed">
              You have to make payment of <span className="text-purple-600 font-black">₦6,500</span> in order to be
              granted full access to the <span className="text-pink-400 font-bold">CASH-TUBE</span> video earning app.
            </p>
            <p className="text-base sm:text-lg font-bold leading-relaxed">
              Please note that you can withdraw back your <span className="text-purple-600 font-black">₦6,500</span>
              immediately you gain access to your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
