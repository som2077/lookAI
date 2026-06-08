<div align="center">
  <img src="assets/images/logo.png" alt="LookAI Logo" width="120" />

  # 👗 LookAI — Your Personal AI Stylist

  **Discover your style, digitize your wardrobe, and get AI-powered daily outfit recommendations.**
  
  [![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

<br />

## 📖 Table of Contents
- [✨ Features](#-features)
- [📱 Screen Previews](#-screen-previews)
- [🚀 Tech Stack](#-tech-stack)
- [📂 Production Architecture](#-production-architecture)
- [⚙️ Getting Started](#️-getting-started)
- [🔄 Core Workflows](#-core-workflows)

---

## ✨ Features

- **🧠 AI Outfit Recommendations**: Get daily outfit suggestions based on your personal style and the local weather.
- **📸 Intelligent Wardrobe Digitization**: Snap a photo and let our AI automatically detect the clothing category, occasion, and dominant colors.
- **🌤️ Real-Time Weather Integration**: Dynamic outfits synced perfectly with live weather data (Powered by Open-Meteo).
- **📊 Style Scoring & Gamification**: Track your fashion streak, view your Style Score (0–100), and unlock achievement badges.
- **📌 Pinterest-Style Masonry Grid**: Beautifully scroll through your digitized wardrobe with varying natural card heights.
- **🔐 Secure Authentication**: Passwordless login using Google SSO or Email OTP (Powered by Clerk).

---

## 📱 Screen Previews

> *(Replace placeholders with your actual application screenshots)*

| Home Dashboard | Digital Wardrobe | AI Outfit Generation | Style Score & Stats |
|:---:|:---:|:---:|:---:|
| <img src="https://via.placeholder.com/250x500.png?text=Home" width="250"> | <img src="https://via.placeholder.com/250x500.png?text=Wardrobe" width="250"> | <img src="https://via.placeholder.com/250x500.png?text=AI+Look" width="250"> | <img src="https://via.placeholder.com/250x500.png?text=Score" width="250"> |

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Expo SDK 54, React Native 0.81.5, Expo Router |
| **Language** | TypeScript |
| **Styling** | NativeWind v4 (TailwindCSS 3), React Native Reanimated |
| **Backend & DB** | Supabase (PostgreSQL + RLS + Edge Functions) |
| **Authentication** | Clerk (Google SSO + OTP) |
| **State Management** | Zustand v5 (Persisted via `expo-secure-store`) |
| **External APIs** | Open-Meteo (Real-time weather) |
| **In-App Purchases**| `react-native-iap` (Google Play Billing / App Store) |

---

## 📂 Production Architecture

LookAI is built using an enterprise-grade **Route Group** architecture to ensure clean separation of concerns without cluttering the URL structures.

```text
app/
├── UNNECESSARY/            # Unused prototypes and demo files
│   ├── posts.tsx
│   └── swipe-demo.tsx
└── (root)/                 # Authenticated workspace screens
    ├── _layout.tsx         # Authenticated environment wrapper
    ├── (ai-features)/      # AI & Outfit recommendation flows
    │   ├── look-ai.tsx
    │   ├── outfit.tsx
    │   └── outfit-log-detail.tsx
    ├── (analytics)/        # Gamification & tracking stats
    │   ├── score.tsx
    │   └── streak.tsx
    ├── (social)/           # Social interaction & feeds
    │   └── trend-feed.tsx
    ├── (subscription)/     # In-app purchases & billing
    │   ├── subscription.tsx
    │   └── manage-subscription.tsx
    ├── (wardrobe)/         # Wardrobe discovery & highlights
    │   ├── saved.tsx
    │   └── wardrobe-highlights.tsx
    ├── (tabs)/             # Main Tab Bar screen views
    │   ├── _layout.tsx     
    │   ├── index.tsx       # Home: Highlights, trend feeds, stats
    │   ├── wardrobe.tsx    # Wardrobe: Pinterest masonry grid
    │   ├── calendar.tsx    # Calendar: Outfit wear logs & scheduling
    │   └── profile.tsx     # Profile: Bio summary, body stats
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js 18+**
- **Expo CLI** (`npm i -g expo-cli`)
- **Clerk Account** (for Auth)
- **Supabase Project** (for Database)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/LookAI.git
cd LookAI
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxx
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxx
```
> **Note:** Weather data uses Open-Meteo which is completely free and requires no API key.

### 3. Start the Application
```bash
npx expo start
```
*Press `a` for Android, `i` for iOS, or scan the QR code using the Expo Go app.*

---

## 🔄 Core Workflows

### 🛡️ Authentication & Onboarding
Users sign in seamlessly via **Clerk SSO**. First-time users are routed to a beautiful 6-step onboarding wizard to establish their height, body shape, and style preferences before hitting the `(root)` authenticated layout.

### 👕 Intelligent Clothes Scanning
Users can open the in-app camera or gallery to upload a piece of clothing. An AI simulation animation plays while the backend auto-detects the category, occasion, and dominant color. The item is saved to Supabase and instantly populated in the wardrobe.

### 🌦️ Weather-Aware Suggestions
The `WeatherOutfitCard` requests location permissions, performs reverse geocoding, and pulls real-time data from the **Open-Meteo API**. It calculates a custom *Comfort Score* (temp + humidity + wind) to suggest the best fabrics and colors for the day.

### 💎 Premium Monetization
Integrated with `react-native-iap`. Free users hit a beautifully designed Paywall when attempting to use advanced AI features. Purchases trigger a Supabase Edge Function Webhook to verify the Google Play receipt and securely update the user's entitlements in the database.

---
<div align="center">
  <p>Built with ❤️ for modern fashion.</p>
</div>
