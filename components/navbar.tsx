'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  user: any
  profile: any
}

export default function Navbar({ user, profile }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-primary/30 sticky top-0 z-50 backdrop-blur">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
            ₦
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Cashloop</h1>
            <p className="text-xs font-semibold text-primary">{profile.tier} Member</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-foreground"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  )
}
