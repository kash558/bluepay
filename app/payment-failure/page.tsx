// app/payment-failure/page.tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4 text-center">
      <XCircle className="h-24 w-24 text-red-500 mb-6 animate-in zoom-in duration-500" />
      <h1 className="text-4xl font-bold text-red-700 mb-4">Payment Failed!</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-md">
        Unfortunately, your payment could not be processed. Please try again or contact support.
      </p>
      <Link href="/" passHref>
        <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-md">Try Again</Button>
      </Link>
      <Link href="/" passHref>
        <Button variant="link" className="mt-4 text-gray-600 hover:text-gray-800">
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
