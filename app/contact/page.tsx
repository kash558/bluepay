import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center p-4 sm:p-8 relative">
      {/* Back Button (positioned below the fixed header) */}
      <div className="w-full max-w-3xl flex justify-start mt-6 mb-6 z-10">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-3xl w-full space-y-8 text-gray-800 z-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-6">Contact Information📞</h1>

        {/* Telegram Contact Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">CASHTUB</h2>
          <p className="text-gray-600 mb-4">@vercelsupport</p>
          <Link href="https://t.me/vercelsupport" target="_blank" rel="noopener noreferrer" passHref>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg">
              SEND MESSAGE
            </Button>
          </Link>
        </div>

        {/* Other Contact Details */}
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            <span className="font-bold">Telegram Username:</span>{" "}
            <Link
              href="https://t.me/vercelsupport"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              t.me/vercelsupport
            </Link>
          </p>
          <p>
            <span className="font-bold">Email Support:</span>{" "}
            <a href="mailto:cashtubespport2025@gmail.com" className="text-blue-600 hover:underline">
              cashtubespport2025@gmail.com
            </a>
          </p>
          <p>
            <span className="font-bold">Availability:</span> [24/7]
          </p>
          <p>
            <span className="font-bold">Response Time:</span> [24Hours]
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-700 mt-8 mb-4">Assistance Categories💼</h2>
        <ul className="list-disc list-inside space-y-3 text-lg leading-relaxed">
          <li>
            Inquiries about <span className="font-bold">[Cashtube/Passcode]</span>
          </li>
          <li>
            E-mail Support at{" "}
            <a href="mailto:cashtubespport2025@gmail.com" className="text-blue-600 hover:underline">
              cashtubespport2025@gmail.com
            </a>
          </li>
          <li>
            Orders and Returns at{" "}
            <a href="mailto:cashtubespport2025@gmail.com" className="text-blue-600 hover:underline">
              cashtubespport2025@gmail.com
            </a>
          </li>
        </ul>

        <p className="text-lg leading-relaxed mt-8 text-center">
          Feel free to chat us up anytime on telegram or email, And we'll get back to you as soon as possible! 🥰
        </p>
      </div>
    </div>
  )
}
