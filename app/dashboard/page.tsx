"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Headphones, Maximize2, Bell, Check, Users, TrendingUp, Smartphone, Wifi, Target, Tv, Wallet, Hash, UserPlus, MoreHorizontal, Users2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { FloatingChat } from "@/components/floating-chat"
import { Toast, useToastNotifications } from "@/components/toast-notification"

interface UserData {
  fullName: string
  email: string
  password: string
  balance?: number
  bonusClaimed?: boolean
}

interface Transaction {
  id: string
  userName: string
  type: "bonus" | "withdrawal" | "payment"
  amount: number
  timestamp: string
  status: "completed" | "pending"
}

export default function Dashboard() {
  const router = useRouter()
  const [showBalance, setShowBalance] = useState(false)
  const [claimModalState, setClaimModalState] = useState<"hidden" | "initial" | "loading" | "success" | "already-claimed">("hidden")
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [balance, setBalance] = useState(0)
  const [userName, setUserName] = useState("")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [bonusClaimed, setBonusClaimed] = useState(false)
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showWithdrawalsDropdown, setShowWithdrawalsDropdown] = useState(false)
  const [currentTransactionIndex, setCurrentTransactionIndex] = useState(0)
  const { currentToast, isVisible } = useToastNotifications()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  const FAIR12999_CODE = "Fair12999"

  const carouselImages = [
    { src: "/carousel-1.jpg", alt: "Airtime and data recharge" },
    { src: "/carousel-2.jpg", alt: "Credit and loan offer" },
    { src: "/carousel-4.jpg", alt: "FairMoney quick services" },
    { src: "/carousel-5.jpg", alt: "Credit score improvement" },
    { src: "/carousel-6.jpg", alt: "Banking made easy" },
    { src: "/carousel-7.jpg", alt: "Financial helping hand" },
  ]

  // Auto-scroll carousel every 1.5 seconds
  useEffect(() => {
    const carouselInterval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % carouselImages.length)
    }, 1500)
    return () => clearInterval(carouselInterval)
  }, [carouselImages.length])

  // Initialize and sync user data with localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("fairmonie_currentUser")
    const storedTransactions = localStorage.getItem("fairmonie_transactions")
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUserData(parsedUser)
      setUserName(parsedUser.fullName)
      setBalance(parsedUser.balance || 0)
      setBonusClaimed(parsedUser.bonusClaimed || false)
    }

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    } else {
      // Initialize with sample transactions
      const sampleTransactions: Transaction[] = [
        {
          id: "1",
          userName: "John Doe",
          type: "withdrawal",
          amount: 200000,
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          status: "completed",
        },
        {
          id: "2",
          userName: "Sarah James",
          type: "withdrawal",
          amount: 150000,
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          status: "completed",
        },
        {
          id: "3",
          userName: "Mike Wilson",
          type: "withdrawal",
          amount: 250000,
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          status: "completed",
        },
      ]
      localStorage.setItem("fairmonie_transactions", JSON.stringify(sampleTransactions))
      setTransactions(sampleTransactions)
    }
  }, [])

  // Save user data and transactions to localStorage whenever they change
  useEffect(() => {
    if (userData) {
      const updatedUser: UserData = {
        ...userData,
        balance,
        bonusClaimed,
      }
      localStorage.setItem("fairmonie_currentUser", JSON.stringify(updatedUser))
      setUserData(updatedUser)
    }
  }, [balance, bonusClaimed])

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("fairmonie_transactions", JSON.stringify(transactions))
    }
  }, [transactions])

  // Auto-rotate withdrawal transactions every 3 seconds
  useEffect(() => {
    if (transactions.length === 0) return
    
    const transactionInterval = setInterval(() => {
      setCurrentTransactionIndex((prev) => (prev + 1) % transactions.length)
    }, 3000)
    return () => clearInterval(transactionInterval)
  }, [transactions.length])

  // Show welcome modal on page load
  useEffect(() => {
    setShowWelcomeModal(true)
    const timer1 = setTimeout(() => {
      setShowWelcomeModal(false)
    }, 5000)

    return () => {
      clearTimeout(timer1)
    }
  }, [])

  const handleClaimBonus = () => {
    if (bonusClaimed) {
      setClaimModalState("already-claimed")
    } else {
      setClaimModalState("initial")
    }
  }

  const handleClaimNow = () => {
    setClaimModalState("loading")
    setTimeout(() => {
      setClaimModalState("success")
      setBalance(250000)
      setBonusClaimed(true)

      // Add bonus transaction
      const newTransaction: Transaction = {
        id: String(Date.now()),
        userName: userName || "You",
        type: "bonus",
        amount: 250000,
        timestamp: new Date().toISOString(),
        status: "completed",
      }
      setTransactions((prev) => [newTransaction, ...prev])
    }, 2000)
  }

  const handleSuccessOk = () => {
    setClaimModalState("hidden")
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 5000)
  }

  const handleAlreadyClaimedClose = () => {
    setClaimModalState("hidden")
  }

  const handleFeatureClick = (path: string) => {
    setIsPageLoading(true)
    setTimeout(() => {
      router.push(path)
    }, 300)
  }

  const getInitialLetter = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const formatTransactionTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  // Reorganized features: Support, Groups, Withdraw first (3 cols), then rest in 4x4 grid
  const topFeatures = [
    { label: "Support", icon: Users2, path: "/dashboard/support" },
    { label: "Groups", icon: Users, path: "/dashboard/groups" },
    { label: "Withdraw", icon: TrendingUp, path: "/dashboard/withdraw" },
  ]

  const remainingFeatures = [
    { label: "Airtime", icon: Smartphone, path: "/dashboard/airtime" },
    { label: "Data", icon: Wifi, path: "/dashboard/data" },
    { label: "Betting", icon: Target, path: "/dashboard/betting" },
    { label: "TV", icon: Tv, path: "/dashboard/tv" },
    { label: "Buy Faircode", icon: Wallet, path: "/dashboard/faircode" },
    { label: "Loan", icon: Hash, path: "/dashboard/loan" },
    { label: "Invitation", icon: UserPlus, path: "/dashboard/invitation" },
    { label: "More", icon: MoreHorizontal, path: "/dashboard/more" },
  ]

  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      {/* Toast Notification */}
      {currentToast && <Toast show={isVisible} userName={currentToast.name} amount={currentToast.amount} />}

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#1a9b5c] text-white p-8 flex flex-col items-center gap-4 flex-shrink-0">
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="absolute top-6 right-6 text-white text-2xl hover:opacity-80 w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl">
                🎁
              </div>
              <h2 className="text-3xl font-bold">Welcome to FairMonie Pay!</h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="text-center">
                <p className="text-gray-800 mb-1">
                  Hello <span className="font-bold text-[#1a9b5c]">{userName}</span>! 👋
                </p>
              </div>

              <p className="text-gray-700 text-center leading-relaxed">
                Welcome to FairMonie Pay! Join our community to get updates and start earning with FairMonie Pay.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="flex-1 py-3 border-2 border-[#1a9b5c] text-[#1a9b5c] font-bold rounded-full hover:bg-[#e8f5ec] transition"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    window.open("https://t.me/fairmonieofficialchannel", "_blank")
                    setShowWelcomeModal(false)
                  }}
                  className="flex-1 py-3 bg-[#1a9b5c] hover:bg-[#168a4f] text-white font-bold rounded-full transition"
                >
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* HEADER */}
      <div className="flex justify-between items-center p-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#d6f5e3] flex items-center justify-center font-bold text-[#1a9c55]">
            {getInitialLetter(userName)}
          </div>
          <h3 className="text-sm font-medium text-gray-800">Hi, {userName}</h3>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <button onClick={() => router.push("/dashboard/support/chat")} className="hover:text-gray-900">
            <Headphones className="w-5 h-5" />
          </button>
          <button className="hover:text-gray-900">
            <Maximize2 className="w-5 h-5" />
          </button>
          <button onClick={() => router.push("/dashboard/transactions")} className="hover:text-gray-900 relative">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">1</div>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="mx-4 mt-4 bg-[#e6f6ec] rounded-lg p-3 text-[#2e7d32] text-xs">
          ✓ Withdrawal Successful
          <br />
          Victor Nnamdi successfully withdrew ₦218,000
        </div>
      )}

      {/* BALANCE CARD */}
      <div className="m-4 p-5 rounded-2xl bg-gradient-to-br from-[#0a8f3d] to-[#2ecc71] text-white">
        <div className="flex justify-between items-center mb-3 text-sm">
          <span>🛡️ Available Balance</span>
          <button onClick={() => setShowBalance(!showBalance)} className="hover:opacity-80">
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <h1 className="text-center text-3xl font-bold my-3">
          {showBalance ? `₦${balance.toLocaleString()}.00` : "••••••"}
        </h1>

        <button
          onClick={handleClaimBonus}
          className="block mx-auto px-6 py-2 rounded-full bg-white text-[#0a8f3d] font-bold hover:bg-gray-100 transition-colors text-sm"
        >
          🎁 Claim Bonus 🎁
        </button>
      </div>

      {/* GRID - Top 3 features responsive */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4">
        {topFeatures.map((feature) => (
          <button
            key={feature.label}
            onClick={() => handleFeatureClick(feature.path)}
            className="flex flex-col items-center text-center hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#d4edda] flex items-center justify-center mb-1 sm:mb-2">
              <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#1a9c55]" />
            </div>
            <div className="text-xs font-medium text-gray-700">{feature.label}</div>
          </button>
        ))}
      </div>

      {/* GRID - Remaining features 4x2 */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4">
        {remainingFeatures.map((feature) => (
          <button
            key={feature.label}
            onClick={() => handleFeatureClick(feature.path)}
            className="flex flex-col items-center text-center hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#d4edda] flex items-center justify-center mb-1 sm:mb-2">
              <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#1a9c55]" />
            </div>
            <div className="text-xs sm:text-xs font-medium text-gray-700 line-clamp-2">{feature.label}</div>
          </button>
        ))}
      </div>

      {/* CAROUSEL - Bottom Section Responsive */}
      <div className="m-3 sm:m-4 relative rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-md h-32 sm:h-40 md:h-48">
        <img
          src={carouselImages[currentCarouselIndex].src}
          alt={carouselImages[currentCarouselIndex].alt}
          className="w-full h-full object-cover"
        />

        {/* Auto-scroll dots indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {carouselImages.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentCarouselIndex ? "bg-white w-6" : "bg-white/50 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Loading Screen */}
      {isPageLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-white border-t-[#0a8f3d] rounded-full animate-spin"></div>
            <p className="text-white text-sm font-medium">Loading...</p>
          </div>
        </div>
      )}

      {/* Claim Bonus Modal - Initial */}
      {claimModalState === "initial" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
            {/* Green Header */}
            <div className="bg-gradient-to-b from-[#2ab973] to-[#1a9b5c] p-8 relative">
              <button
                onClick={() => setClaimModalState("hidden")}
                className="absolute top-6 right-6 text-white text-2xl hover:opacity-80"
              >
                ×
              </button>
              <h1 className="text-white text-3xl font-bold text-center">Claim Your Bonus</h1>
            </div>

            {/* Content */}
            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-4xl">��</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome Bonus</h2>
                <p className="text-gray-600">Claim your one-time welcome bonus of ₦250,000!</p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setClaimModalState("hidden")}
                  className="flex-1 h-12 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleClaimNow}
                  className="flex-1 h-12 rounded-full bg-[#1a9b5c] hover:bg-[#168a4f] text-white font-semibold"
                >
                  Claim Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claim Bonus Modal - Loading */}
      {claimModalState === "loading" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
            {/* Green Header */}
            <div className="bg-gradient-to-b from-[#2ab973] to-[#1a9b5c] p-8">
              <h1 className="text-white text-3xl font-bold text-center">Claim Your Bonus</h1>
            </div>

            {/* Content */}
            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <Spinner />
              </div>
              <p className="text-gray-600 text-lg">Claiming bonus in progress...</p>
            </div>
          </div>
        </div>
      )}

      {/* Claim Bonus Modal - Success */}
      {claimModalState === "success" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
            {/* Content */}
            <div className="p-8 text-center space-y-6 relative">
              <button
                onClick={handleSuccessOk}
                className="absolute top-6 right-6 text-gray-400 text-2xl hover:text-gray-600"
              >
                ×
              </button>

              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-12 h-12 text-[#1a9b5c]" />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Success!</h2>
                <p className="text-gray-600">Successfully claimed FairMonie bonus of ₦250,000 Naira</p>
              </div>

              <Button
                onClick={handleSuccessOk}
                className="w-full h-12 rounded-full bg-[#1a9b5c] hover:bg-[#168a4f] text-white font-semibold text-base"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Bonus Modal - Already Claimed */}
      {claimModalState === "already-claimed" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
            {/* Green Header */}
            <div className="bg-gradient-to-b from-[#2ab973] to-[#1a9b5c] p-8 relative">
              <button
                onClick={handleAlreadyClaimedClose}
                className="absolute top-6 right-6 text-white text-2xl hover:opacity-80"
              >
                ×
              </button>
              <h1 className="text-white text-3xl font-bold text-center">Claim Your Bonus</h1>
            </div>

            {/* Content */}
            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-4xl">💰</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome Bonus</h2>
                <p className="text-gray-600">Claim your one-time welcome bonus of ₦250,000!</p>
                <p className="text-red-500 font-semibold mt-3">Upgrade your account for next claim</p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAlreadyClaimedClose}
                  className="flex-1 h-12 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  disabled
                  className="flex-1 h-12 rounded-full bg-[#9bc985] text-white font-semibold opacity-70 cursor-not-allowed"
                >
                  Already Claimed
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FloatingChat />
    </div>
  )
}

function Spinner() {
  return (
    <div className="w-12 h-12 border-4 border-[#1a9c55] border-t-transparent rounded-full animate-spin"></div>
  )
}
