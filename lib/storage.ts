// localStorage utilities for Cashloop

export interface User {
  id: string
  email: string
}

export interface Profile {
  id: string
  tier: 'Free' | 'Premium' | 'Gold'
  balance: number
  referral_code: string
  referral_earnings: number
  is_banned: boolean
  created_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  status: 'pending' | 'completed'
  bonus_amount: number
  created_at: string
}

export interface EarningRecord {
  id: string
  user_id: string
  amount: number
  source: 'video' | 'spin' | 'referral'
  created_at: string
}

// User Authentication
export const authStorage = {
  setUser: (user: User) => {
    localStorage.setItem('cashloop_user', JSON.stringify(user))
  },
  getUser: (): User | null => {
    const user = localStorage.getItem('cashloop_user')
    return user ? JSON.parse(user) : null
  },
  setPassword: (password: string) => {
    localStorage.setItem('cashloop_password', btoa(password))
  },
  getPassword: (): string | null => {
    const pwd = localStorage.getItem('cashloop_password')
    return pwd ? atob(pwd) : null
  },
  logout: () => {
    localStorage.removeItem('cashloop_user')
    localStorage.removeItem('cashloop_password')
  },
  isLoggedIn: (): boolean => {
    return localStorage.getItem('cashloop_user') !== null
  },
}

// User Profile
export const profileStorage = {
  setProfile: (profile: Profile) => {
    localStorage.setItem('cashloop_profile', JSON.stringify(profile))
  },
  getProfile: (): Profile | null => {
    const profile = localStorage.getItem('cashloop_profile')
    return profile ? JSON.parse(profile) : null
  },
  updateBalance: (amount: number) => {
    const profile = profileStorage.getProfile()
    if (profile) {
      profile.balance = Math.max(0, amount)
      profileStorage.setProfile(profile)
    }
  },
  updateTier: (tier: 'Free' | 'Premium' | 'Gold') => {
    const profile = profileStorage.getProfile()
    if (profile) {
      profile.tier = tier
      profileStorage.setProfile(profile)
    }
  },
}

// Earnings History
export const earningsStorage = {
  addEarning: (earning: EarningRecord) => {
    const earnings = earningsStorage.getEarnings()
    earnings.push(earning)
    localStorage.setItem('cashloop_earnings', JSON.stringify(earnings))
  },
  getEarnings: (): EarningRecord[] => {
    const earnings = localStorage.getItem('cashloop_earnings')
    return earnings ? JSON.parse(earnings) : []
  },
  getTodayEarnings: (): number => {
    const today = new Date().toDateString()
    const earnings = earningsStorage.getEarnings()
    return earnings
      .filter(e => new Date(e.created_at).toDateString() === today)
      .reduce((sum, e) => sum + e.amount, 0)
  },
}

// Spin Tracking
export const spinStorage = {
  setLastSpinTime: (time: string) => {
    localStorage.setItem('cashloop_last_spin', time)
  },
  getLastSpinTime: (): string | null => {
    return localStorage.getItem('cashloop_last_spin')
  },
  canSpin: (): boolean => {
    const lastSpin = spinStorage.getLastSpinTime()
    if (!lastSpin) return true
    const lastSpinDate = new Date(lastSpin)
    const now = new Date()
    const diffHours = (now.getTime() - lastSpinDate.getTime()) / (1000 * 60 * 60)
    return diffHours >= 24
  },
}

// Referrals
export const referralStorage = {
  addReferral: (referral: Referral) => {
    const referrals = referralStorage.getReferrals()
    referrals.push(referral)
    localStorage.setItem('cashloop_referrals', JSON.stringify(referrals))
  },
  getReferrals: (): Referral[] => {
    const referrals = localStorage.getItem('cashloop_referrals')
    return referrals ? JSON.parse(referrals) : []
  },
  getUserReferrals: (userId: string): Referral[] => {
    return referralStorage.getReferrals().filter(r => r.referrer_id === userId)
  },
  completeReferral: (referredId: string) => {
    const referrals = referralStorage.getReferrals()
    const referral = referrals.find(r => r.referred_id === referredId)
    if (referral) {
      referral.status = 'completed'
      localStorage.setItem('cashloop_referrals', JSON.stringify(referrals))
    }
  },
}

// Generate unique ID
export const generateId = (): string => {
  return 'id_' + Math.random().toString(36).substr(2, 9)
}

// Generate referral code
export const generateReferralCode = (userId: string): string => {
  return `ref_${userId.substring(0, 8)}_${Math.random().toString(36).substring(2, 6)}`
}
