"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, Play, DollarSign, X, Loader2, Check } from "lucide-react"
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
  const [showAccountValidated, setShowAccountValidated] = useState(false)

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

  // Check if code is valid special code
  const isValidSpecialCode = (inputCode: string) => {
    if (typeof window !== "undefined") {
      const pendingCode = localStorage.getItem("cashtube_pending_special_code")
      return pendingCode === inputCode
    }
    return false
  }

  // Mark special code as used
  const markSpecialCodeAsUsed = (code: string) => {
    if (typeof window !== "undefined") {
      // Add to used codes list
      const usedCodes = JSON.parse(localStorage.getItem("cashtube_used_codes") || "[]")
      usedCodes.push(code)
      localStorage.setItem("cashtube_used_codes", JSON.stringify(usedCodes))

      // Remove from pending
      localStorage.removeItem("cashtube_pending_special_code")
    }
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
        // Check for special generated code first
        if (isValidSpecialCode(newCode)) {
          // Valid special code - show validation popup and activate subscription
          setShowAccountValidated(true)

          // Create special subscription with unlimited withdrawal access
          const specialSubscription = {
            type: "super",
            code: newCode,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
            isActive: true,
          }
          localStorage.setItem("cashtube_subscription", JSON.stringify(specialSubscription))

          // Mark code as used (one-time use)
          markSpecialCodeAsUsed(newCode)

          // Redirect after showing popup
          setTimeout(() => {
            setShowAccountValidated(false)
            router.push("/dashboard")
          }, 3000)
          return
        }

        // Check for other special subscription codes
        if (newCode === "20251") {
          // Basic subscription - activate immediately
          const basicSubscription = {
            type: "basic",
            code: "202512",
            expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day
            isActive: true,
          }
          if (typeof window !== "undefined") {
            localStorage.setItem("cashtube_subscription", JSON.stringify(basicSubscription))
          }
          router.push("/dashboard")
        } else if (newCode === "20252") {
          // Smart subscription - activate immediately
          const smartSubscription = {
            type: "smart",
            code: "202520",
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            isActive: true,
          }
          if (typeof window !== "undefined") {
            localStorage.setItem("cashtube_subscription", JSON.stringify(smartSubscription))
          }
          router.push("/dashboard")
        } else if (newCode === "20061") {
          // Super subscription - activate immediately
          const superSubscription = {
            type: "super",
            code: "200612",
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            isActive: true,
          }
          if (typeof window !== "undefined") {
            localStorage.setItem("cashtube_subscription", JSON.stringify(superSubscription))
          }
          router.push("/dashboard")
        } else if (newCode !== "12999") {
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
      // Check for special generated code first
      if (isValidSpecialCode(code)) {
        // Valid special code - show validation popup and activate subscription
        setShowAccountValidated(true)

        // Create special subscription with unlimited withdrawal access
        const specialSubscription = {
          type: "super",
          code: code,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
          isActive: true,
        }
        localStorage.setItem("cashtube_subscription", JSON.stringify(specialSubscription))

        // Mark code as used (one-time use)
        markSpecialCodeAsUsed(code)

        // Redirect after showing popup
        setTimeout(() => {
          setShowAccountValidated(false)
          router.push("/dashboard")
        }, 3000)
        return
      }

      // Rest of the existing login logic...
      if (code === "20251") {
        // Basic subscription - activate immediately
        const basicSubscription = {
          type: "basic",
          code: "202512",
          expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day
          isActive: true,
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("cashtube_subscription", JSON.stringify(basicSubscription))
        }
        router.push("/dashboard")
      } else if (code === "20252") {
        // Smart subscription - activate immediately
        const smartSubscription = {
          type: "smart",
          code: "202520",
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          isActive: true,
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("cashtube_subscription", JSON.stringify(smartSubscription))
        }
        router.push("/dashboard")
      } else if (code === "20061") {
        // Super subscription - activate immediately
        const superSubscription = {
          type: "super",
          code: "200612",
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          isActive: true,
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("cashtube_subscription", JSON.stringify(superSubscription))
        }
        router.push("/dashboard")
      } else if (code !== "12999") {
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
    // Store user name in localStorage for dashboard use
    if (typeof window !== "undefined" && detailsData.name) {
      localStorage.setItem("cashtube_user_name", detailsData.name)
    }

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

      {/* Header - Menu button in top left and extra bold */}
      <div className="flex justify-start p-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-600 font-black hover:bg-blue-50"
          onClick={() => setShowMobileMenu(true)}
        >
          <Menu className="h-6 w-6 font-black" strokeWidth={4} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-6">
        {/* Logo */}
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="flex items-center space-x-1">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-white" />
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center space-y-2">
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-800">Welcome To</h4>
          <h4 className="text-lg sm:text-xl font-semibold text-pink-500">CashTube2025</h4>
          <p className="text-sm sm:text-base text-gray-700 font-medium">{"Enter (5) digit code"}</p>
        </div>

        {/* Code Input */}
        <div className="w-full max-w-[180px] sm:max-w-[200px]">
          <Input
            type="password"
            value={code}
            readOnly
            className="text-center text-lg sm:text-xl font-medium h-10 sm:h-12 border-2 border-gray-300 rounded-lg shadow-sm"
            placeholder=""
          />
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-[200px] sm:max-w-[240px]">
          {numbers.map((num) => (
            <Button
              key={num}
              variant="outline"
              size="lg"
              className="h-12 w-16 sm:h-14 sm:w-18 text-lg sm:text-xl font-medium border-2 border-gray-300 hover:bg-gray-100 bg-white shadow-sm rounded-lg"
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </Button>
          ))}
        </div>

        {/* Action Buttons - Added more spacing */}
        <div className="flex space-x-4 sm:space-x-5">
          <Button
            variant="destructive"
            className="px-5 py-3 sm:px-6 sm:py-3 bg-red-500 hover:bg-red-600 text-sm sm:text-base font-medium rounded-lg shadow-sm"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
          <Button
            variant="outline"
            className="px-5 py-3 sm:px-6 sm:py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 bg-white text-sm sm:text-base font-medium rounded-lg shadow-sm"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            className="px-5 py-3 sm:px-6 sm:py-3 bg-green-600 hover:bg-green-700 text-sm sm:text-base font-medium rounded-lg shadow-sm"
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>

        {/* Bottom Buttons - Added more spacing */}
        <div className="flex flex-col space-y-4 sm:space-y-5 w-full max-w-[280px] sm:max-w-[320px]">
          <Button
            className="h-11 sm:h-12 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium rounded-lg text-sm sm:text-base shadow-sm"
            onClick={handleCryptoSignup}
          >
            Signup with Crypto
          </Button>
          <Button className="h-11 sm:h-12 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium rounded-lg text-sm sm:text-base shadow-sm">
            Other Method
          </Button>
        </div>
      </div>

      {/* Initial Welcome Modal (on site access) */}
      {showInitialWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
          <div className="bg-gray-200 rounded-xl p-4 max-w-xs w-full relative animate-in zoom-in duration-300 shadow-md">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 h-6 w-6"
              onClick={() => setShowInitialWelcome(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="text-center space-y-3 mt-2">
              <h2 className="text-lg font-semibold text-red-600">Welcome to Cash Tube2025</h2>
              <div className="space-y-2 text-gray-700">
                <p className="text-sm font-medium leading-relaxed">
                  If you have been looking for where to earn money by just watching ads video's.
                </p>
                <p className="text-sm font-medium leading-relaxed">
                  Then you are at the right place, just get your ( 5 ) digit login code and you are good too go.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invalid Passcode Modal */}
      {showInvalidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-xl p-4 max-w-xs w-full relative animate-in zoom-in duration-300 shadow-md">
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Error Icon */}
              <div className="w-16 h-16 rounded-full border-4 border-red-400 flex items-center justify-center">
                <X className="h-8 w-8 text-red-400" />
              </div>
              {/* Error Message */}
              <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold text-gray-700">Oops...</h2>
                <p className="text-base font-medium text-gray-600">invalid Passcode!</p>
              </div>
              {/* OK Button */}
              <Button
                className="w-24 h-9 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm"
                onClick={closeInvalidModal}
              >
                OK
              </Button>
              {/* Buy Passcode Link */}
              <div className="pt-3 border-t border-gray-200 w-full text-center">
                <button
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
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

      {/* Account Validated Modal */}
      {showAccountValidated && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-xl p-6 max-w-xs w-full relative animate-in zoom-in duration-300 shadow-md">
            <div className="text-center space-y-4">
              {/* Success Icon */}
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-white" />
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-green-600">Account Validated!</h2>
                <p className="text-base font-medium text-gray-700">Subscription Active</p>
                <p className="text-sm text-gray-600">You can now withdraw freely</p>
              </div>

              {/* Loading indicator */}
              <div className="flex justify-center">
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface Testimonial {
  id: number
  username: string
  amount: string
  timeAgo: string
}
