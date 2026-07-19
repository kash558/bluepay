"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with sample users on first load
  useEffect(() => {
    const storedUsers = localStorage.getItem("fairmonie_users")
    if (!storedUsers) {
      const sampleUsers = [
        { id: "user_001", fullName: "John Doe", email: "john@example.com", password: "password123", balance: 0, bonusClaimed: false },
        { id: "user_002", fullName: "Sarah James", email: "sarah@example.com", password: "password123", balance: 0, bonusClaimed: false },
      ]
      localStorage.setItem("fairmonie_users", JSON.stringify(sampleUsers))
    }
    
    // Initialize transactions if not exists
    if (!localStorage.getItem("fairmonie_transactions")) {
      localStorage.setItem("fairmonie_transactions", JSON.stringify([]))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (activeTab === "login") {
      const storedUsers = JSON.parse(localStorage.getItem("fairmonie_users") || "[]")
      const user = storedUsers.find((u: any) => u.email === email && u.password === password)
      
      if (user) {
        localStorage.setItem("fairmonie_currentUser", JSON.stringify(user))
        setTimeout(() => {
          setIsLoading(false)
          router.push("/dashboard")
        }, 500)
      } else {
        alert("Invalid email or password")
        setIsLoading(false)
      }
    } else {
      // Create account
      if (password !== confirmPassword) {
        alert("Passwords do not match")
        setIsLoading(false)
        return
      }

      const storedUsers = JSON.parse(localStorage.getItem("fairmonie_users") || "[]")
      const userExists = storedUsers.some((u: any) => u.email === email)
      
      if (userExists) {
        alert("Email already registered")
        setIsLoading(false)
        return
      }

      const newUser = { id: "user_" + Date.now(), fullName, email, password, balance: 0, bonusClaimed: false }
      storedUsers.push(newUser)
      localStorage.setItem("fairmonie_users", JSON.stringify(storedUsers))
      localStorage.setItem("fairmonie_currentUser", JSON.stringify(newUser))
      
      setTimeout(() => {
        setIsLoading(false)
        router.push("/dashboard")
      }, 500)
    }
  }

  return (
    <div className="w-full max-w-4xl px-2 sm:px-0 -mt-2 sm:-mt-1">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg sm:shadow-xl">
        {/* Tab Buttons */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full text-xs sm:text-base font-semibold transition-colors ${
              activeTab === "login" ? "bg-[#1a9b5c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full text-xs sm:text-base font-semibold transition-colors ${
              activeTab === "signup" ? "bg-[#1a9b5c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
          {activeTab === "signup" && (
            <div className="space-y-2">
              <Input
                id="fullname"
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-11 sm:h-12 md:h-14 text-sm sm:text-base bg-gray-50 border-0 placeholder:text-gray-400"
              />
            </div>
          )}

          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 sm:h-12 md:h-14 text-sm sm:text-base bg-gray-50 border-0 placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 sm:h-12 md:h-14 text-sm sm:text-base bg-gray-50 border-0 placeholder:text-gray-400 pr-10 sm:pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          {activeTab === "signup" && (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-11 sm:h-12 md:h-14 text-sm sm:text-base bg-gray-50 border-0 placeholder:text-gray-400 pr-10 sm:pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {activeTab === "login" && (
            <div className="flex justify-end">
              <button type="button" className="text-sm text-[#1a9b5c] hover:underline font-medium">
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-base font-semibold bg-[#1a9b5c] hover:bg-[#168a4f] text-white rounded-full disabled:opacity-70"
          >
            {isLoading ? "Processing..." : activeTab === "login" ? "LOGIN" : "CREATE ACCOUNT"}
          </Button>
        </form>
      </div>
    </div>
  )
}
