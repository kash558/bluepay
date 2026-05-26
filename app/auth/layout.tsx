'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CashloopLoading from '@/components/cashloop-loading'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          // User is already logged in, redirect to home
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
