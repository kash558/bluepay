'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminHeader() {
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
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-bold">
            ⚙️
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Cashloop Admin</h1>
            <p className="text-xs text-muted-foreground">Management Panel</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </nav>
  )
}
