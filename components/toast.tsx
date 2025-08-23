"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Toast {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

export function ToastComponent({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    setIsVisible(true)

    // Auto dismiss
    const timer = setTimeout(() => {
      handleRemove()
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => {
      onRemove(toast.id)
    }, 300) // Wait for animation to complete
  }

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-l-green-500"
      case "error":
        return "border-l-red-500"
      case "warning":
        return "border-l-yellow-500"
      case "info":
        return "border-l-blue-500"
      default:
        return "border-l-green-500"
    }
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        bg-white rounded-lg shadow-lg border-l-4 ${getBorderColor()}
        p-4 mb-3 max-w-sm w-full
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{toast.title}</p>
          <p className="text-sm text-gray-500 mt-1">{toast.message}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 ml-2 h-6 w-6 text-gray-400 hover:text-gray-600"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}
