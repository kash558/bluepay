"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Copy, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FloatingChat } from "@/components/floating-chat"

type PaymentStep = "form" | "processing" | "instructions" | "payment" | "confirmation" | "success" | "not-confirmed"

export default function FaircodePage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<PaymentStep>("form")
  const [agreedToInstructions, setAgreedToInstructions] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("FRC" + Math.random().toString(36).substring(2, 11).toUpperCase())

  const ACCOUNT_DETAILS = {
    accountNumber: "3211850611",
    bank: "PAGA BANK",
    accountName: "TERHILE KELVIN",
    fee: "7,500",
  }

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("fairmonie_currentUser") || "{}")
    if (currentUser.fullName && currentUser.email) {
      setFullName(currentUser.fullName)
      setEmail(currentUser.email)
    }
  }, [])

  const handleProceedPayment = () => {
    setStep("processing")
    setTimeout(() => {
      setStep("instructions")
    }, 2500)
  }

  const playVoiceInstructions = () => {
    if (typeof window === "undefined") return

    const text =
      "Before you make this transfer. Transfer only the exact amount. Do not transfer an incorrect amount. Do not dispute any transactions made to our account. It can cause restrictions and other impacts. Avoid using Opay bank for your payment. This can lead to delays in verifying your payment."

    if ("speechSynthesis" in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      utterance.onend = () => setIsSpeaking(false)

      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleContinueInstructions = () => {
    setStep("payment")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleIHavePaid = () => {
    setStep("confirmation")
    setTimeout(() => {
      // Check if the logged-in user is the special user
      const currentUser = JSON.parse(localStorage.getItem("fairmonie_currentUser") || "{}")
      if (currentUser.email === "mj8643431@gmail.com") {
        setStep("success")
      } else {
        setStep("not-confirmed")
      }
    }, 2000)
  }

  const handleReplayVoice = () => {
    playVoiceInstructions()
  }

  // Auto-play voice when instructions step loads
  useEffect(() => {
    if (step === "instructions") {
      playVoiceInstructions()
    }
  }, [step])

  // Step 1: Form (Initial)
  if (step === "form") {
    return (
      <div className="min-h-screen bg-[#e8f5ec]">
        <div className="bg-[#1a9b5c] text-white p-5 flex items-center gap-4">
          <button onClick={() => router.back()} className="hover:opacity-80">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Buy Faircode</h1>
        </div>

        <div className="p-5">
          <div className="max-w-md mx-auto bg-white rounded-2xl p-6 space-y-6">
            <div className="bg-[#e8f5ec] rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">💳</div>
              <h2 className="text-2xl font-bold text-[#1a9b5c] mb-2">Faircode Purchase</h2>
              <p className="text-3xl font-bold text-[#1a9b5c] mb-1">₦7,500</p>
              <p className="text-gray-600">One-time purchase</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleProceedPayment()
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Full Name *</label>
                <Input
                  type="text"
                  value={fullName}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address *</label>
                <Input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-3 bg-[#1a9b5c] hover:bg-[#168a4f] text-white font-bold rounded-full text-base"
              >
                Proceed to Payment
              </Button>
            </form>
          </div>
        </div>

        <FloatingChat />
      </div>
    )
  }

  // Step 2: Processing Screen
  if (step === "processing") {
    return (
      <div className="min-h-screen bg-[#e8f5ec] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-[#1a9b5c] border-t-transparent animate-spin"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#1a9b5c] mb-3">Processing...</h2>
            <p className="text-[#1a9b5c] text-lg">Preparing payment account details</p>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Instructions Modal (Overlay, not scrollable)
  if (step === "instructions") {
    return (
      <div className="min-h-screen bg-[#f5f6f7]">
        {/* Background payment screen visible */}
        <div className="bg-[#1a9b5c] text-white p-5 flex items-center gap-4 sticky top-0 z-10">
          <button onClick={() => setStep("form")} className="hover:opacity-80">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Make Payment</h1>
        </div>

        {/* Overlay Modal - Fixed, not scrollable */}
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 space-y-5 sm:space-y-6 relative overflow-hidden">
            <button
              onClick={() => setStep("form")}
              className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 text-3xl w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>

            <div className="text-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#e8f5ec] flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#1a9b5c] flex items-center justify-center text-white">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white"></div>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Pay NGN 7,500.00</h2>
              <p className="text-sm sm:text-base text-gray-600">Important instructions</p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              <div className="flex gap-2 sm:gap-3">
                <span className="text-[#1a9b5c] text-lg sm:text-2xl flex-shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-[#d97706] text-sm">Transfer exact amount</p>
                  <p className="text-gray-600 text-xs">Do not transfer incorrectly.</p>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <span className="text-[#1a9b5c] text-lg sm:text-2xl flex-shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-[#d97706] text-sm">Don't dispute transactions</p>
                  <p className="text-gray-600 text-xs">Can cause restrictions.</p>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <span className="text-[#1a9b5c] text-lg sm:text-2xl flex-shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-[#d97706] text-sm">Avoid Opay for payment</p>
                  <p className="text-gray-600 text-xs">May delay verification.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleReplayVoice}
              className="w-full py-2 text-sm border-2 border-[#1a9b5c] text-[#1a9b5c] font-semibold rounded-lg hover:bg-[#e8f5ec] transition"
            >
              🔊 Replay Instructions
            </button>

            <Button
              onClick={handleContinueInstructions}
              className="w-full py-2 sm:py-3 text-sm sm:text-base bg-[#1a9b5c] hover:bg-[#168a4f] text-white font-bold rounded-full"
            >
              I Understand, Continue
            </Button>
          </div>
        </div>

        <FloatingChat />
      </div>
    )
  }

  // Step 4: Payment Screen
  if (step === "payment") {
    return (
      <div className="min-h-screen bg-[#f5f6f7]">
        <div className="bg-[#1a9b5c] text-white p-5 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setStep("form")} className="hover:opacity-80">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Make Payment</h1>
        </div>

        <div className="p-4 sm:p-5">
          <div className="max-w-sm mx-auto bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4">
            {/* Header */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e8f5ec] flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#1a9b5c] flex items-center justify-center text-white text-lg sm:text-2xl">
                  💳
                </div>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-[#1a9b5c] mb-1">Make Payment</h2>
              <p className="text-xs sm:text-sm text-[#1a9b5c]">Transfer to account below</p>
            </div>

            {/* Account Number */}
            <div className="bg-[#e8f5ec] rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Account Number</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{ACCOUNT_DETAILS.accountNumber}</p>
                <button
                  onClick={() =>
                    handleCopyToClipboard(ACCOUNT_DETAILS.accountNumber, "account")
                  }
                  className="p-1 hover:bg-white rounded transition flex-shrink-0"
                >
                  {copiedField === "account" ? (
                    <span className="text-green-600 text-lg">✓</span>
                  ) : (
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a9b5c]" />
                  )}
                </button>
              </div>
            </div>

            {/* Bank */}
            <div className="bg-[#e8f5ec] rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Bank</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">{ACCOUNT_DETAILS.bank}</p>
            </div>

            {/* Account Name */}
            <div className="bg-[#e8f5ec] rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Account Name</p>
              <p className="text-2xl font-bold text-gray-900">{ACCOUNT_DETAILS.accountName}</p>
            </div>

            {/* Fee */}
            <div className="border-2 border-[#1a9b5c] rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Fee</p>
              <p className="text-4xl font-bold text-[#1a9b5c]">{ACCOUNT_DETAILS.fee}</p>
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-[#1a9b5c] rounded-lg p-6 text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5 text-[#1a9b5c]" />
                <p className="text-sm font-semibold text-gray-800">
                  Upload payment screenshot <span className="text-red-500">*</span>
                </p>
              </div>

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Payment proof"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="block">
                  <div className="bg-[#c8e6c9] hover:bg-[#b2dfdb] rounded-lg py-3 px-4 cursor-pointer transition text-[#1a9b5c] font-semibold">
                    ⬆ Choose image
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}

              <p className="text-xs text-[#1a9b5c]">
                Upload: your payment receipt for fast verification.
              </p>
            </div>

            {/* I Have Paid Button */}
            <Button
              onClick={handleIHavePaid}
              disabled={!uploadedImage}
              className="w-full py-3 bg-[#1a9b5c] hover:bg-[#168a4f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full text-lg"
            >
              I have paid
            </Button>
          </div>
        </div>

        <FloatingChat />
      </div>
    )
  }

  // Step 5: Confirmation Loading
  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-[#e8f5ec] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-[#1a9b5c] border-t-transparent animate-spin"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#1a9b5c] mb-3">Verifying Payment...</h2>
            <p className="text-[#1a9b5c] text-lg">Please wait while we confirm your transaction</p>
          </div>
        </div>
      </div>
    )
  }

  // Step 6: Payment Successful
  if (step === "success") {
    const currentUser = JSON.parse(localStorage.getItem("fairmonie_currentUser") || "{}")

    const handleCopyCode = () => {
      navigator.clipboard.writeText(generatedCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }

    const handleDone = () => {
      router.push("/dashboard")
    }

    return (
      <div className="min-h-screen bg-[#e8f5ec]">
        <div className="bg-[#1a9b5c] text-white p-5 flex items-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="hover:opacity-80">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Payment Successful</h1>
        </div>

        <div className="p-5 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 space-y-6 text-center">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-[#e8f5ec] flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#1a9b5c] flex items-center justify-center text-4xl">
                  ✓
                </div>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-3xl font-bold text-[#1a9b5c] mb-3">Payment Confirmed!</h2>
              <p className="text-gray-700">
                Your payment has been confirmed successfully. Here is your Fair Code:
              </p>
            </div>

            {/* Fair Code Box */}
            <div className="bg-[#e8f5ec] rounded-xl p-6 space-y-2">
              <p className="text-sm text-gray-600">Your Fair Code</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-3xl font-bold text-[#1a9b5c]">{generatedCode}</p>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-white rounded-lg transition"
                >
                  {copiedCode ? (
                    <span className="text-green-600 text-2xl">✓</span>
                  ) : (
                    <Copy className="w-6 h-6 text-[#1a9b5c]" />
                  )}
                </button>
              </div>
            </div>

            {/* Info Text */}
            <p className="text-gray-600 text-sm">
              Save this code safely. You will need it for future transactions. This code can only be used by {currentUser.email}.
            </p>

            {/* Done Button */}
            <Button
              onClick={handleDone}
              className="w-full py-3 bg-[#1a9b5c] hover:bg-[#168a4f] text-white font-bold rounded-full text-base"
            >
              Done
            </Button>
          </div>
        </div>

        <FloatingChat />
      </div>
    )
  }

  // Step 7: Payment Not Confirmed
  if (step === "not-confirmed") {
    return (
      <div className="min-h-screen bg-[#f5f6f7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <span className="text-4xl">✕</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Not Confirmed</h2>
            <p className="text-gray-600 mb-4">
              We couldn&apos;t verify your payment. Please check the details and try again.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                setUploadedImage(null)
                setImagePreview(null)
                setAgreedToInstructions(false)
                setStep("payment")
              }}
              className="w-full py-3 bg-[#1a9b5c] hover:bg-[#168a4f] text-white font-bold rounded-full"
            >
              Try Again
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

        <FloatingChat />
      </div>
    )
  }

  return null
}
