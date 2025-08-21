import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      {/* Back Button */}
      <div className="w-full max-w-3xl flex justify-start mb-6">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-3xl w-full space-y-6 text-gray-800">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-pink-600 mb-6">About Us</h1>

        <p className="text-lg leading-relaxed">
          Welcome to Cash Tube😄We are the number one when it comes to making money online by just watching ads and
          videos online😁
        </p>

        <p className="text-lg leading-relaxed">
          Instead of wasting your data on TikTok, Instagram, Facebook, and other social media platforms that has nothing
          to offer.
        </p>

        <p className="text-lg leading-relaxed font-bold">
          With just 100mb of data you can make up to 1 million naira daily by just watching videos ads on your smart
          phone📱
        </p>

        <h2 className="text-2xl font-bold text-gray-700 mt-8 mb-4">Follow these steps correctly🪜</h2>
        <ul className="list-disc list-inside space-y-3 text-lg leading-relaxed">
          <li>Make sure your internet connection is active.</li>
          <li>Open the Cash Tube Application.</li>
          <li>
            Click on the <span className="font-bold">Sign up</span> button.
          </li>
          <li>
            Enter your name and number correctly and click on <span className="font-bold">submit</span>.
          </li>
          <li>
            Enter your full name and email address correctly then click on the <span className="font-bold">pay</span>{" "}
            button.
          </li>
          <li>
            Make your payment of <span className="font-bold">₦6,500</span> to the provided account details displayed on
            that section and click on the <span className="font-bold">"I have made this Bank transfer"</span>.
          </li>
          <li>
            Your <span className="font-bold">( 5 ) digit passcode</span> will be visible to you immediately your payment
            is confirmed.✅
          </li>
        </ul>
      </div>
    </div>
  )
}
