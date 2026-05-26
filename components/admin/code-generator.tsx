'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Copy, Trash2 } from 'lucide-react'

interface ActivationCode {
  id: string
  code: string
  tier: string
  used_by: string | null
  created_at: string
}

export default function CodeGenerator() {
  const [codes, setCodes] = useState<ActivationCode[]>([])
  const [tier, setTier] = useState('Silver')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const supabase = createClient()

  const generateCode = async () => {
    setGenerating(true)

    try {
      // Generate random code
      const code = `CL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      const { data: newCode } = await supabase
        .from('activation_codes')
        .insert({
          code,
          tier,
        })
        .select()
        .single()

      if (newCode) {
        setCodes([newCode, ...codes])
      }
    } catch (error) {
      console.error('Error generating code:', error)
      alert('Error generating code!')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDelete = async (codeId: string) => {
    try {
      await supabase
        .from('activation_codes')
        .delete()
        .eq('id', codeId)

      setCodes(codes.filter(c => c.id !== codeId))
    } catch (error) {
      console.error('Error deleting code:', error)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Generate Activation Codes</h2>

      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div>
          <label className="text-sm font-semibold text-foreground block mb-2">Tier</label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
          >
            <option value="Free">Free</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>

        <button
          onClick={generateCode}
          disabled={generating}
          className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {generating ? 'Generating...' : 'Generate Code'}
        </button>
      </div>

      <div className="space-y-2">
        {codes.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">No codes generated yet</p>
        ) : (
          codes.map((code) => (
            <div key={code.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm font-semibold text-foreground truncate">{code.code}</p>
                <p className="text-xs text-muted-foreground">
                  {code.tier} {code.used_by && '(Used)'}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => handleCopy(code.code)}
                  className="p-2 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(code.id)}
                  disabled={code.used_by !== null}
                  className="p-2 hover:bg-destructive/20 rounded transition-colors text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete code"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
