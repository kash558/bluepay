// Storage utility for persisting user data and transactions

export interface Transaction {
  id: string
  userId: string
  type: 'airtime' | 'data' | 'betting' | 'tv' | 'loan' | 'withdraw'
  amount: string
  phoneOrAccount: string
  network?: string
  bank?: string
  status: 'completed' | 'pending' | 'failed'
  timestamp: string
  date: string
}

export interface UserData {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  loginTime: string
}

// Initialize localStorage data
export const initializeStorage = () => {
  if (typeof window === 'undefined') return

  if (!localStorage.getItem('fairmonie_users')) {
    localStorage.setItem('fairmonie_users', JSON.stringify({}))
  }

  if (!localStorage.getItem('fairmonie_transactions')) {
    localStorage.setItem('fairmonie_transactions', JSON.stringify([]))
  }
}

// Get current logged-in user
export const getCurrentUser = (): UserData | null => {
  if (typeof window === 'undefined') return null

  const currentUser = localStorage.getItem('fairmonie_currentUser')
  return currentUser ? JSON.parse(currentUser) : null
}

// Set current logged-in user
export const setCurrentUser = (user: UserData) => {
  if (typeof window === 'undefined') return

  localStorage.setItem('fairmonie_currentUser', JSON.stringify(user))
  
  // Also store in users list if not exists
  const users = JSON.parse(localStorage.getItem('fairmonie_users') || '{}')
  if (!users[user.email]) {
    users[user.email] = user
    localStorage.setItem('fairmonie_users', JSON.stringify(users))
  }
}

// Add transaction
export const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp' | 'date'>): Transaction => {
  if (typeof window === 'undefined') return transaction as Transaction

  const transactions = JSON.parse(localStorage.getItem('fairmonie_transactions') || '[]')
  
  const newTransaction: Transaction = {
    ...transaction,
    id: 'TXN' + Date.now(),
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('en-NG'),
  }

  transactions.push(newTransaction)
  localStorage.setItem('fairmonie_transactions', JSON.stringify(transactions))

  return newTransaction
}

// Get user transactions
export const getUserTransactions = (userId: string): Transaction[] => {
  if (typeof window === 'undefined') return []

  const transactions = JSON.parse(localStorage.getItem('fairmonie_transactions') || '[]')
  return transactions.filter((t: Transaction) => t.userId === userId)
}

// Get all transactions
export const getAllTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return []

  return JSON.parse(localStorage.getItem('fairmonie_transactions') || '[]')
}

// Clear user session
export const clearSession = () => {
  if (typeof window === 'undefined') return

  localStorage.removeItem('fairmonie_currentUser')
}
