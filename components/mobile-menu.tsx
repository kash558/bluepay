"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Overlay to close when clicking outside */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Menu Content */}
      <div className="relative flex h-16 w-full max-w-md animate-in slide-in-from-left duration-300">
        {/* Close Button */}
        <div className="relative z-10 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-[#3498db] text-white shadow-lg hover:bg-[#2980b9]"
            onClick={onClose}
          >
            <X className="h-8 w-8" />
          </Button>
          {/* Arrow shape connecting to the menu items */}
          <div className="absolute left-[calc(100%-1rem)] top-1/2 h-8 w-8 -translate-y-1/2 rotate-45 transform bg-[#3498db] shadow-lg" />
        </div>

        {/* Menu Items */}
        <div className="relative z-0 flex flex-1 items-center overflow-hidden rounded-r-lg shadow-lg">
          <Link href="/" passHref>
            <Button
              className="h-full flex-1 rounded-none bg-[#3498db] px-6 text-lg font-bold text-white hover:bg-[#2980b9]"
              onClick={onClose}
            >
              HOME
            </Button>
          </Link>
          <Link href="/about" passHref>
            <Button
              className="h-full flex-1 rounded-none bg-[#2980b9] px-6 text-lg font-bold text-white hover:bg-[#2471a3]"
              onClick={onClose}
            >
              ABOUT
            </Button>
          </Link>
          <Link href="/contact" passHref>
            <Button
              className="h-full flex-1 rounded-none bg-[#2471a3] px-6 text-lg font-bold text-white hover:bg-[#1f618d]"
              onClick={onClose}
            >
              CONTACT
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
