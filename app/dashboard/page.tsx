// app/dashboard/page.tsx
"use client" // This page needs to be a client component to use useRouter

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation" // Import useRouter

export default function DashboardPage() {
  const router = useRouter()

  const handleLogout = () => {
    // In a real application, you would clear user session/token here
    // e.g., localStorage.removeItem('authToken');
    // or call a server action to invalidate the session cookie.
    console.log("User logged out.")
    router.push("/") // Redirect to home page
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Welcome to your Dashboard!</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Your payment was successful, and you now have full access to CashTube2025.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" passHref>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-md">
            Go Back to Home
          </Button>
        </Link>
        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-4 rounded-md">
          Logout
        </Button>
      </div>
    </div>
  )
}
