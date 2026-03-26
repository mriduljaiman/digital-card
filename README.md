# 🎉 Digital Card - 3D Invitation Platform

> Create stunning 3D digital invitations for weddings, birthdays, engagements, and special events with real-time RSVP tracking, analytics, and more.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-green)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ✨ Features

### 🎨 Core Features
- **3D Invitation Builder** - Create immersive 3D invitations with React Three Fiber
- **Multiple Event Types** - Wedding, Birthday, Engagement, Anniversary, Baby Shower
- **Beautiful Themes** - Pre-designed themes with customizable colors and animations
- **Photo Upload & Cropping** - Advanced image processing with Sharp
- **Music Integration** - Background music library with custom uploads
- **Real-time Preview** - Live preview of your invitation as you build

### 👥 Guest Management
- **RSVP System** - Complete RSVP tracking with Accepted/Declined/Maybe status
- **Guest List Management** - Add, edit, and manage guests
- **Check-in System** - Track guest arrivals at your event
- **CSV Export** - Export guest lists for offline use
- **Bulk Operations** - Manage multiple guests at once

### 📊 Analytics & Insights
- **Real-time Analytics** - Track views, shares, and downloads
- **Device Insights** - See what devices guests are using
- **Geographic Data** - Know where your guests are viewing from
- **Engagement Metrics** - Track RSVP rates and guest interactions
- **Performance Monitoring** - Web Vitals and performance metrics

### 📧 Communications
- **Email Notifications** - Automated emails via Resend or SMTP
- **WhatsApp Integration** - Send invitations via WhatsApp (Twilio)
- **In-app Notifications** - Real-time notifications for hosts
- **Event Reminders** - Automatic reminders to guests

### 🎬 Advanced Media
- **Video Export** - Export invitations as HD/4K videos with FFmpeg
- **Animation Timeline** - Custom GSAP animations with visual editor
- **3D Model Uploads** - Upload custom GLB/GLTF models (Premium)
- **Stock Photos** - Browse Unsplash library
- **AR/VR Support** - View invitations in AR/VR with WebXR

### 💳 Monetization
- **Subscription Plans** - FREE, PRO, PREMIUM tiers
- **Razorpay Integration** - Secure payments for Indian market
- **Plan Management** - Automatic upgrades and expiry tracking
- **Feature Gating** - Plan-based feature access

### 🌐 Production Ready
- **SEO Optimized** - Dynamic meta tags, sitemap, robots.txt
- **PWA Support** - Installable as mobile app
- **Social Sharing** - Share to WhatsApp, Facebook, Twitter, Email
- **Performance** - Optimized for speed and Core Web Vitals
- **Docker Ready** - Production deployment configs included

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/digital-card.git
cd digital-card

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📋 Environment Setup

### Required Variables

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Payments
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

### Optional Services

```env
# Stock Photos
UNSPLASH_ACCESS_KEY=your-unsplash-key

# Email (Choose one)
RESEND_API_KEY=your-resend-key
# OR
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

# WhatsApp
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 14.2** - React framework with App Router
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **React Three Fiber** - 3D rendering
- **Framer Motion** - Animations
- **GSAP** - Timeline animations

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma** - ORM and database toolkit
- **NextAuth.js** - Authentication
- **Zod** - Schema validation

### Media Processing
- **Sharp** - Image processing
- **FFmpeg** - Video encoding
- **Puppeteer** - Headless browser
- **Canvas** - Image manipulation

### Integrations
- **Razorpay** - Payment processing
- **Resend/Nodemailer** - Email delivery
- **Twilio** - WhatsApp messaging
- **Unsplash** - Stock photos

---

## 🎨 Pricing Tiers

### 💚 FREE
- 3 invitations per month
- Basic themes only
- Watermarked exports

### 💙 PRO - ₹499/month
- Unlimited invitations
- All themes
- No watermark
- HD video export
- Custom uploads

### 💛 PREMIUM - ₹999/month
- Everything in Pro
- 4K video export
- AR/VR preview
- Priority support
- Custom branding

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel
```

### Docker

```bash
docker build -t digital-card .
docker run -p 3000:3000 digital-card
```

---

## 📚 Documentation

- [Phase 5 Summary](PHASE5_SUMMARY.md) - Video & Advanced Media
- [Phase 6 & 7 Summary](PHASE6_7_SUMMARY.md) - Production Features

---

## 📝 License

MIT License - Free to use for personal & commercial projects

---

## 🙏 Acknowledgments

Built with ❤️ using Next.js, React Three Fiber, Prisma, and many amazing open-source libraries.

⭐ Star this repo if you find it helpful!
