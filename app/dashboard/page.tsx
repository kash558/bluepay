"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Play, Pause, Volume2, Maximize, MoreVertical, LogOut, X, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastContainer, type Toast } from "@/components/toast"
import SubscriptionPaymentForm from "@/components/subscription-payment-form"
import BankTransferModal from "@/components/bank-transfer-modal"

interface UserActivity {
  videosWatched: number
  totalEarnings: number
  withdrawalsMade: number
  lastActive: string
  joinDate: string
}

interface Subscription {
  type: "basic" | "smart" | "super"
  code: string
  expiryDate: string
  isActive: boolean
}

interface WithdrawalRecord {
  id: number
  amount: number
  bank: string
  accountNumber: string
  accountName: string
  date: string
  status: string
  reference: string
}

export default function DashboardPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Get user name from localStorage
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("cashtube_user_name")
      return savedName || "Valid User"
    }
    return "Valid User"
  })

  // Initialize state with localStorage data or defaults
  const [balance, setBalance] = useState(() => {
    if (typeof window !== "undefined") {
      const savedBalance = localStorage.getItem("cashtube_balance")
      return savedBalance ? Number.parseInt(savedBalance) : 6500
    }
    return 6500
  })

  const [userActivity, setUserActivity] = useState<UserActivity>(() => {
    if (typeof window !== "undefined") {
      const savedActivity = localStorage.getItem("cashtube_user_activity")
      if (savedActivity) {
        return JSON.parse(savedActivity)
      }
    }
    return {
      videosWatched: 0,
      totalEarnings: 0,
      withdrawalsMade: 0,
      lastActive: new Date().toISOString(),
      joinDate: new Date().toISOString().split("T")[0],
    }
  })

  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRecord[]>(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("cashtube_withdrawal_history")
      return savedHistory ? JSON.parse(savedHistory) : []
    }
    return []
  })

  const [userSubscription, setUserSubscription] = useState<Subscription | null>(() => {
    if (typeof window !== "undefined") {
      const savedSubscription = localStorage.getItem("cashtube_subscription")
      if (savedSubscription) {
        const subscription = JSON.parse(savedSubscription)
        // Check if subscription is still valid
        const now = new Date()
        const expiry = new Date(subscription.expiryDate)
        if (now < expiry && subscription.isActive) {
          return subscription
        } else {
          // Remove expired subscription
          localStorage.removeItem("cashtube_subscription")
          return null
        }
      }
    }
    return null
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [selectedBank, setSelectedBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [withdrawalCode, setWithdrawalCode] = useState("")
  const [showWithdrawalHistory, setShowWithdrawalHistory] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    type: "basic" | "smart" | "super"
    name: string
    price: number
    duration: string
    description: string
  } | null>(null)
  const [showBankTransferModal, setShowBankTransferModal] = useState(false)
  const [pendingSubscription, setPendingSubscription] = useState<{
    plan: any
    formData: any
  } | null>(null)

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cashtube_balance", balance.toString())
    }
  }, [balance])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cashtube_user_activity", JSON.stringify(userActivity))
    }
  }, [userActivity])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cashtube_withdrawal_history", JSON.stringify(withdrawalHistory))
    }
  }, [withdrawalHistory])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (userSubscription) {
        localStorage.setItem("cashtube_subscription", JSON.stringify(userSubscription))
      } else {
        localStorage.removeItem("cashtube_subscription")
      }
    }
  }, [userSubscription])

  // Nigerian Banks List
  const nigerianBanks = [
    "Access Bank",
    "Citibank Nigeria",
    "Ecobank Nigeria",
    "Fidelity Bank",
    "First Bank of Nigeria",
    "First City Monument Bank (FCMB)",
    "Guaranty Trust Bank (GTBank)",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Providus Bank",
    "Stanbic IBTC Bank",
    "Standard Chartered Bank",
    "Sterling Bank",
    "SunTrust Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa (UBA)",
    "Unity Bank",
    "Wema Bank",
    "Zenith Bank",
    "Jaiz Bank",
    "TAJ Bank",
    "Titan Trust Bank",
    "Globus Bank",
    "PremiumTrust Bank",
    "Parallex Bank",
    "Kuda Bank",
    "VFD Microfinance Bank",
    "Rubies Bank",
    "Hackman Microfinance Bank",
    "LAPO Microfinance Bank",
    "NPF Microfinance Bank",
    "Sparkle Microfinance Bank",
    "AB Microfinance Bank",
    "Accion Microfinance Bank",
    "Addosser Microfinance Bank",
    "Advans La Fayette Microfinance Bank",
    "Amju Unique Microfinance Bank",
    "Bowen Microfinance Bank",
    "Carbon Microfinance Bank",
    "CEMCS Microfinance Bank",
    "Dot Microfinance Bank",
    "Eyowo Microfinance Bank",
    "Fairmoney Microfinance Bank",
    "Finca Microfinance Bank",
    "GoMoney Microfinance Bank",
    "Grooming Microfinance Bank",
    "Hasal Microfinance Bank",
    "Ibile Microfinance Bank",
    "Ikoyi Osun Microfinance Bank",
    "Imowo Microfinance Bank",
    "Infinity Microfinance Bank",
    "Kredi Money Microfinance Bank",
    "Lagos Building Investment Company",
    "Mayfair Microfinance Bank",
    "Mint Microfinance Bank",
    "Moniepoint Microfinance Bank",
    "Paga Microfinance Bank",
    "PalmPay Microfinance Bank",
    "Parkway Microfinance Bank",
    "Paystack Microfinance Bank",
    "Peace Microfinance Bank",
    "Personal Trust Microfinance Bank",
    "Petra Microfinance Bank",
    "Quickfund Microfinance Bank",
    "Renmoney Microfinance Bank",
    "Reputable Microfinance Bank",
    "Safe Haven Microfinance Bank",
    "Shield Microfinance Bank",
    "Stellas Microfinance Bank",
    "TagPay Microfinance Bank",
    "Tangerine Money Microfinance Bank",
    "Uhuru Microfinance Bank",
    "Unical Microfinance Bank",
    "Venture Garden Microfinance Bank",
    "Xpress Payments Microfinance Bank",
  ]

  // Sample video URLs
  const videoUrls = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  ]

  // Subscription plans
  const subscriptionPlans = [
    {
      type: "basic" as const,
      name: "Basic",
      price: 6500,
      duration: "1 Day",
      description: "Withdrawal access for 24 hours",
      color: "bg-blue-500",
    },
    {
      type: "smart" as const,
      name: "Smart",
      price: 10500,
      duration: "1 Week",
      description: "Withdrawal access for 7 days",
      color: "bg-purple-500",
    },
    {
      type: "super" as const,
      name: "Super",
      price: 20000,
      duration: "1 Month",
      description: "Withdrawal access for 30 days",
      color: "bg-gold-500",
    },
  ]

  // Toast functions
  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showSuccessToast = (title: string, message: string) => {
    addToast({ type: "success", title, message })
  }

  const showErrorToast = (title: string, message: string) => {
    addToast({ type: "error", title, message })
  }

  const showWarningToast = (title: string, message: string) => {
    addToast({ type: "warning", title, message })
  }

  const showInfoToast = (title: string, message: string) => {
    addToast({ type: "info", title, message })
  }

  // Check if subscription is active
  const isSubscriptionActive = () => {
    if (!userSubscription) return false
    const now = new Date()
    const expiry = new Date(userSubscription.expiryDate)
    return now < expiry && userSubscription.isActive
  }

  // Generate withdrawal code
  const generateWithdrawalCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Handle plan selection
  const handlePlanSelection = (planType: "basic" | "smart" | "super") => {
    const plan = subscriptionPlans.find((p) => p.type === planType)
    if (!plan) return

    setSelectedPlan(plan)
    setShowSubscriptionModal(false)
    setShowPaymentForm(true)
  }

  // Handle payment complete
  const handlePaymentComplete = (planType: "basic" | "smart" | "super", formData: any) => {
    const plan = subscriptionPlans.find((p) => p.type === planType)
    if (!plan) return

    // Store pending subscription data
    setPendingSubscription({ plan, formData })

    // Close payment form and show bank transfer
    setShowPaymentForm(false)
    setShowBankTransferModal(true)
  }

  // Handle bank transfer confirmation
  const handleBankTransferConfirmed = () => {
    if (!pendingSubscription) return

    const { plan, formData } = pendingSubscription

    // Calculate expiry date
    const now = new Date()
    let expiryDate: Date
    switch (plan.type) {
      case "basic":
        expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 1 day
        break
      case "smart":
        expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
        break
      case "super":
        expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
        break
    }

    // Create subscription
    const newSubscription: Subscription = {
      type: plan.type,
      code: generateWithdrawalCode(),
      expiryDate: expiryDate.toISOString(),
      isActive: true,
    }

    setUserSubscription(newSubscription)
    setShowBankTransferModal(false)
    setPendingSubscription(null)

    showSuccessToast(
      "Payment Confirmed!",
      `Your ${plan.name} plan is now active. Withdrawal code: ${newSubscription.code}`,
    )

    // Update user activity
    setUserActivity((prev) => ({
      ...prev,
      lastActive: new Date().toISOString(),
    }))
  }

  // Update user activity tracking
  const updateUserActivity = (activity: Partial<UserActivity>) => {
    setUserActivity((prev) => ({
      ...prev,
      ...activity,
      lastActive: new Date().toISOString(),
    }))
  }

  // Simulate withdrawal status changes for real transactions only
  useEffect(() => {
    const interval = setInterval(() => {
      setWithdrawalHistory((prev) => {
        const updated = prev.map((withdrawal) => {
          if (withdrawal.status === "Processing" && Math.random() > 0.8) {
            const newStatus = "Completed"
            showSuccessToast(
              "Withdrawal Completed",
              `Your withdrawal of ₦${withdrawal.amount.toLocaleString()} has been completed successfully!`,
            )
            return { ...withdrawal, status: newStatus }
          }
          return withdrawal
        })
        return updated
      })
    }, 15000) // Check every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatBalance = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleVideoEnded = () => {
    if (!hasWatchedVideo) {
      const earnings = 6000
      setBalance((prev) => prev + earnings)
      setHasWatchedVideo(true)
      setIsPlaying(false)

      // Update user activity
      updateUserActivity({
        videosWatched: userActivity.videosWatched + 1,
        totalEarnings: userActivity.totalEarnings + earnings,
      })

      showSuccessToast("Video Completed!", `You earned ₦${earnings.toLocaleString()} for watching this video!`)

      setTimeout(() => {
        const nextIndex = Math.floor(Math.random() * videoUrls.length)
        setCurrentVideoIndex(nextIndex)
        setHasWatchedVideo(false)
        setCurrentTime(0)
        setDuration(0)
      }, 2000)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const newTime = (clickX / rect.width) * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleLogout = () => {
    showInfoToast("Logged Out", "You have been successfully logged out.")
    setTimeout(() => {
      router.push("/")
    }, 1000)
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const resetWithdrawalForm = () => {
    setWithdrawalAmount("")
    setSelectedBank("")
    setAccountNumber("")
    setAccountName("")
    setWithdrawalCode("")
  }

  const handleWithdrawal = () => {
    const amount = Number.parseInt(withdrawalAmount)

    // Validation
    if (!withdrawalAmount || amount <= 0) {
      showErrorToast("Invalid Amount", "Please enter a valid withdrawal amount!")
      return
    }

    if (amount > balance) {
      showErrorToast("Insufficient Balance", "You don't have enough balance for this withdrawal!")
      return
    }

    if (!selectedBank) {
      showErrorToast("Bank Required", "Please select your bank!")
      return
    }

    if (!accountNumber || accountNumber.length < 10) {
      showErrorToast("Invalid Account", "Please enter a valid account number!")
      return
    }

    if (!accountName.trim()) {
      showErrorToast("Account Name Required", "Please enter your account name!")
      return
    }

    if (!isSubscriptionActive()) {
      showErrorToast("No Active Subscription", "You need an active subscription to make withdrawals!")
      return
    }

    if (withdrawalCode !== userSubscription?.code) {
      showErrorToast("Invalid Code", "Invalid withdrawal code! Use the code from your active subscription.")
      return
    }

    // Process withdrawal
    setBalance((prev) => prev - amount)

    // Add to withdrawal history
    const newWithdrawal: WithdrawalRecord = {
      id: withdrawalHistory.length + 1,
      amount: amount,
      bank: selectedBank,
      accountNumber: accountNumber,
      accountName: accountName,
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
      reference: `WD${String(Date.now()).slice(-6)}`,
    }

    setWithdrawalHistory((prev) => [newWithdrawal, ...prev])
    setShowWithdrawalModal(false)
    resetWithdrawalForm()

    // Update user activity
    updateUserActivity({
      withdrawalsMade: userActivity.withdrawalsMade + 1,
    })

    showSuccessToast(
      "Withdrawal Submitted",
      `Your withdrawal request of ₦${amount.toLocaleString()} has been submitted successfully!`,
    )
  }

  useEffect(() => {
    setCurrentTime(0)
    setIsPlaying(false)
    setHasWatchedVideo(false)
  }, [currentVideoIndex])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header with User Activity - Now shows personalized name */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">Hello, {userName}</h1>
          <p className="text-lg text-gray-800">Good Day.</p>
          <div className="text-sm text-gray-700 mt-1">
            <p>
              Videos Watched: {userActivity.videosWatched} | Total Earned: ₦
              {userActivity.totalEarnings.toLocaleString()}
            </p>
            {userSubscription && isSubscriptionActive() && (
              <p className="text-green-700 font-medium">
                Active: {userSubscription.type.toUpperCase()} Plan (Code: {userSubscription.code})
              </p>
            )}
          </div>
        </div>
        <Button onClick={handleLogout} variant="ghost" size="icon" className="text-black hover:bg-white/20">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Balance Card */}
      <div className="bg-green-600 rounded-2xl p-6 mb-8 shadow-lg">
        <p className="text-white text-lg mb-2">Available Balance</p>
        <p className="text-white text-4xl font-bold">{formatBalance(balance)}</p>
      </div>

      {/* Withdrawal Button */}
      <div className="mb-6 text-center space-y-3">
        <Button
          onClick={() => setShowWithdrawalModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg"
        >
          Withdraw Funds
        </Button>
        <Button
          onClick={() => setShowWithdrawalHistory(true)}
          variant="outline"
          className="bg-white/20 hover:bg-white/30 text-black border-black/20 px-6 py-2 rounded-full font-medium"
        >
          Withdrawal History
        </Button>
      </div>

      {/* Video Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black text-center mb-4">Watch video to earn money</h2>

        <div className="bg-black rounded-lg overflow-hidden relative">
          <video
            ref={videoRef}
            src={videoUrls[currentVideoIndex]}
            className="w-full aspect-video"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            preload="metadata"
          />

          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Button
              onClick={handlePlayPause}
              variant="ghost"
              size="icon"
              className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-black"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center space-x-3 text-white">
              <span className="text-sm font-mono">{formatTime(currentTime)}</span>

              <div className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer relative" onClick={handleSeek}>
                <div
                  className="h-full bg-white rounded-full relative"
                  style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 w-8 h-8">
                <Volume2 className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleFullscreen}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 w-8 h-8"
              >
                <Maximize className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 w-8 h-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-black font-medium">Complete watching this video to earn ₦6,000!</p>
          {hasWatchedVideo && (
            <p className="text-green-700 font-bold mt-2">✅ Video completed! ₦6,000 added to your balance!</p>
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Withdraw Funds</h3>
              <Button
                onClick={() => {
                  setShowWithdrawalModal(false)
                  resetWithdrawalForm()
                }}
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-gray-600 mb-4">Available Balance: {formatBalance(balance)}</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount (₦) *
                </label>
                <Input
                  type="number"
                  id="amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bank *
                </label>
                <select
                  id="bank"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Choose your bank</option>
                  {nigerianBanks.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <Input
                  type="text"
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter your account number"
                  className="w-full"
                  maxLength={10}
                  required
                />
              </div>

              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name *
                </label>
                <Input
                  type="text"
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Enter your account name"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="withdrawalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Code *
                </label>
                <Input
                  type="text"
                  id="withdrawalCode"
                  value={withdrawalCode}
                  onChange={(e) => setWithdrawalCode(e.target.value)}
                  placeholder="Enter withdrawal code"
                  className="w-full"
                  required
                />
                <div className="mt-2">
                  <Button
                    onClick={() => setShowSubscriptionModal(true)}
                    variant="outline"
                    size="sm"
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Get Code
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => {
                  setShowWithdrawalModal(false)
                  resetWithdrawalForm()
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleWithdrawal} className="flex-1 bg-orange-500 hover:bg-orange-600">
                Submit Withdrawal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Get Withdrawal Code</h3>
              <Button
                onClick={() => setShowSubscriptionModal(false)}
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-gray-600 mb-6">Choose a subscription plan to get your withdrawal code:</p>

            <div className="space-y-4">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.type}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{plan.name}</h4>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                      <p className="text-sm text-blue-600 font-medium">{plan.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">₦{plan.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePlanSelection(plan.type)}
                    className={`w-full mt-3 ${plan.color} hover:opacity-90 text-white`}
                  >
                    Select Plan
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Your current balance: {formatBalance(balance)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Payment Form */}
      <SubscriptionPaymentForm
        isOpen={showPaymentForm}
        onClose={() => {
          setShowPaymentForm(false)
          setSelectedPlan(null)
        }}
        selectedPlan={selectedPlan}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Withdrawal History Modal */}
      {showWithdrawalHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Withdrawal History</h3>
              <Button
                onClick={() => setShowWithdrawalHistory(false)}
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {withdrawalHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No withdrawal transactions found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Your withdrawal history will appear here after you make transactions
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawalHistory.map((withdrawal) => (
                  <div key={withdrawal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-lg">₦{withdrawal.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{withdrawal.bank}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          withdrawal.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : withdrawal.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {withdrawal.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Account:</span> {withdrawal.accountNumber}
                      </p>
                      <p>
                        <span className="font-medium">Name:</span> {withdrawal.accountName}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span> {withdrawal.date}
                      </p>
                      <p>
                        <span className="font-medium">Reference:</span> {withdrawal.reference}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <Button onClick={() => setShowWithdrawalHistory(false)} className="w-full bg-gray-600 hover:bg-gray-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Transfer Modal */}
      <BankTransferModal
        isOpen={showBankTransferModal}
        onClose={() => {
          setShowBankTransferModal(false)
          setPendingSubscription(null)
        }}
        userEmail={pendingSubscription?.formData?.email || ""}
        amount={pendingSubscription?.plan?.price || 0}
        planName={pendingSubscription?.plan?.name || ""}
        onPaymentConfirmed={handleBankTransferConfirmed}
      />
    </div>
  )
}
