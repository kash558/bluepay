'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Ban, RotateCcw } from 'lucide-react'

interface User {
  id: string
  email: string
  tier: string
  balance: number
  is_banned: boolean
  created_at: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, balance, tier, created_at')

      if (profiles) {
        // Get user emails from auth
        const { data: { users: authUsers } } = await supabase.auth.admin.listUsers()
        
        const usersWithEmail = profiles.map((profile: any) => {
          const authUser = authUsers?.find(u => u.id === profile.id)
          return {
            id: profile.id,
            email: authUser?.email || 'Unknown',
            tier: profile.tier,
            balance: profile.balance,
            is_banned: false,
            created_at: profile.created_at,
          }
        })
        
        setUsers(usersWithEmail)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async (userId: string) => {
    try {
      // Update user ban status in auth metadata
      // Note: In production, you'd need a proper ban system
      alert('User would be banned (admin-only action)')
      fetchUsers()
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  if (loading) {
    return <div className="text-muted-foreground">Loading users...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">User Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Tier</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Balance</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-card/50 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.tier === 'Free' ? 'bg-muted text-foreground' :
                    user.tier === 'Silver' ? 'bg-slate-600/20 text-slate-200' :
                    user.tier === 'Gold' ? 'bg-accent/20 text-accent' :
                    'bg-purple-600/20 text-purple-300'
                  }`}>
                    {user.tier}
                  </span>
                </td>
                <td className="py-3 px-4 text-foreground">₦{user.balance.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleBanUser(user.id)}
                    className="p-2 hover:bg-destructive/20 rounded transition-colors text-destructive"
                    title="Ban user"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">Total users: {users.length}</p>
    </div>
  )
}
