export const PRICING_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    duration: 0,
    features: [
      '3 invitations per month',
      'Basic themes',
      'Watermarked exports',
      'Standard quality (720p)',
      'Email support',
    ],
    limits: {
      invitationsPerMonth: 3,
      maxViews: 1000,
      exportQuality: '720p',
      premiumThemes: false,
      watermark: true,
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 499,
    duration: 1,
    features: [
      'Unlimited invitations',
      'All themes',
      'No watermark',
      'HD quality (1080p)',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
    ],
    limits: {
      invitationsPerMonth: -1,
      maxViews: -1,
      exportQuality: '1080p',
      premiumThemes: true,
      watermark: false,
    },
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 999,
    duration: 1,
    features: [
      'Everything in Pro',
      '4K quality exports',
      'Video exports (MP4)',
      'Custom 3D models',
      'White-label solution',
      'API access',
      'Dedicated support',
      'Custom domain',
    ],
    limits: {
      invitationsPerMonth: -1,
      maxViews: -1,
      exportQuality: '4k',
      premiumThemes: true,
      watermark: false,
      videoExport: true,
      customModels: true,
    },
  },
};

export function getPlanLimits(plan: 'FREE' | 'PRO' | 'PREMIUM') {
  return PRICING_PLANS[plan].limits;
}

export function canAccessPremiumFeature(userPlan: string, feature: string) {
  const plan = userPlan as 'FREE' | 'PRO' | 'PREMIUM';
  const limits = PRICING_PLANS[plan].limits;
  
  switch (feature) {
    case 'premiumThemes':
      return limits.premiumThemes;
    case 'noWatermark':
      return !limits.watermark;
    case 'videoExport':
      return (limits as any).videoExport || false;
    default:
      return false;
  }
}
