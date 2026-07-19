"use client"

import { useState } from "react"
import { Download, Share2, ChevronLeft } from "lucide-react"

interface ReceiptDetails {
  title: string
  status: "success" | "pending" | "failed"
  amount: string
  transactionId: string
  date: string
  time: string
  details: Array<{
    label: string
    value: string
  }>
  balanceBefore?: string
  balanceAfter?: string
}

interface TransactionReceiptProps {
  receipt: ReceiptDetails
  onClose: () => void
}

export function TransactionReceipt({ receipt, onClose }: TransactionReceiptProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = `${receipt.title}\n${receipt.amount}\nTransaction ID: ${receipt.transactionId}\n${receipt.date} ${receipt.time}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.getElementById("receipt-content")
    if (!element) return
    
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    canvas.width = 400
    canvas.height = 600
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = "#000000"
    ctx.textAlign = "center"
    ctx.fillText(receipt.title, canvas.width / 2, 60)
    
    ctx.font = "32px Arial"
    ctx.fillStyle = "#1a9b5c"
    ctx.fillText(receipt.amount, canvas.width / 2, 120)
    
    ctx.font = "14px Arial"
    ctx.fillStyle = "#666666"
    ctx.textAlign = "left"
    let y = 180
    ctx.fillText(`Status: ${receipt.status.toUpperCase()}`, 40, y)
    y += 30
    ctx.fillText(`ID: ${receipt.transactionId}`, 40, y)
    y += 30
    ctx.fillText(`Date: ${receipt.date}`, 40, y)
    y += 30
    ctx.fillText(`Time: ${receipt.time}`, 40, y)
    
    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `receipt-${receipt.transactionId}.png`
    link.click()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#1a9b5c] text-white p-4 sticky top-0 flex items-center justify-between">
          <button onClick={onClose} className="hover:opacity-80">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold">Receipt</h2>
          <div className="w-6" />
        </div>

        {/* Receipt Content */}
        <div id="receipt-content" className="p-6 space-y-4">
          {/* Logo/Icon */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#e8f5ec] flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 rounded-full bg-[#1a9b5c] flex items-center justify-center text-white text-2xl">
                ✓
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{receipt.title}</h3>
            <p className="text-sm text-[#1a9b5c] font-semibold uppercase">{receipt.status}</p>
          </div>

          {/* Amount */}
          <div className="bg-[#f0f9f6] rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Amount</p>
            <p className="text-3xl font-bold text-[#1a9b5c]">{receipt.amount}</p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono font-semibold">{receipt.transactionId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold">{receipt.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Time:</span>
              <span className="font-semibold">{receipt.time}</span>
            </div>
          </div>

          {/* Additional Details */}
          {receipt.details.length > 0 && (
            <div className="space-y-2 bg-gray-50 rounded-lg p-4">
              {receipt.details.map((detail, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{detail.label}:</span>
                  <span className="font-semibold text-gray-900">{detail.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Balance Info */}
          {receipt.balanceBefore !== undefined && receipt.balanceAfter !== undefined && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Balance Before:</span>
                <span className="font-semibold">{receipt.balanceBefore}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Balance After:</span>
                <span className="font-bold text-[#1a9b5c]">{receipt.balanceAfter}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition"
            >
              {copied ? "✓ Copied" : "Copy Receipt"}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-3 bg-[#1a9b5c] hover:bg-[#168a4f] text-white rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
