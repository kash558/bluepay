"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, User, Mail, Calendar, UserCheck } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [registrationDate, setRegistrationDate] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("fairmonie_currentUser") || "{}")
    if (currentUser.fullName) {
      setFullName(currentUser.fullName)
      setEmail(currentUser.email || "")
      setRegistrationDate(currentUser.registrationDate || "4/11/2026")
    }
    setLoading(false)
  }, [])

  if (loading) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f6f7]">
      {/* Header */}
      <div className="bg-gray-800 text-white p-5 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => router.back()} className="hover:opacity-80">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Profile Information</h1>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="max-w-md mx-auto space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-8 text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-[#e8f5ec] flex items-center justify-center mx-auto">
              <User className="w-12 h-12 text-[#1a9b5c]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1a9b5c]">Your Profile</h2>
          </div>

          {/* Full Name */}
          <div className="bg-[#e8f5ec] rounded-2xl p-5 border-2 border-[#1a9b5c] flex items-start gap-4">
            <User className="w-6 h-6 text-[#1a9b5c] flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a9b5c] mb-1">Full Name</p>
              <p className="text-lg font-bold text-gray-900 break-words">{fullName || "Not Set"}</p>
            </div>
          </div>

          {/* Email Address */}
          <div className="bg-[#e8f5ec] rounded-2xl p-5 border-2 border-[#1a9b5c] flex items-start gap-4">
            <Mail className="w-6 h-6 text-[#1a9b5c] flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a9b5c] mb-1">Email Address</p>
              <p className="text-lg font-bold text-gray-900 break-all">{email || "Not Set"}</p>
            </div>
          </div>

          {/* Registration Date */}
          <div className="bg-[#e8f5ec] rounded-2xl p-5 border-2 border-[#1a9b5c] flex items-start gap-4">
            <Calendar className="w-6 h-6 text-[#1a9b5c] flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a9b5c] mb-1">Registration Date</p>
              <p className="text-lg font-bold text-gray-900">{registrationDate}</p>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-[#e8f5ec] rounded-2xl p-5 border-2 border-[#1a9b5c] flex items-start gap-4">
            <UserCheck className="w-6 h-6 text-[#1a9b5c] flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a9b5c] mb-1">Account Status</p>
              <p className="text-lg font-bold text-[#1a9b5c]">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
