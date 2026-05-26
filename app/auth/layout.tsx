'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authStorage } from '@/lib/storage'
import CashloopLoading from '@/components/cashloop-loading'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (authStorage.isLoggedIn()) {
          router.push('/')
        }
      } catch (error) {
        console.error('[v0] Error checking auth:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router])

  if (isChecking) {
    return <CashloopLoading />
  }

  return children
}
