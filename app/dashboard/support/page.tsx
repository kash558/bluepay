"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { FloatingChat } from "@/components/floating-chat"

export default function SupportPage() {
  const router = useRouter()

  const handleTelegramClick = () => {
    window.open("https://t.me/vercelsupport", "_blank")
  }

  const handleEmailClick = () => {
    window.location.href = "mailto:sopportteam54@gmail.com"
  }

  const handleLiveChatClick = () => {
    router.push("/dashboard/support/chat")
  }

  const supportOptions = [
    {
      title: "Telegram Support",
      description: "Get instant support through our Telegram channel",
      handle: "t.me/vercelsupport",
      icon: "✈️",
      bgColor: "bg-blue-100",
      onClick: handleTelegramClick,
    },
    {
      title: "Email Support",
      description: "Send us an email and we'll get back to you within 24 hours",
      handle: "sopportteam54@gmail.com",
      icon: "✉️",
      bgColor: "bg-green-100",
      onClick: handleEmailClick,
    },
    {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      handle: "Available 24/7",
      icon: "💬",
      bgColor: "bg-green-100",
      onClick: handleLiveChatClick,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-300 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-700 hover:text-gray-900 font-bold"
            aria-label="Go back"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Support</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-4xl font-bold text-[#1a9b5c]">How can we help you?</h2>
          <p className="text-gray-800 font-bold text-lg">Choose your preferred way to get support from our team</p>
        </div>

        {/* Support Options */}
        <div className="space-y-4">
          {supportOptions.map((option) => (
            <button
              key={option.title}
              onClick={option.onClick}
              className="w-full p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl hover:shadow-xl hover:from-blue-100 hover:to-green-100 transition-all active:scale-95 border-2 border-gray-200 text-left"
            >
              <div className="flex gap-4 items-center">
                <div className={`w-16 h-16 rounded-full ${option.bgColor} flex items-center justify-center text-3xl flex-shrink-0`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{option.title}</h3>
                  <p className="text-gray-700 font-semibold text-sm mb-2">{option.description}</p>
                  {option.handle && (
                    <p className="text-[#1a9b5c] font-bold text-sm">{option.handle}</p>
                  )}
                </div>
                <div className="text-2xl">→</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Chat Button */}
      <FloatingChat />
    </div>
  )
}
