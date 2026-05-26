'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authStorage } from '@/lib/storage'
import AdminHeader from '@/components/admin/admin-header'
import UserManagement from '@/components/admin/user-management'
import ReceiptApproval from '@/components/admin/receipt-approval'
import CodeGenerator from '@/components/admin/code-generator'

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        const user = authStorage.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        // For demo purposes, check if user's email is admin
        const isAdminUser = user.email === 'admin@cashloop.com'
        
        if (!isAdminUser) {
          router.push('/')
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error('Error checking admin access:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AdminHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6 border-b border-border overflow-x-auto">
          {[
            { id: 'users', label: 'Users' },
            { id: 'receipts', label: 'Receipts' },
            { id: 'codes', label: 'Activation Codes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'receipts' && <ReceiptApproval />}
          {activeTab === 'codes' && <CodeGenerator />}
        </div>
      </div>
    </main>
  )
}
