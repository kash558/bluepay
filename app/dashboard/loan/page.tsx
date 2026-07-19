"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TransactionReceipt } from "@/components/transaction-receipt"

export default function LoanPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountName: "",
    bankName: "",
    loanAmount: "",
    fairCode: "",
  })
  const [fairCodeError, setFairCodeError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [receipt, setReceipt] = useState<any>(null)

  const VALID_CODES = ["FAIR12999", "FAIR200612", "FAIR112299"]
  const banks = ["GTBank", "Access Bank", "First Bank", "UBA", "Zenith Bank", "Fidelity Bank"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFairCodeValidation = () => {
    const codeUpper = formData.fairCode.toUpperCase()
    if (formData.fairCode && !VALID_CODES.includes(codeUpper)) {
      setFairCodeError("Invalid code buy faircode")
    } else {
      setFairCodeError("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const codeUpper = formData.fairCode.toUpperCase()
    
    if (formData.fairCode && !VALID_CODES.includes(codeUpper)) {
      setFairCodeError("Invalid code buy faircode")
      return
    }

    // Add transaction to localStorage and update balance
    if (typeof window !== "undefined") {
      const currentUser = JSON.parse(localStorage.getItem("fairmonie_currentUser") || "{}")
      if (currentUser.id) {
        // Get current balance
        const allUsers = JSON.parse(localStorage.getItem("fairmonie_users") || "[]")
        const userIdx = allUsers.findIndex((u: any) => u.id === currentUser.id)
        const balanceBefore = userIdx >= 0 ? (allUsers[userIdx].balance || 0) : 0
        const loanAmount = parseFloat(formData.loanAmount) || 0
        const balanceAfter = balanceBefore + loanAmount
        
        // Update user balance
        if (userIdx >= 0) {
          allUsers[userIdx].balance = balanceAfter
          localStorage.setItem("fairmonie_users", JSON.stringify(allUsers))
          currentUser.balance = balanceAfter
          localStorage.setItem("fairmonie_currentUser", JSON.stringify(currentUser))
        }

        // Add transaction
        const transactions = JSON.parse(localStorage.getItem("fairmonie_transactions") || "[]")
        const txnId = "TXN" + Date.now()
        const newTransaction = {
          id: txnId,
          userId: currentUser.id,
          transactionType: "loan",
          type: "credit",
          amount: "₦" + loanAmount.toLocaleString("en-NG"),
          phoneOrAccount: formData.accountNumber,
          bank: formData.bankName,
          status: "completed",
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString("en-NG"),
          balanceBefore: "₦" + balanceBefore.toLocaleString("en-NG"),
          balanceAfter: "₦" + balanceAfter.toLocaleString("en-NG"),
        }
        transactions.push(newTransaction)
        localStorage.setItem("fairmonie_transactions", JSON.stringify(transactions))

        // Show receipt
        const now = new Date()
        setReceipt({
          title: "Loan Application Successful",
          status: "success",
          amount: "₦" + loanAmount.toLocaleString("en-NG"),
          transactionId: txnId,
          date: now.toLocaleDateString("en-NG"),
          time: now.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
          details: [
            { label: "Bank Name", value: formData.bankName },
            { label: "Account Number", value: formData.accountNumber },
            { label: "Account Name", value: formData.accountName },
          ],
          balanceBefore: "₦" + balanceBefore.toLocaleString("en-NG"),
          balanceAfter: "₦" + balanceAfter.toLocaleString("en-NG"),
        })
      }
    }

    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-700 hover:text-gray-900">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Apply for Loan</h1>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <TransactionReceipt
          receipt={receipt}
          onClose={() => {
            setReceipt(null)
            router.push("/dashboard")
          }}
        />
      )}

      {/* Form */}
      <div className="p-5 max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Account Number</label>
              <Input
                type="text"
                name="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Account Name</label>
              <Input
                type="text"
                name="accountName"
                placeholder="Enter account name"
                value={formData.accountName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Select Bank</label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white cursor-pointer appearance-none"
              >
                <option value="">Select your bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Enter Loan Amount</label>
              <Input
                type="text"
                name="loanAmount"
                placeholder="Enter loan amount"
                value={formData.loanAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Fair Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Fair Code</label>
              <Input
                type="text"
                name="fairCode"
                placeholder="Enter your faircode"
                value={formData.fairCode}
                onChange={(e) => {
                  handleChange(e)
                  setFairCodeError("")
                }}
                onBlur={handleFairCodeValidation}
                className={`w-full px-4 py-3 border rounded-lg text-gray-700 placeholder-gray-400 ${
                  fairCodeError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {fairCodeError && <p className="text-red-600 text-xs mt-2">✕ {fairCodeError}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 bg-[#27c26c] hover:bg-[#1fa857] text-white font-bold rounded-full text-base mt-6"
            >
              Proceed
            </Button>
          </form>
        </div>
      </div>

      {/* Floating Chat */}
      <button className="fixed right-5 bottom-6 w-14 h-14 rounded-full bg-[#0a8f3d] text-white flex items-center justify-center hover:scale-110 transition-transform z-40 text-xl">
        💬
      </button>
    </div>
  )
}
