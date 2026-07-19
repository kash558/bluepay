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
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl">
        {/* Header Bar */}
        <div className="w-full h-16 md:h-20 bg-gradient-to-r from-[#1a9b5c] to-[#27c26c] rounded-2xl mb-8 md:mb-10" />
        
        {/* Tab Buttons */}
        <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-lg font-bold transition-all ${
              activeTab === "login" 
                ? "bg-[#1a9b5c] text-white shadow-lg hover:bg-[#168a4f]" 
                : "bg-gray-200 text-gray-600 hover:bg-gray-300 font-semibold"
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-lg font-bold transition-all ${
              activeTab === "signup" 
                ? "bg-[#1a9b5c] text-white shadow-lg hover:bg-[#168a4f]" 
                : "bg-gray-200 text-gray-600 hover:bg-gray-300 font-semibold"
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          {activeTab === "signup" && (
            <div>
              <Input
                id="fullname"
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full h-14 sm:h-16 md:h-18 text-base sm:text-lg font-semibold bg-gray-100 border-2 border-gray-200 rounded-xl placeholder:text-gray-500 placeholder:font-medium focus:border-[#1a9b5c] focus:bg-white transition"
              />
            </div>
          )}

          <div>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-14 sm:h-16 md:h-18 text-base sm:text-lg font-semibold bg-gray-100 border-2 border-gray-200 rounded-xl placeholder:text-gray-500 placeholder:font-medium focus:border-[#1a9b5c] focus:bg-white transition"
            />
          </div>

          <div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 sm:h-16 md:h-18 text-base sm:text-lg font-semibold bg-gray-100 border-2 border-gray-200 rounded-xl placeholder:text-gray-500 placeholder:font-medium focus:border-[#1a9b5c] focus:bg-white transition pr-12 sm:pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Eye className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>

          {activeTab === "signup" && (
            <div>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-14 sm:h-16 md:h-18 text-base sm:text-lg font-semibold bg-gray-100 border-2 border-gray-200 rounded-xl placeholder:text-gray-500 placeholder:font-medium focus:border-[#1a9b5c] focus:bg-white transition pr-12 sm:pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Eye className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
              </div>
            </div>
          )}

          {activeTab === "login" && (
            <div className="flex justify-end">
              <button type="button" className="text-base md:text-lg text-[#1a9b5c] hover:text-[#168a4f] underline font-bold">
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 sm:h-18 md:h-20 text-lg sm:text-xl font-bold bg-gradient-to-r from-[#1a9b5c] to-[#27c26c] hover:from-[#168a4f] hover:to-[#20a85a] text-white rounded-full disabled:opacity-70 transition-all shadow-lg"
          >
            {isLoading ? "Processing..." : activeTab === "login" ? "LOGIN" : "CREATE ACCOUNT"}
          </Button>
        </form>
      </div>
    </div>
  )
}
