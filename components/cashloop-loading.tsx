'use client'

export default function CashloopLoading() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-primary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">₦</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-primary animate-pulse">
          Cashloop
        </h1>
        
        <p className="text-muted-foreground text-sm">
          Loading...
        </p>
      </div>
    </div>
  )
}
