"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, User, Info, Download, Play, Wallet, Crown, LogOut } from "lucide-react"

export default function MorePage() {
  const router = useRouter()

  const menuItems = [
    { label: "Profile Information", icon: User, path: "/dashboard/profile" },
    { label: "About", icon: Info, path: "/dashboard/about" },
    { label: "Download App", icon: Download, path: "#" },
    { label: "Watch Tutorial", icon: Play, path: "#" },
    { label: "Buy Faircode", icon: Wallet, path: "/dashboard/faircode" },
    { label: "Upgrade Account", icon: Crown, path: "#", bgColor: "bg-yellow-100" },
    { label: "Log Out", icon: LogOut, path: "#", bgColor: "bg-red-100", textColor: "text-red-600" },
  ]

  const handleMenuClick = (item: any) => {
    if (item.label === "Log Out") {
      localStorage.removeItem("fairmonie_currentUser")
      router.push("/")
    } else if (item.path && item.path !== "#") {
      router.push(item.path)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">More Options</h1>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const bgColor = item.bgColor || "bg-green-100"
          const textColor = item.textColor || ""
          
          return (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 hover:bg-gray-50 transition-colors"
            >
              <div className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${textColor || "text-[#1a9b5c]"}`} />
              </div>
              <span className={`text-lg font-semibold ${textColor || "text-gray-900"}`}>
                {item.label}
              </span>
              <ChevronLeft className="w-5 h-5 text-gray-400 ml-auto transform rotate-180" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

