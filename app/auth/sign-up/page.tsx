'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!email || !password || !repeatPassword) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      if (!supabase) {
        throw new Error('Supabase client not initialized. Check environment variables.')
      }
      
      console.log('[v0] Sign-up attempt with email:', email)
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        console.error('[v0] Auth error:', error)
        throw new Error(error.message || 'Sign-up failed')
      }
      
      console.log('[v0] Sign-up successful, redirecting...')
      router.push('/')
    } catch (error: unknown) {
      let errorMsg = 'An error occurred'
      if (error instanceof Error) {
        errorMsg = error.message
      } else if (typeof error === 'string') {
        errorMsg = error
      }
      
      console.error('[v0] Sign-up exception:', errorMsg, error)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Cashloop</h1>
            <p className="text-muted-foreground text-sm">Watch videos & earn money</p>
          </div>

          <Card className="border-card bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Join Cashloop and start earning today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Confirm Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:underline font-semibold"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
