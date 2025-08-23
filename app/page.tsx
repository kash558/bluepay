"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, Play, DollarSign, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MobileMenu from "@/components/mobile-menu"
import CryptoPaymentModal from "@/components/crypto-payment-modal"
import PasscodeDetailsForm from "@/components/passcode-details-form"
import SubscriptionPaymentForm from "@/components/subscription-payment-form"
import BankTransferModal from "@/components/bank-transfer-modal"

// Restore the entire component logic and JSX:
export default function CashTubePage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showInvalidModal, setShowInvalidModal] = useState(false)
  const [showBuyPasscodeModal, setShowBuyPasscodeModal] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null)
  const [showInitialWelcome, setShowInitialWelcome] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCryptoPaymentModal, setShowCryptoPaymentModal] = useState(false)
  const [isLoadingPaymentDetails, setIsLoadingPaymentDetails] = useState(false)

  // New states for the multi-step payment process
  const [showPasscodeDetailsForm, setShowPasscodeDetailsForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showBankTransferModal, setShowBankTransferModal] = useState(false)
  const [pendingPasscode, setPendingPasscode] = useState<{
    detailsData: any
    formData: any
  } | null>(null)

  const testimonials: Testimonial[] = [
    { id: 1, username: "@Elija", amount: "₦370,000", timeAgo: "2min ago" },
    { id: 2, username: "@Sarah", amount: "₦250,000", timeAgo: "5min ago" },
    { id: 3, username: "@Mike", amount: "₦180,000", timeAgo: "8min ago" },
    { id: 4, username: "@Grace", amount: "₦420,000", timeAgo: "12min ago" },
    { id: 5, username: "@David", amount: "₦310,000", timeAgo: "15min ago" },
  ]

  // Passcode plan (similar to subscription plan structure)
  const passcodeplan = {
    type: "passcode" as const,
    name: "Passcode",
    price: 6500,
    duration: "",
    description: "Get your 5-digit login passcode",
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)]
      setCurrentTestimonial(randomTestimonial)

      setTimeout(() => {
        setCurrentTestimonial(null)
      }, 3000)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleNumberClick = (num: string) => {
    if (code.length < 5) {
      const newCode = code + num
      setCode(newCode)

      if (newCode.length === 5) {
        if (newCode !== "12999") {
          setShowInvalidModal(true)
        } else {
          console.log("Correct code entered!")
          router.push("/dashboard")
        }
      }
    }
  }

  const handleClear = () => {
    setCode("")
  }

  const handleLogin = () => {
    if (code.length === 5) {
      if (code !== "12999") {
        setShowInvalidModal(true)
      } else {
        console.log("Correct code entered!")
        router.push("/dashboard")
      }
    } else {
      alert("Please enter a 5-digit code")
    }
  }

  const handleSignUp = () => {
    setShowPasscodeDetailsForm(true)
  }

  const handleBuyPasscode = () => {
    setShowInvalidModal(false)
    setShowPasscodeDetailsForm(true)
  }

  const closeInvalidModal = () => {
    setShowInvalidModal(false)
    setCode("")
  }

  // Handle passcode details completion (Step 1)
  const handlePasscodeDetailsComplete = (detailsData: any) => {
    // Store details and move to payment form
    setPendingPasscode({ detailsData, formData: null })
    setShowPasscodeDetailsForm(false)
    setShowPaymentForm(true)
  }

  // Handle payment form completion (Step 2)
  const handlePaymentComplete = (planType: any, formData: any) => {
    // Update pending passcode with payment form data
    setPendingPasscode((prev) => (prev ? { ...prev, formData } : { detailsData: null, formData }))

    // Close payment form and show bank transfer
    setShowPaymentForm(false)
    setShowBankTransferModal(true)
  }

  // Handle bank transfer confirmation (Step 3)
  const handleBankTransferConfirmed = () => {
    if (!pendingPasscode) return

    // Simulate passcode generation
    const generatedPasscode = "12999" // This would be the actual passcode

    setShowBankTransferModal(false)
    setPendingPasscode(null)

    // Show success message with passcode
    alert(`Payment confirmed! Your 5-digit passcode is: ${generatedPasscode}`)

    // Optionally redirect to dashboard
    // router.push("/dashboard")
  }

  const handleCryptoSignup = () => {
    setIsLoadingPaymentDetails(true) // Start loading
    setTimeout(() => {
      setIsLoadingPaymentDetails(false) // End loading
      setShowCryptoPaymentModal(true) // Open crypto modal
    }, 1500) // Simulate 1.5-second loading time
  }

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Testimonial Notification */}
      {currentTestimonial && (
        <div className="fixed top-2 left-2 right-2 z-50 animate-in slide-in-from-top duration-500">
          <div className="bg-gradient-to-r from-pink-300 to-pink-400 rounded-2xl p-3 shadow-lg">
            <p className="text-sm text-gray-800 font-medium text-center">
              {currentTestimonial.username} withdraw {currentTestimonial.amount}. {currentTestimonial.timeAgo}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-start p-2">
        <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => setShowMobileMenu(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-8 sm:space-y-10">
        {/* Logo */}
        <div className="relative">
          <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
            <div className="flex items-center space-x-2">
              <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white fill-white" />
              <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center space-y-3">
          <h4 className="text-3xl sm:text-4xl font-black text-gray-800">Welcome To</h4>
          <h4 className="text-2xl sm:text-3xl font-black text-pink-500">CashTube2025</h4>
          <p className="text-lg sm:text-xl text-gray-700 font-bold">{"Enter (5) digit code"}</p>
        </div>

        {/* Code Input */}
        <div className="w-full max-w-[280px]">
          <Input
            type="password"
            value={code}
            readOnly
            className="text-center text-2xl sm:text-3xl font-bold h-16 sm:h-20 border-4 border-gray-400 rounded-2xl shadow-lg"
            placeholder=""
          />
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-[280px]">
          {numbers.map((num) => (
            <Button
              key={num}
              variant="outline"
              size="lg"
              className="h-16 w-20 sm:h-20 sm:w-24 text-2xl sm:text-3xl font-black border-4 border-gray-400 hover:bg-gray-100 bg-white shadow-lg rounded-2xl transform transition-all duration-200 hover:scale-105"
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </Button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 sm:space-x-6">
          <Button
            variant="destructive"
            className="px-6 py-4 sm:px-8 sm:py-5 bg-red-500 hover:bg-red-600 text-lg sm:text-xl font-black rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
          <Button
            variant="outline"
            className="px-6 py-4 sm:px-8 sm:py-5 border-4 border-gray-400 text-gray-700 hover:bg-gray-100 bg-white text-lg sm:text-xl font-black rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            className="px-6 py-4 sm:px-8 sm:py-5 bg-green-600 hover:bg-green-700 text-lg sm:text-xl font-black rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105"
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full max-w-[400px]">
          <Button
            className="flex-1 h-14 sm:h-16 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-black rounded-2xl text-lg sm:text-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            onClick={handleCryptoSignup}
          >
            Signup with Crypto
          </Button>
          <Button className="flex-1 h-14 sm:h-16 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-black rounded-2xl text-lg sm:text-xl shadow-lg transform transition-all duration-200 hover:scale-105">
            Other Method
          </Button>
        </div>
      </div>

      {/* Initial Welcome Modal (on site access) */}
      {showInitialWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full relative animate-in zoom-in duration-300 shadow-2xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 h-8 w-8"
              onClick={() => setShowInitialWelcome(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="text-center space-y-4 mt-2">
              <h2 className="text-2xl sm:text-3xl font-black text-red-600">Welcome to Cash Tube2025</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-base sm:text-lg font-bold leading-relaxed">
                  If you have been looking for where to earn money by just watching ads video's.
                </p>
                <p className="text-base sm:text-lg font-bold leading-relaxed">
                  Then you are at the right place, just get your ( 5 ) digit login code and you are good too go.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invalid Passcode Modal */}
      {showInvalidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full relative animate-in zoom-in duration-300 shadow-2xl">
            <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8">
              {/* Error Icon */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-red-400 flex items-center justify-center">
                <X className="h-12 w-12 sm:h-14 sm:w-14 text-red-400" />
              </div>
              {/* Error Message */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-700">Oops...</h2>
                <p className="text-xl sm:text-2xl font-bold text-gray-600">invalid Passcode!</p>
              </div>
              {/* OK Button */}
              <Button
                className="w-32 h-12 sm:h-14 bg-indigo-500 hover:bg-indigo-600 text-white text-lg sm:text-xl font-black rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105"
                onClick={closeInvalidModal}
              >
                OK
              </Button>
              {/* Buy Passcode Link */}
              <div className="pt-4 border-t-2 border-gray-200 w-full text-center">
                <button
                  className="text-orange-500 hover:text-orange-600 text-lg sm:text-xl font-black"
                  onClick={handleBuyPasscode}
                >
                  Buy Passcode?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "Generating payment details..." Overlay */}
      {isLoadingPaymentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 z-[100]">
          <Loader2 className="h-16 w-16 text-white animate-spin mb-4" />
          <p className="text-white text-xl font-medium">Generating payment details...</p>
        </div>
      )}

      {/* Crypto Payment Modal */}
      <CryptoPaymentModal isOpen={showCryptoPaymentModal} onClose={() => setShowCryptoPaymentModal(false)} />

      {/* Mobile Menu Component */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

      {/* Step 1: Passcode Details Form */}
      <PasscodeDetailsForm
        isOpen={showPasscodeDetailsForm}
        onClose={() => {
          setShowPasscodeDetailsForm(false)
        }}
        onDetailsComplete={handlePasscodeDetailsComplete}
      />

      {/* Step 2: Payment Form */}
      <SubscriptionPaymentForm
        isOpen={showPaymentForm}
        onClose={() => {
          setShowPaymentForm(false)
          setPendingPasscode(null)
        }}
        selectedPlan={passcodeplan}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Step 3: Bank Transfer Modal */}
      <BankTransferModal
        isOpen={showBankTransferModal}
        onClose={() => {
          setShowBankTransferModal(false)
          setPendingPasscode(null)
        }}
        userEmail={pendingPasscode?.formData?.email || ""}
        amount={passcodeplan.price}
        planName={passcodeplan.name}
        onPaymentConfirmed={handleBankTransferConfirmed}
      />
    </div>
  )
}

interface Testimonial {
  id: number
  username: string
  amount: string
  timeAgo: string
}
