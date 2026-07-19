"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Search, X } from "lucide-react"
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
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const [bankSearchQuery, setBankSearchQuery] = useState("")

  const VALID_CODES = ["FAIR12999", "FAIR200612", "FAIR112299"]

  const banks = [
    // Commercial Banks
    "Access Bank PLC",
    "Citibank Nigeria Limited",
    "Ecobank Nigeria PLC",
    "Fidelity Bank PLC",
    "First Bank of Nigeria Limited",
    "First City Monument Bank PLC (FCMB)",
    "Globus Bank Limited",
    "Guaranty Trust Bank PLC (GTBank)",
    "Keystone Bank Limited",
    "Nova Commercial Bank Limited",
    "Optimus Bank",
    "Parallex Bank Limited",
    "Polaris Bank PLC",
    "PremiumTrust Bank",
    "Providus Bank Limited",
    "Signature Bank Limited",
    "Stanbic IBTC Bank PLC",
    "Standard Chartered Bank Nigeria Limited",
    "Sterling Bank PLC",
    "SunTrust Bank Nigeria Limited",
    "Taj Bank Limited",
    "Titan Trust Bank Limited",
    "Union Bank of Nigeria Plc",
    "United Bank for Africa Plc (UBA)",
    "Unity Bank PLC",
    "Wema Bank PLC",
    "Zenith Bank PLC",
    "Alpha Morgan Bank",
    "Heritage Banking Company Limited",
    "Lotus Bank",
    "Jaiz Bank PLC",
    // Fintech/Mobile Money
    "OPay Digital Services Limited",
    "PalmPay Limited",
    "Kuda Microfinance Bank",
    "Moniepoint Microfinance Bank",
    "Carbon Microfinance Bank",
    "FairMoney Microfinance Bank",
    "RenMoney Microfinance Bank",
    "VFD Microfinance Bank (VBank)",
    "GoMoney",
    "Sparkle Microfinance Bank",
    "Eyowo Microfinance Bank",
    "Rubies Bank",
    "Tangerine Money",
    "Mint Finex MFB",
    "FINT",
    "One Finance",
    "SokoLoan",
    "Branch International",
    "Aella Credit",
    "QuickCheck",
    // Payment Service Banks
    "Hope PSB",
    "Momo Payment Service Bank",
    "SmartCash PSB",
    "Money Master PSB",
    "9 Payment Service Bank",
    // Microfinance Banks
    "LAPO Microfinance Bank",
    "ACCION Microfinance Bank",
    "AB Microfinance Bank",
    "Assets Microfinance Bank",
    "Fina Trust Microfinance Bank",
    "Mutual Trust Microfinance Bank",
    "Mainstreet Microfinance Bank",
    "Fortis Microfinance Bank",
    "BOI Microfinance Bank",
    "Fidelity MFB",
    "Hasal Microfinance Bank",
    "NIRSAL National Microfinance Bank",
    "NPF Microfinance Bank",
    "Ndiorah Microfinance Bank",
    "Okpoga Microfinance Bank",
    "Ohafia Microfinance Bank",
    "Oche Microfinance Bank",
    "Ikenne Microfinance Bank",
    "Ikire Microfinance Bank",
    "Ila Microfinance Bank",
    "Ilasan Microfinance Bank",
    "IMO Microfinance Bank",
    "Infinity Microfinance Bank",
    "Jessefield Microfinance Bank",
    "KADPOLY Microfinance Bank",
    "KCMB Microfinance Bank",
    "Kontagora Microfinance Bank",
    "Kredi Money Microfinance Bank",
    "KWASU Microfinance Bank",
    "Lavender Microfinance Bank",
    "Legend Microfinance Bank",
    "Letshego Microfinance Bank",
    "Lovonus Microfinance Bank",
    "Mainland Microfinance Bank",
    "Malachy Microfinance Bank",
    "Manny Microfinance Bank",
    "Mayfair Microfinance Bank",
    "Megapraise Microfinance Bank",
    "Meridian Microfinance Bank",
    "Microcred Microfinance Bank",
    "Microvis Microfinance Bank",
    "Molus Microfinance Bank",
    "Moneytrust Microfinance Bank",
    "Mutual Benefits Microfinance Bank",
    "Nargata Microfinance Bank",
    "Navy Microfinance Bank",
    "Neptune Microfinance Bank",
    "New Golden Pastures Microfinance Bank",
    "Newdawn Microfinance Bank",
    "Nnew Women Microfinance Bank",
    "Nuture Microfinance Bank",
    "Olabisi Onabanjo University Microfinance Bank",
    "Olofin Owena Microfinance Bank",
    "Oluchukwu Microfinance Bank",
    "Oluyole Microfinance Bank",
    "Omiye Microfinance Bank",
    "Page Financials",
    "Parrallex Microfinance Bank",
    "Patrick Gold Microfinance Bank",
    "Pecan Trust Microfinance Bank",
    "Pennywise Microfinance Bank",
    "Personal Trust Microfinance Bank",
    "Petra Microfinance Bank",
    "Pillar Microfinance Bank",
    "Polyuwanna Microfinance Bank",
    "Prestige Microfinance Bank",
    "Purplemoney Microfinance Bank",
    "Quickfund Microfinance Bank",
    "Rahama Microfinance Bank",
    "Regent Microfinance Bank",
    "Reliance Microfinance Bank",
    "Rephidim Microfinance Bank",
    "Richway Microfinance Bank",
    "Royal Exchange Microfinance Bank",
    "Safetrust Microfinance Bank",
    "Sagamu Microfinance Bank",
    "Seed Capital Microfinance Bank",
    "Seedvest Microfinance Bank",
    "Stanford Microfinance Bank",
    "Stellas Microfinance Bank",
    "Sulsap Microfinance Bank",
    "TCF Microfinance Bank",
    "TF Microfinance Bank",
    "Trident Microfinance Bank",
    "Trust Microfinance Bank",
    "Trustbanc J6 Microfinance Bank",
    "Trustfund Microfinance Bank",
    "U & C Microfinance Bank",
    "UNAAB Microfinance Bank",
    "UNIBEN Microfinance Bank",
    "UNICAL Microfinance Bank",
    "Union Microfinance Bank",
    "UNN Microfinance Bank",
    "Virtue Microfinance Bank",
    "Visa Microfinance Bank",
    "Wetland Microfinance Bank",
    "YES Microfinance Bank",
    // Mortgage Banks
    "Abbey Mortgage Bank",
    "AG Mortgage Bank PLC",
    "Brent Mortgage Bank",
    "Cooperative Mortgage Bank",
    "Covenant Mortgage Bank",
    "First Generation Mortgage Bank",
    "Gateway Mortgage Bank",
    "Haggai Mortgage Bank",
    "HomeBase Mortgage Bank",
    "Imperial Homes Mortgage Bank",
    "Infinity Trust Mortgage Bank",
    "LBIC Mortgage Bank",
    "LivingTrust Mortgage Bank PLC",
    "Mayfresh Mortgage Bank",
    "Platinum Mortgage Bank",
    "Refuge Mortgage Bank",
    "STB Mortgage Bank",
    // Merchant Banks
    "Coronation Merchant Bank",
    "FBNQuest Merchant Bank",
    "Greenwich Merchant Bank",
    "Nova Merchant Bank",
    "Rand Merchant Bank",
    // Development Finance
    "Bank of Industry (BOI)",
    "Bank of Agriculture",
    "Federal Mortgage Bank of Nigeria",
    "Nigeria Export-Import Bank (NEXIM)",
    "Development Bank of Nigeria",
  ]

  // Remove duplicates and sort banks
  const uniqueBanks = Array.from(new Set(banks)).sort()

  // Filter banks based on search query
  const filteredBanks = bankSearchQuery
    ? uniqueBanks.filter((bank) => bank.toLowerCase().includes(bankSearchQuery.toLowerCase()))
    : uniqueBanks

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

            {/* Bank Name - Searchable Dropdown */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Bank Name</label>
              <button
                type="button"
                onClick={() => setShowBankDropdown(!showBankDropdown)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white cursor-pointer text-left flex items-center justify-between hover:border-gray-400 transition"
              >
                <span className={formData.bankName ? "text-gray-700 font-medium" : "text-gray-400"}>
                  {formData.bankName || "Search or select bank..."}
                </span>
                <Search className="w-4 h-4 text-gray-400" />
              </button>

              {showBankDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden flex flex-col">
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                    <input
                      type="text"
                      placeholder="Search banks..."
                      value={bankSearchQuery}
                      onChange={(e) => setBankSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#27c26c]"
                      autoFocus
                    />
                  </div>

                  {/* Bank List */}
                  <div className="overflow-y-auto flex-1">
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, bankName: bank })
                            setShowBankDropdown(false)
                            setBankSearchQuery("")
                          }}
                          className={`w-full px-4 py-3 text-left text-sm hover:bg-green-50 transition ${
                            formData.bankName === bank
                              ? "bg-[#27c26c] text-white font-medium"
                              : "text-gray-700 hover:text-[#27c26c]"
                          }`}
                        >
                          {bank}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500 text-sm">
                        No banks found
                      </div>
                    )}
                  </div>
                </div>
              )}
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
