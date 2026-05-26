'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Key, CheckCircle } from 'lucide-react'

interface ActivationCodeValidatorProps {
  userId: string
}

export default function ActivationCodeValidator({ userId }: ActivationCodeValidatorProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setLoading(true)

    try {
      // Get activation code details
      const { data: activation, error: codeError } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .single()

      if (codeError || !activation) {
        alert('Invalid activation code!')
        setLoading(false)
        return
      }

      if (activation.used_by) {
        alert('This code has already been used!')
        setLoading(false)
        return
      }

      // Mark code as used
      await supabase
        .from('activation_codes')
        .update({
          used_by: userId,
          used_at: new Date().toISOString(),
        })
        .eq('id', activation.id)

      // Update user's tier
      await supabase
        .from('profiles')
        .update({
          tier: activation.tier,
          balance: 0, // Reset balance on tier upgrade
        })
        .eq('id', userId)

      setSuccess(true)
      setCode('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error validating code:', error)
      alert('Error processing activation code!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Key className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Activation Code</h3>
      </div>

      <form onSubmit={handleValidate} className="space-y-3">
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground font-semibold py-2 rounded-lg transition-colors"
        >
          {loading ? 'Validating...' : 'Activate'}
        </button>
      </form>

      {success && (
        <div className="flex items-center gap-2 bg-accent/10 rounded-lg p-3">
          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Account upgraded!</p>
            <p className="text-xs text-muted-foreground">Refresh to see new features</p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Have an activation code? Enter it here to instantly upgrade your account.
      </p>
    </div>
  )
}
