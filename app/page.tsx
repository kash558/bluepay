"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, Play, DollarSign, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MobileMenu from "@/components/mobile-menu"
import CryptoPaymentModal from "@/components/crypto-payment-modal"

// Restore the entire component logic and JSX:
export default function CashTubePage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showInvalidModal, setShowInvalidModal] = useState(false)
  const [showBuyPasscodeModal, setShowBuyPasscodeModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    amount: "₦6,500",
  })
  const [showInitialWelcome, setShowInitialWelcome] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const [copiedAmount, setCopiedAmount] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [showPaymentNotReceivedModal, setShowPaymentNotReceivedModal] = useState(false)
  const [showCryptoPaymentModal, setShowCryptoPaymentModal] = useState(false)
  // New state for loading payment details
  const [isLoadingPaymentDetails, setIsLoadingPaymentDetails] = useState(false)

  const testimonials: Testimonial[] = [
    { id: 1, username: "@Elija", amount: "₦370,000", timeAgo: "2min ago" },
    { id: 2, username: "@Sarah", amount: "₦250,000", timeAgo: "5min ago" },
    { id: 3, username: "@Mike", amount: "₦180,000", timeAgo: "8min ago" },
    { id: 4, username: "@Grace", amount: "₦420,000", timeAgo: "12min ago" },
    { id: 5, username: "@David", amount: "₦310,000", timeAgo: "15min ago" },
  ]

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
    setShowBuyPasscodeModal(true)
  }

  const handleBuyPasscode = () => {
    setShowInvalidModal(false)
    setShowBuyPasscodeModal(true)
  }

  const closeInvalidModal = () => {
    setShowInvalidModal(false)
    setCode("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Buy Passcode Form submitted:", formData)
    setShowBuyPasscodeModal(false)
    setIsLoadingPaymentDetails(true) // Start loading

    setTimeout(() => {
      setIsLoadingPaymentDetails(false) // End loading
      setShowPaymentModal(true) // Open bank transfer modal
    }, 1500) // Simulate 1.5-second loading time
  }

  const handleBankPaymentConfirmed = () => {
    setIsConfirmingPayment(true)
    setShowPaymentModal(false)
    setIsCheckingPayment(true)

    setTimeout(() => {
      setIsCheckingPayment(false)
      setIsConfirmingPayment(false)
      setShowPaymentNotReceivedModal(true)
    }, 3000)
  }

  const closePaymentNotReceivedModal = () => {
    setShowPaymentNotReceivedModal(false)
  }

  const handleCopy = (text: string, type: "amount" | "account") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "amount") {
        setCopiedAmount(true)
        setTimeout(() => setCopiedAmount(false), 2000)
      } else if (type === "account") {
        setCopiedAccount(true)
        setTimeout(() => setCopiedAccount(false), 2000)
      }
    })
  }

  const handleCryptoSignup = () => {
    setIsLoadingPaymentDetails(true) // Start loading
    setTimeout(() => {
      setIsLoadingPaymentDetails(false) // End loading
      setShowCryptoPaymentModal(true) // Open crypto modal
    }, 1500) // Simulate 1.5-second loading time
  }

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

  const bankDetails = {
    amount: "₦6,500",
    accountNumber: "3211850611",
    bankName: "PAGA MFB",
    accountName: "CASHTUBE AGENT-TERHILE",
    email: "cashtubespport@gmail.com",
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Testimonial Notification */}
      {currentTestimonial && (
        <div className="fixed top-2 left-2 right-2 z-50 animate-in slide-in-from-top duration-500">
          {" "}
          {/* Adjusted top, left, right */}
          <div className="bg-gradient-to-r from-pink-300 to-pink-400 rounded-2xl p-3 shadow-lg">
            {" "}
            {/* Adjusted padding */}
            <p className="text-sm text-gray-800 font-medium text-center">
              {" "}
              {/* Adjusted font size */}
              {currentTestimonial.username} withdraw {currentTestimonial.amount}. {currentTestimonial.timeAgo}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-start p-2">
        {" "}
        {/* Adjusted padding */}
        <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => setShowMobileMenu(true)}>
          <Menu className="h-5 w-5" /> {/* Adjusted icon size */}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 space-y-6">
        {" "}
        {/* Adjusted px and space-y */}
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            {" "}
            {/* Adjusted size */}
            <div className="flex items-center space-x-1">
              <Play className="h-5 w-5 text-white fill-white" /> {/* Adjusted icon size */}
              <DollarSign className="h-5 w-5 text-white" /> {/* Adjusted icon size */}
            </div>
          </div>
        </div>
        {/* Welcome Text */}
        <div className="text-center space-y-1">
          {" "}
          {/* Adjusted space-y */}
          <h4 className="text-xl font-bold text-gray-800">Welcome To</h4> {/* Adjusted font size */}
          <h4 className="text-lg font-bold text-pink-500">CashTube2025</h4> {/* Adjusted font size */}
          <p className="text-sm text-gray-600 font-bold">{"Enter (5) digit code"}</p> {/* Adjusted font size */}
        </div>
        {/* Code Input */}
        <div className="w-full max-w-[200px]">
          {" "}
          {/* Adjusted max-w */}
          <Input
            type="password" // Changed from "text" to "password"
            value={code}
            readOnly
            className="text-center text-base h-10 border-2 border-gray-300 rounded-full"
            placeholder=""
          />
        </div>
        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 max-w-[200px]">
          {" "}
          {/* Adjusted gap and max-w */}
          {numbers.map((num) => (
            <Button
              key={num}
              variant="outline"
              size="lg"
              className="h-10 w-14 text-base font-medium border-2 border-gray-300 hover:bg-gray-100 bg-transparent"
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </Button>
          ))}
        </div>
        {/* Action Buttons */}
        <div className="flex space-x-3">
          {" "}
          {/* Adjusted space-x */}
          <Button
            variant="destructive"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-sm"
            onClick={handleSignUp}
          >
            {" "}
            {/* Adjusted px, py, font size */}
            Sign Up
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent text-sm"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-sm" onClick={handleLogin}>
            {" "}
            {/* Adjusted px, py, font size */}
            Login
          </Button>
        </div>
        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full max-w-[280px]">
          {" "}
          {/* Adjusted space-y, space-x, max-w */}
          <Button
            className="flex-1 h-10 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium rounded-full text-sm"
            onClick={handleCryptoSignup}
          >
            Signup with Crypto
          </Button>
          <Button className="flex-1 h-10 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium rounded-full text-sm">
            {" "}
            {/* Adjusted height and font size */}
            Other Method
          </Button>
        </div>
      </div>

      {/* Initial Welcome Modal (on site access) */}
      {showInitialWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
          {" "}
          {/* Adjusted padding */}
          <div className="bg-gray-200 rounded-2xl p-5 max-w-xs w-full relative animate-in zoom-in duration-300">
            {" "}
            {/* Adjusted padding and max-w */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 h-6 w-6"
              onClick={() => setShowInitialWelcome(false)}
            >
              <X className="h-4 w-4" /> {/* Adjusted icon size */}
            </Button>
            <div className="text-center space-y-3 mt-2">
              {" "}
              {/* Adjusted space-y */}
              <h2 className="text-xl font-bold text-red-600">Welcome to Cash Tube2025</h2> {/* Adjusted font size */}
              <div className="space-y-3 text-gray-700">
                {" "}
                {/* Adjusted space-y */}
                <p className="text-sm leading-relaxed">
                  {" "}
                  {/* Adjusted font size */}
                  If you have been looking for where to earn money by just watching ads video's.
                </p>
                <p className="text-sm leading-relaxed">
                  {" "}
                  {/* Adjusted font size */}
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
          {" "}
          {/* Adjusted padding */}
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full relative animate-in zoom-in duration-300">
            {" "}
            {/* Adjusted padding and max-w */}
            <div className="flex flex-col items-center justify-center space-y-5">
              {" "}
              {/* Adjusted space-y */}
              {/* Error Icon */}
              <div className="w-20 h-20 rounded-full border-4 border-red-400 flex items-center justify-center">
                {" "}
                {/* Adjusted size */}
                <X className="h-10 w-10 text-red-400" /> {/* Adjusted icon size */}
              </div>
              {/* Error Message */}
              <div className="text-center space-y-1">
                {" "}
                {/* Adjusted space-y */}
                <h2 className="text-2xl font-bold text-gray-700">Oops...</h2> {/* Adjusted font size */}
                <p className="text-lg text-gray-600">invalid Passcode!</p> {/* Adjusted font size */}
              </div>
              {/* OK Button */}
              <Button
                className="w-28 h-10 bg-indigo-500 hover:bg-indigo-600 text-white text-base rounded-md"
                onClick={closeInvalidModal}
              >
                OK
              </Button>
              {/* Buy Passcode Link */}
              <div className="pt-3 border-t border-gray-200 w-full text-center">
                {" "}
                {/* Adjusted padding */}
                <button
                  className="text-orange-500 hover:text-orange-600 text-base font-medium"
                  onClick={handleBuyPasscode}
                >
                  Buy Passcode?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buy Passcode Modal */}
      {showBuyPasscodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
          {" "}
          {/* Adjusted padding */}
          <div className="bg-white rounded-xl p-4 max-w-xs w-full relative animate-in zoom-in duration-300">
            {" "}
            {/* Adjusted padding and max-w */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 h-6 w-6"
              onClick={() => setShowBuyPasscodeModal(false)}
            >
              <X className="h-4 w-4" /> {/* Adjusted icon size */}
            </Button>
            <div className="space-y-3">
              {" "}
              {/* Adjusted space-y */}
              <h2 className="text-lg font-bold">Buy Your passcode</h2> {/* Adjusted font size */}
              <p className="text-xs">
                {" "}
                {/* Adjusted font size */}
                Please provide your details, note that your passcode will be reviewed immediately your payment is
                completed
              </p>
              <form onSubmit={handleSubmitForm} className="space-y-3">
                {" "}
                {/* Adjusted space-y */}
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-bold">
                    {" "}
                    {/* Adjusted font size */}
                    Name:
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-9 text-xs border-2"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="number" className="text-xs font-bold">
                    {" "}
                    {/* Adjusted font size */}
                    Number:
                  </label>
                  <Input
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="h-9 text-xs border-2"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="amount" className="text-xs font-bold">
                    {" "}
                    {/* Adjusted font size */}
                    Amount:
                  </label>
                  <Input
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="h-9 text-xs border-2"
                    readOnly
                  />
                </div>
                <Button type="submit" className="w-full h-9 bg-purple-600 hover:bg-purple-700 text-white text-xs">
                  {" "}
                  {/* Adjusted height and font size */}
                  Submit
                </Button>
                <div className="space-y-1 pt-1">
                  {" "}
                  {/* Adjusted space-y and padding */}
                  <p className="text-[10px]">
                    {" "}
                    {/* Adjusted font size */}
                    You have to make payment of ₦6,500 in order to be granted full access to the{" "}
                    <span className="text-pink-500">CASH-TUBE</span> video earning app.
                  </p>
                  <p className="text-[10px]">
                    {" "}
                    {/* Adjusted font size */}
                    Please note that you can withdraw back your ₦6,500 immediately you gain access to your dashboard.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Manual Bank Transfer Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
          {" "}
          {/* Adjusted padding */}
          <div className="bg-white rounded-lg max-w-xs w-full relative overflow-hidden shadow-lg animate-in zoom-in duration-300">
            {" "}
            {/* Adjusted max-w */}
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              {" "}
              {/* Adjusted padding */}
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                {" "}
                {/* Adjusted size */}
                <DollarSign className="h-4 w-4 text-white" /> {/* Adjusted icon size */}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">NGN {bankDetails.amount.replace("₦", "")}</p>{" "}
                {/* Adjusted font size */}
                <p className="text-xs text-gray-600">{bankDetails.email}</p> {/* Adjusted font size */}
              </div>
            </div>
            {/* Instructions */}
            <div className="p-3 text-center text-gray-700 text-base font-medium">
              {" "}
              {/* Adjusted padding and font size */}
              <p>Proceed to your bank app to complete this</p>
              <p className="text-red-600 font-bold text-sm">Transfer DON'T MAKE PAYMENT USING OPAY BANK</p>{" "}
              {/* Adjusted font size */}
            </div>
            {/* Bank Details */}
            <div className="p-3 space-y-3 bg-gray-50 border-t border-b border-gray-200">
              {" "}
              {/* Adjusted padding and space-y */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600">Amount</p> {/* Adjusted font size */}
                  <p className="text-base font-bold text-gray-800">{bankDetails.amount}</p> {/* Adjusted font size */}
                </div>
                <Button
                  variant="outline"
                  className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1.5 rounded-md text-xs"
                  onClick={() => handleCopy(bankDetails.amount.replace("₦", ""), "amount")}
                >
                  {copiedAmount ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600">Account Number</p> {/* Adjusted font size */}
                  <p className="text-base font-bold text-blue-600 underline">{bankDetails.accountNumber}</p>{" "}
                  {/* Adjusted font size */}
                </div>
                <Button
                  variant="outline"
                  className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1.5 rounded-md text-xs"
                  onClick={() => handleCopy(bankDetails.accountNumber, "account")}
                >
                  {copiedAccount ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div>
                <p className="text-xs text-gray-600">Bank Name</p> {/* Adjusted font size */}
                <p className="text-base font-bold text-gray-800">{bankDetails.bankName}</p> {/* Adjusted font size */}
              </div>
              <div>
                <p className="text-xs text-gray-600">Account Name</p> {/* Adjusted font size */}
                <p className="text-base font-bold text-gray-800">{bankDetails.accountName}</p>{" "}
                {/* Adjusted font size */}
              </div>
            </div>
            {/* Confirmation Section */}
            <div className="p-3 space-y-3 text-center">
              {" "}
              {/* Adjusted padding and space-y */}
              <p className="text-sm text-gray-700">Pay to this specific account and get your access code</p>{" "}
              {/* Adjusted font size */}
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-base font-medium py-2.5 rounded-md"
                onClick={handleBankPaymentConfirmed}
                disabled={isConfirmingPayment}
              >
                {isConfirmingPayment ? "Processing..." : "I have made this bank payment"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* "Checking payment..." Overlay */}
      {isCheckingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 z-[100]">
          <Loader2 className="h-16 w-16 text-white animate-spin mb-4" />
          <p className="text-white text-xl font-medium">Checking payment...</p>
        </div>
      )}

      {/* "Generating payment details..." Overlay */}
      {isLoadingPaymentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 z-[100]">
          <Loader2 className="h-16 w-16 text-white animate-spin mb-4" />
          <p className="text-white text-xl font-medium">Generating payment details...</p>
        </div>
      )}

      {/* "Payment not received" Modal */}
      {showPaymentNotReceivedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
          {" "}
          {/* Adjusted padding */}
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full relative animate-in zoom-in duration-300">
            {" "}
            {/* Adjusted padding and max-w */}
            <div className="flex flex-col items-center justify-center space-y-5">
              {" "}
              {/* Adjusted space-y */}
              {/* Error Icon */}
              <div className="w-20 h-20 rounded-full border-4 border-red-400 flex items-center justify-center">
                {" "}
                {/* Adjusted size */}
                <X className="h-10 w-10 text-red-400" /> {/* Adjusted icon size */}
              </div>
              {/* Error Message */}
              <div className="text-center space-y-1">
                {" "}
                {/* Adjusted space-y */}
                <h2 className="text-2xl font-bold text-gray-700">Payment Not Received</h2> {/* Adjusted font size */}
                <p className="text-lg text-gray-600">Please ensure you have completed the transfer.</p>{" "}
                {/* Adjusted font size */}
              </div>
              {/* OK Button */}
              <Button
                className="w-28 h-10 bg-indigo-500 hover:bg-indigo-600 text-white text-base rounded-md"
                onClick={closePaymentNotReceivedModal}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Crypto Payment Modal */}
      <CryptoPaymentModal isOpen={showCryptoPaymentModal} onClose={() => setShowCryptoPaymentModal(false)} />

      {/* Mobile Menu Component */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </div>
  )
}

interface Testimonial {
  id: number
  username: string
  amount: string
  timeAgo: string
}
