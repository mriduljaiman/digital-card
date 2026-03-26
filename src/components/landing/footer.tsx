import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-royal-darkBlue text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gold-gradient">
              Digital Invite
            </h3>
            <p className="text-white/70 mb-4 max-w-md">
              Create stunning 3D animated invitations for your special moments.
              Weddings, birthdays, and celebrations made beautiful.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/create" className="text-white/70 hover:text-royal-gold transition-colors">
                  Create Invite
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-white/70 hover:text-royal-gold transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-white/70 hover:text-royal-gold transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-royal-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-royal-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © 2026 Digital Invite. All rights reserved.
          </p>
          <p className="text-white/50 text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-accent-rose fill-accent-rose" /> for celebrations
          </p>
        </div>
      </div>
    </footer>
  );
}
