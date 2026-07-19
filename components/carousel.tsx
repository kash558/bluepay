"use client"

import { useState, useEffect } from "react"

const carouselImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2148-DCyDPldampPjUZRDtLnComPErWdn2R.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2145-mKsQctGQoWwXB0Flg77jfndmVk4UCS.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2835-lBYYCkL9A3ju1KBhqC5Gx3y4iK3WLJ.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2152-lP3pSgJxZ0AqK8tE9FupwNmWYrvQhs.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2144-iHMlXpMYFzrdR9RBnVW8TqLOwl6trm.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2151-8t4hXN0Ygy6TskXcJdGWieejdzyjKS.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2836-s3ysMbdr1OHizWiwsCKADu0FrbKtaM.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2150-86zU3DI8OT1aS6pFEtXbjVF3biAwVM.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2147-c2laMHUa4LDSEhbqMiuLWy3VdLnWCU.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2146-trJA3Hp0kZzG1Tj6tZgzEnytPcdM6x.jpeg",
]

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full mx-auto mb-0 sm:mb-1">
      <div className="relative aspect-video sm:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden bg-[#1a9b5c]">
        <img
          src={carouselImages[currentIndex] || "/placeholder.svg"}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all rounded-full ${index === currentIndex ? "bg-white w-5 h-2 sm:w-6 sm:h-2" : "bg-white/50 w-2 h-2"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
