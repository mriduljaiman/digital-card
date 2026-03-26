'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Share2, Facebook, Twitter, MessageCircle, Mail, Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  onShare?: (platform: string) => void;
}

export function ShareButtons({ url, title, description, onShare }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${fullUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description || title}\n\n${fullUrl}`)}`,
  };

  const handleShare = (platform: string, link?: string) => {
    if (link) {
      window.open(link, '_blank', 'width=600,height=400');
    }

    if (onShare) {
      onShare(platform);

      // Track analytics
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationSlug: url.split('/').pop(),
          eventType: 'SHARE_CLICK',
          source: platform,
        }),
      }).catch(console.error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      handleShare('copy-link');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: fullUrl,
        });
        handleShare('native');
      } catch (error) {
        // User cancelled share
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Invitation</DialogTitle>
          <DialogDescription>
            Share this invitation with your friends and family
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Native Share (mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button onClick={handleNativeShare} className="w-full" variant="default">
              <Share2 className="w-4 h-4 mr-2" />
              Share via...
            </Button>
          )}

          {/* Social Media Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}
              variant="outline"
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
              WhatsApp
            </Button>

            <Button
              onClick={() => handleShare('facebook', shareLinks.facebook)}
              variant="outline"
              className="w-full"
            >
              <Facebook className="w-4 h-4 mr-2 text-blue-600" />
              Facebook
            </Button>

            <Button
              onClick={() => handleShare('twitter', shareLinks.twitter)}
              variant="outline"
              className="w-full"
            >
              <Twitter className="w-4 h-4 mr-2 text-sky-500" />
              Twitter
            </Button>

            <Button
              onClick={() => handleShare('email', shareLinks.email)}
              variant="outline"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Or copy link</label>
            <div className="flex gap-2">
              <Input value={fullUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="secondary">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
