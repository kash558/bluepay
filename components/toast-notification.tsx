"use client"

import { useState, useEffect } from "react"

interface ToastProps {
  show: boolean
  userName: string
  amount: string
}

export function Toast({ show, userName, amount }: ToastProps) {
  return (
    <div
      className={`fixed top-6 left-4 right-4 bg-green-50 text-green-800 px-6 py-4 rounded-xl shadow-lg flex items-center gap-4 z-50 transition-all duration-500 border-l-4 border-green-600 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <span className="text-2xl flex-shrink-0">✅</span>
      <div className="flex-1">
        <div className="font-bold text-sm">Withdrawal Successful</div>
        <div className="text-sm">
          {userName} successfully withdrew <span className="text-green-700 font-bold">{amount}</span>
        </div>
      </div>
    </div>
  )
}

export function useToastNotifications() {
  const [currentToast, setCurrentToast] = useState<{ userName: string; amount: string } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const users = [
    { name: "Rukayat Adamu", amount: "₦212,000" },
    { name: "John Musa", amount: "₦150,000" },
    { name: "Aisha Bello", amount: "₦98,000" },
    { name: "Emeka Obi", amount: "₦305,000" },
    { name: "Fatima Lawal", amount: "₦120,000" },
  ]

  useEffect(() => {
    const showRandomToast = () => {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      setCurrentToast(randomUser)
      setIsVisible(true)

      setTimeout(() => {
        setIsVisible(false)
      }, 3000)
    }

    const interval = setInterval(showRandomToast, 4000)
    showRandomToast()

    return () => clearInterval(interval)
  }, [])

  return { currentToast, isVisible }
}
