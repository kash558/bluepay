"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Bell } from "lucide-react"

interface Transaction {
  id: string
  userId: string
  title: string
  amount: string
  date: string
  time: string
  type: "credit" | "debit"
  icon: string
  transactionType?: string
}

export default function TransactionsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>("")

  useEffect(() => {
    // Get current user
    if (typeof window !== "undefined") {
      const currentUser = JSON.parse(localStorage.getItem("fairmonie_currentUser") || "{}")
      setCurrentUserId(currentUser.id || "")

      // Get all transactions from localStorage
      const allTransactions = JSON.parse(localStorage.getItem("fairmonie_transactions") || "[]")
      
      // Filter transactions for current user only
      const userTransactions = allTransactions.filter((t: any) => t.userId === currentUser.id)
      
      // Map to display format
      const formattedTransactions: Transaction[] = userTransactions.map((t: any) => {
        let title = ""
        let icon = ""
        const type = t.type === "debit" ? "debit" : "credit"
        
        switch(t.transactionType) {
          case "airtime":
            title = `Airtime - ${t.network || "Mobile"}`
            icon = "📱"
            break
          case "data":
            title = `Data - ${t.network || "Mobile"}`
            icon = "📡"
            break
          case "betting":
            title = "Betting Credit"
            icon = "🎯"
            break
          case "tv":
            title = "TV Subscription"
            icon = "📺"
            break
          case "loan":
            title = "Loan Applied"
            icon = "💰"
            break
          case "withdraw":
            title = `Withdrawal to ${t.bank || "Bank"}`
            icon = "🏦"
            break
          default:
            title = "Transaction"
            icon = "💳"
        }
        
        return {
          id: t.id,
          userId: t.userId,
          title,
          amount: t.amount,
          date: t.date || new Date().toLocaleDateString("en-NG"),
          time: new Date(t.timestamp).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
          type,
          icon,
          transactionType: t.transactionType,
        }
      }).reverse() // Most recent first

      setTransactions(formattedTransactions)
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-700 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Transaction History</h1>
        </div>
        <div className="relative">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            1
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#e8f5ec] border-t-[#1a9b5c] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading transactions...</p>
          </div>
        </div>
      )}

      {/* TRANSACTIONS LIST */}
      {!isLoading && (
        <div className="p-4 max-w-md mx-auto space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No transactions yet</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5ec] flex items-center justify-center text-lg">
                    {transaction.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{transaction.title}</p>
                    <p className="text-xs text-gray-600">
                      {transaction.date}, {transaction.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-sm ${
                      transaction.type === "credit" ? "text-[#1a9b5c]" : "text-gray-900"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "−"}
                    {transaction.amount}
                  </p>
                  <p className="text-xs text-gray-600">{transaction.type === "credit" ? "Credit" : "Debit"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Floating Chat */}
      <button className="fixed right-5 bottom-6 w-14 h-14 rounded-full bg-[#0a8f3d] text-white flex items-center justify-center hover:scale-110 transition-transform z-40 text-xl">
        💬
      </button>
    </div>
  )
}
