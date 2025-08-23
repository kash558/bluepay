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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-[60]">
      <div className="relative w-full max-w-xs">
        {/* Background */}
        <div className="bg-white rounded-xl p-4 relative overflow-hidden shadow-md max-h-[95vh] overflow-y-auto">
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header */}
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-2">Buy Your passcode</h1>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Please provide your details, note that your passcode will be reviewed immediately your payment is
              completed
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Field */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">Name:</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full h-9 text-sm font-medium border border-gray-300 rounded-md px-3 bg-gray-50"
                required
              />
            </div>

            {/* Number Field */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">Number:</label>
              <Input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full h-9 text-sm font-medium border border-gray-300 rounded-md px-3 bg-gray-50"
                maxLength={11}
                required
              />
            </div>

            {/* Amount Field */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">Amount:</label>
              <Input
                type="text"
                value={`₦${formData.amount.toLocaleString()}`}
                readOnly
                className="w-full h-9 text-sm font-medium bg-gray-100 border border-gray-300 rounded-md px-3 text-center"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full h-9 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md shadow-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>

          {/* Footer Information */}
          <div className="mt-4 space-y-2 text-gray-700">
            <p className="text-xs font-medium leading-relaxed">
              You have to make payment of <span className="text-purple-600 font-semibold">₦6,500</span> in order to be
              granted full access to the <span className="text-pink-400 font-medium">CASH-TUBE</span> video earning app.
            </p>
            <p className="text-xs font-medium leading-relaxed">
              Please note that you can withdraw back your <span className="text-purple-600 font-semibold">₦6,500</span>
              immediately you gain access to your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
