"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { FloatingChat } from "@/components/floating-chat"

export default function GroupsPage() {
  const router = useRouter()

  const communityOptions = [
    {
      title: "Telegram Channel",
      description: "Join our Telegram community for updates and exclusive content",
      icon: "✈️",
      bgColor: "bg-blue-100",
    },
    {
      title: "WhatsApp Group",
      description: "Connect with our WhatsApp community for instant updates",
      icon: "💬",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Join Our Community</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <p className="text-gray-600">Join our community to get updates, tips, and start earning with FairMonie Pay!</p>
        </div>

        {/* Community Options */}
        <div className="space-y-4">
          {/* Telegram Button */}
          <button
            onClick={() => window.open("https://t.me/fairmonieofficialchannel", "_blank")}
            className="w-full p-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 font-semibold"
          >
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl flex-shrink-0">
                ✈️
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold mb-1">Telegram Channel</h3>
                <p className="text-blue-100 text-sm">Join our Telegram community for updates and exclusive content</p>
              </div>
              <div className="text-3xl">→</div>
            </div>
          </button>

          {/* WhatsApp Button */}
          <button
            onClick={() => window.open("https://whatsapp.com/channel/0029VbBPGiv0G0XfRUvkEH1t", "_blank")}
            className="w-full p-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 font-semibold"
          >
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl flex-shrink-0">
                💬
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold mb-1">WhatsApp Group</h3>
                <p className="text-green-100 text-sm">Connect with our WhatsApp community for instant updates</p>
              </div>
              <div className="text-3xl">→</div>
            </div>
          </button>
        </div>
      </div>

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  )
}
