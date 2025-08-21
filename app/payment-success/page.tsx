// app/payment-success/page.tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4 text-center">
      <CheckCircle className="h-24 w-24 text-green-500 mb-6 animate-in zoom-in duration-500" />
      <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-md">
        Your payment for CashTube2025 passcode was successful. You can now proceed to your dashboard.
      </p>
      <Link href="/dashboard" passHref>
        <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-md">
          Go to Dashboard
        </Button>
      </Link>
      <Link href="/" passHref>
        <Button variant="link" className="mt-4 text-gray-600 hover:text-gray-800">
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
