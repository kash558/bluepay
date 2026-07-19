"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FloatingChat } from "@/components/floating-chat"
import { TransactionReceipt } from "@/components/transaction-receipt"

export default function WithdrawPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    accountNumber: "",
    bankName: "",
    accountName: "",
    amount: "",
    fairCode: "",
  })
  const [accountNameLoading, setAccountNameLoading] = useState(false)
  const [generatedAccountName, setGeneratedAccountName] = useState("")
  const [manualAccountName, setManualAccountName] = useState(false)
  const [fairCodeError, setFairCodeError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [receipt, setReceipt] = useState<any>(null)

  const VALID_CODES = ["FAIR12999", "FAIR200612", "FAIR112299"]

  const banks = [
    "GTBank",
    "Access Bank",
    "First Bank",
    "UBA",
    "Zenith Bank",
    "Fidelity Bank",
    "FCMB",
    "Wema Bank",
    "Stanbic IBTC",
    "Opay",
    "Kuda Bank",
    "Mono Bank",
    "Palmpay",
    "OKash",
    "Migo Loan",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Auto-generate account name when account number is entered
    if (name === "accountNumber" && value.length === 10 && !manualAccountName) {
      setAccountNameLoading(true)
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem("fairmonie_currentUser") || "{}")
        const userName = currentUser.fullName || "Account Holder"
        setGeneratedAccountName(userName)
        setFormData((prev) => ({
          ...prev,
          accountName: userName,
        }))
        setAccountNameLoading(false)
      }, 1000)
    }
  }

  const handleAccountNameEdit = () => {
    setManualAccountName(true)
  }

  const handleFairCodeValidation = () => {
    const codeUpper = formData.fairCode.toUpperCase()
    if (codeUpper === "" || codeUpper === formData.fairCode) {
      if (VALID_CODES.includes(codeUpper)) {
        setFairCodeError("")
      } else {
        setFairCodeError("Invalid code buy faircode")
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate fair code
    const codeUpper = formData.fairCode.toUpperCase()
    if (!VALID_CODES.includes(codeUpper)) {
      setFairCodeError("Invalid code buy faircode")
      return
    }

    // Add transaction to localStorage
    if (typeof window !== "undefined") {
      const currentUser = JSON.parse(localStorage.getItem("fairmonie_currentUser") || "{}")
      if (currentUser.id) {
        // Get and update balance
        const allUsers = JSON.parse(localStorage.getItem("fairmonie_users") || "[]")
        const userIdx = allUsers.findIndex((u: any) => u.id === currentUser.id)
        const balanceBefore = userIdx >= 0 ? (allUsers[userIdx].balance || 0) : 0
        const withdrawAmount = parseFloat(formData.amount) || 0
        const balanceAfter = balanceBefore - withdrawAmount

        // Update user balance
        if (userIdx >= 0) {
          allUsers[userIdx].balance = balanceAfter
          localStorage.setItem("fairmonie_users", JSON.stringify(allUsers))
          currentUser.balance = balanceAfter
          localStorage.setItem("fairmonie_currentUser", JSON.stringify(currentUser))
        }

        const transactions = JSON.parse(localStorage.getItem("fairmonie_transactions") || "[]")
        const txnId = "TXN" + Date.now()
        const newTransaction = {
          id: txnId,
          userId: currentUser.id,
          transactionType: "withdraw",
          type: "debit",
          amount: "₦" + withdrawAmount.toLocaleString("en-NG"),
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
          title: "Withdrawal Successful",
          status: "success",
          amount: "₦" + withdrawAmount.toLocaleString("en-NG"),
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

    // Show success message
    setSuccessMessage("Withdrawal Successful")
    setFairCodeError("")
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-700 hover:text-gray-900">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Withdraw To Bank Account</h1>
      </div>

      {/* Form */}
      <div className="p-5 max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-6 space-y-5">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded text-green-800 text-sm font-medium">
              ✓ {successMessage}
            </div>
          )}

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
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400"
              />
              {accountNameLoading && formData.accountNumber.length === 10 && (
                <p className="text-xs text-gray-500 mt-2">Generating account name...</p>
              )}
              {generatedAccountName && !manualAccountName && (
                <p className="text-xs text-green-600 mt-2">✓ {generatedAccountName}</p>
              )}
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Bank Name</label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white cursor-pointer appearance-none"
              >
                <option value="">Select Bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Account Name {!manualAccountName && generatedAccountName && "(Auto-generated)"}
              </label>
              <Input
                type="text"
                name="accountName"
                placeholder="Account Name"
                value={formData.accountName}
                onChange={(e) => {
                  setManualAccountName(true)
                  handleChange(e)
                }}
                onFocus={handleAccountNameEdit}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400"
              />
              {manualAccountName && (
                <p className="text-xs text-blue-600 mt-1">Manually edited</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Amount</label>
              <Input
                type="text"
                name="amount"
                placeholder="Enter amount"
                value={formData.amount}
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
                placeholder="Enter fair code"
                value={formData.fairCode}
                onChange={(e) => {
                  handleChange(e)
                  setFairCodeError("")
                }}
                onBlur={handleFairCodeValidation}
                className={`w-full px-4 py-3 border rounded-lg text-gray-700 placeholder-gray-400 ${fairCodeError ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {fairCodeError && (
                <p className="text-xs text-red-600 mt-2">✕ {fairCodeError}</p>
              )}
            </div>

            {/* Available Balance */}
            <div className="py-4 text-center border-t border-gray-200">
              <p className="text-[#1a9b5c] font-bold text-lg">Available Balance: ₦250,000.00</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 bg-[#27c26c] hover:bg-[#1fa857] text-white font-bold rounded-full text-base"
            >
              Proceed
            </Button>
          </form>

          {/* Buy Fair Code Link */}
          <div className="text-center">
            <button className="text-[#1a9b5c] font-semibold hover:underline">Buy Fair Code</button>
          </div>
        </div>
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

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  )
}
