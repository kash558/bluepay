'use client'

import { MessageCircle, Mail } from 'lucide-react'

export default function CustomerCareFooter() {
  return (
    <footer className="bg-card border-t border-border mt-8">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Customer Care</h3>
          <p className="text-sm text-muted-foreground">Have questions? We&apos;re here to help!</p>
        </div>

        <div className="space-y-2">
          <a
            href="https://wa.me/234xxxxxxxxx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg hover:border-accent transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">WhatsApp Support</p>
              <p className="text-xs text-muted-foreground">Chat with us on WhatsApp</p>
            </div>
          </a>

          <a
            href="mailto:support@cashloop.com"
            className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg hover:border-accent transition-colors"
          >
            <Mail className="w-5 h-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Email Support</p>
              <p className="text-xs text-muted-foreground">support@cashloop.com</p>
            </div>
          </a>
        </div>

        <div className="text-center space-y-1 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">© 2024 Cashloop. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="#" className="text-accent hover:underline">Terms</a>
            <a href="#" className="text-accent hover:underline">Privacy</a>
            <a href="#" className="text-accent hover:underline">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
