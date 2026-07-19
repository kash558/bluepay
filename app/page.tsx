"use client"

import { LoginForm } from "@/components/login-form"
import { Carousel } from "@/components/carousel"
import { FloatingChat } from "@/components/floating-chat"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a9b5c] flex flex-col relative overflow-x-hidden">
      {/* Hero Section with Carousel */}
      <div className="flex items-center justify-center px-3 sm:px-4 pt-4 sm:pt-6 pb-2 sm:pb-3">
        <div className="w-full max-w-2xl">
          <Carousel />
        </div>
      </div>

      {/* Login Form Card Section */}
      <div className="flex-1 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-6">
        <div className="w-full max-w-2xl">
          <LoginForm />
        </div>
      </div>

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  )
}
