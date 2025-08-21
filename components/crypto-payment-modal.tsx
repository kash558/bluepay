"use client"

import { useState, useEffect } from "react"
import { X, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CryptoPaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CryptoPaymentModal({ isOpen, onClose }: CryptoPaymentModalProps) {
  const [usdtCopied, setUsdtCopied] = useState(false)
  const [btcCopied, setBtcCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds

  const usdtAddress = "TT51t6655dpLgvVzCd14R5ES4EQt846G2a"
  const btcAddress = "bc1qkvpd22yax9fcurztfrgt4x5s3k0sxaevzp8927"

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(600) // Reset timer when modal closes
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          // Optionally, close modal or show expired message
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleCopy = (text: string, type: "usdt" | "btc") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "usdt") {
        setUsdtCopied(true)
        setTimeout(() => setUsdtCopied(false), 2000)
      } else if (type === "btc") {
        setBtcCopied(true)
        setTimeout(() => setBtcCopied(false), 2000)
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-4 max-w-xs w-full relative shadow-lg animate-in zoom-in duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="text-center space-y-3">
          <h2 className="text-lg font-bold text-gray-800">Crypto Payment</h2>

          <p className="text-xs text-gray-600 leading-relaxed">
            Make your payment of $20 worth of USDT (TRC20) or BTC through any cryptocurrency application, select any of
            the wallet address below and pay into.
          </p>

          <p className="text-xs text-gray-600 leading-relaxed">
            Your five digit ( 5 ) passcode will automatically display below immediately your payment it's confirmed ✅
          </p>

          <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center">
            <img
              src="/images/crypto-payment-illustration.png"
              alt="Crypto Payment Illustration"
              className="max-h-[100px] w-auto"
            />
          </div>

          <div className="text-left space-y-3">
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">USDT:</p>
              <div className="flex items-center space-x-1">
                <Input
                  type="text"
                  value={usdtAddress}
                  readOnly
                  className="flex-1 text-xs border-gray-300 rounded-md h-8"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 text-gray-600 hover:bg-gray-100 bg-transparent"
                  onClick={() => handleCopy(usdtAddress, "usdt")}
                >
                  {usdtCopied ? "✅" : <Copy className="h-4 w-4" />}
                  <span className="sr-only">{usdtCopied ? "Copied!" : "Copy USDT address"}</span>
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">B.T.C:</p>
              <div className="flex items-center space-x-1">
                <Input
                  type="text"
                  value={btcAddress}
                  readOnly
                  className="flex-1 text-xs border-gray-300 rounded-md h-8"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 text-gray-600 hover:bg-gray-100 bg-transparent"
                  onClick={() => handleCopy(btcAddress, "btc")}
                >
                  {btcCopied ? "✅" : <Copy className="h-4 w-4" />}
                  <span className="sr-only">{btcCopied ? "Copied!" : "Copy BTC address"}</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-600 space-y-0.5">
            <p>Auto Confirmation is on...</p>
            <p>Payment will close in {formatTime(timeLeft)} mins</p>
          </div>

          <Input
            type="text"
            placeholder="Passcode will display here..."
            readOnly
            className="text-center text-xs h-9 border-2 border-gray-300 rounded-md bg-gray-50"
          />
        </div>
      </div>
    </div>
  )
}
