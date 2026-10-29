# 🐾 PawFortune (貓咪生活手帳)

> **Cozy Cat-Themed Daily Lifestyle, Fortune & Wellness Companion**  
> A heartwarming mobile application designed with soothing Japanese aesthetics, daily spiritual guidance, interactive check-ins, and memory journaling.

[![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-57.0-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/TailwindCSS-NativeWind_v4-38B2AC?logo=tailwind-css&logoColor=white)](https://www.nativewind.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query)

---

## 🌟 Key Features

### 1. 🐾 Interactive Cat Paw Check-In (貓掌簽到)
- **Playful Unlock Gesture**: Rapidly tap 3 times or long-press the central cat paw card to unlock today's fortune.
- **Haptic & Sound Feedback**: Immediate visual celebrations and haptic confirmation upon unlocking.
- **Automatic Status Sync**: Stores check-in status and synchronizes with the cloud backend.

### 2. 🥠 Auspicious Daily Fortune Guide (每日運勢與吉凶)
- **Daily Status**: Categorized into **吉 (Lucky)**, **平 (Normal)**, and **凶 (Bad Luck)** with custom bilingual banners.
- **Auspicious Guide**:
  - **Good For (宜)**: e.g., Wisdom, Letting Go, Spontaneity.
  - **Avoid (忌)**: e.g., Interrupting Others, Holding Grudges, Negative News.
- **Lucky Elements**:
  - **Lucky Color**: Bilingual color name with real-time hex color preview badge.
  - **Lucky Number**: Single or double-digit lucky integer.
  - **Lucky Direction**: Compass heading (e.g., 西北 Northwest).
- **Cat Guru Quote (每日金句)**: Uplifting, heartwarming words of wisdom presented in Japanese/Chinese and English.

### 3. 🎨 Drag & Drop Sticker Calendar (拖拽貼紙日曆)
- **Smooth Gesture Physics**: Built with **React Native Reanimated** and **Gesture Handler**.
- **Interactive Tray**: Pick from an assortment of charming cat-themed stickers (🐾 paw, 🐱 cat, ☕ coffee, ⭐ star, 🐟 fish, 🌸 flower).
- **Drag & Snap**: Long-press any sticker, drag it across the screen with spring physics, and drop it directly onto any calendar date cell. Page scroll locks automatically during dragging for a silky smooth feel.
- **Persistent Storage**: Saved sticker records persist across sessions.

### 4. 🃏 Cat Tarot Fortune Reading (貓咪塔羅)
- **Interactive 3-Card Draw**: Mystery cards numbered 1, 2, and 3 float upward upon selection.
- **Instant Backend Integration**: Dispatches `POST /tarot/today/` with payload `{"card_number": n}` using TanStack Query mutations.
- **Automatic Query Revalidation**: Seamlessly invalidates and refetches today's tarot cache upon completion.
- **Golden Card Reveal & Slide-Up Bottom Sheet**:
  - Displays the central golden calico cat tarot card (`tarotCard.png`).
  - An elegant modal slides up from the bottom with **🐾 今日指引 (Today's Guidance)**, bilingual lesson title, and detailed reflection content.
  - **Smart Re-visit**: If a reading already exists, clicking *"查看今日指引 / View Today's Reading"* displays the card and bottom sheet instantly without duplicate network requests.

### 5. ⏰ Gentle Cat Alarm System (貓咪鬧鐘)
- **Background & Foreground Notifications**: Scheduled with **Expo Notifications** and Android native notification channels.
- **Repeat Days**: Set alarms for specific days of the week (Mon–Sun).
- **Custom Melodies & Labels**: Choose custom ringtones and label morning reminders.
- **One-Tap Toggle**: Enable or disable alarms instantly with real-time scheduler synchronization.

### 6. 💌 Time Capsule: Letters to Future Self (寫給未來的你)
- **Future Delivery**: Compose heartfelt letters and seal them until a chosen future unlock date (1 month, 6 months, 1 year).
- **Encrypted Envelopes**: Visual countdown timer until letters unlock for reading.

---

## 🎨 Design & Aesthetics

- **Curated Japanese Café Palette**:
  - Warm Ambient Cream: `#FEEED6` / `#FFF9EE`
  - Terracotta Brown: `#5D3327` / `#43160E`
  - Fortune Gold: `#C57723` / `#D48B16`
  - Sakura Pink: `#EE5374` / `#DF4587`
- **Bilingual Typography**:
  - **ZenMaruGothic** (Regular, Medium, Bold, Black) — Cozy Japanese rounded typography.
  - **Sora** (Regular, Medium, SemiBold, Bold) — Modern, clean English font.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | React Native 0.86, Expo SDK 57 (React 19) |
| **Routing & Navigation** | Expo Router v4 (File-based navigation) |
| **State & Networking** | TanStack React Query v5 + Axios with JWT interceptors |
| **Styling & Design System**| NativeWind v4 (Tailwind CSS) |
| **Gestures & Animations** | React Native Gesture Handler + React Native Reanimated v4 |
| **Notifications** | Expo Notifications (`expo-notifications`) |
| **Storage & Security** | Expo SecureStore (`expo-secure-store`) |
| **Alerts & Toast** | Burnt (`burnt`) |

---

## 📁 Project Directory Structure

```text
├── app/                          # Expo Router file-based screens
│   ├── (auth)/                   # Authentication flows (login, register, otp)
│   ├── (tabs)/                   # Core bottom tab navigation
│   │   ├── index.tsx             # Home Screen (Check-in, Fortune, Stickers)
│   │   ├── explore.tsx           # Monthly Calendar & Diary journal
│   │   ├── alarm.tsx             # Cat Alarm manager
│   │   ├── notifications.tsx     # Cat Tarot fortune reading
│   │   └── profile.tsx           # Letters to Future Self
│   ├── _layout.tsx               # Root stack, providers, and fonts setup
│   └── index.tsx                 # Welcome splash entry
├── assets/
│   ├── fonts/                    # ZenMaruGothic & Sora font files
│   └── images/                   # High-res graphics (tarotCard, cat-tarot, alarms)
└── src/
    ├── components/               # Feature-based modular UI components
    │   ├── alarm/                # Alarm list, cards, and modal
    │   ├── calendar/             # Monthly calendar & date note cards
    │   ├── cat-tarot/            # Tarot 3-card selector, revealed card & modal
    │   ├── home/                 # HeroCard, Announcement, QuickActions, Stickers
    │   ├── letter/               # Time capsule letter view & editor
    │   └── navigation/           # Custom floating cat-paw tab bar
    ├── hooks/                    # TanStack Query custom hooks
    │   ├── useHome.ts            # Daily check-in & calendar queries
    │   ├── useTarot.ts           # Tarot queries & draw mutation
    │   └── useAlarm.ts           # Alarm CRUD operations
    ├── services/                 # Axios HTTP client & API service endpoints
    └── utils/                    # Token management, notification scheduler
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Android Studio](https://developer.android.com/studio) or Xcode (for local simulation/emulation)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npx expo`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/paw-fortune.git
   cd paw-fortune
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   EXPO_PUBLIC_API_BASE_URL=https://your-api-endpoint.com/api/v1
   ```

### Running the App

- **Run on Android:**
  ```bash
  npm run android
  ```

- **Run on iOS:**
  ```bash
  npm run ios
  ```

- **Start Metro Bundler with Clean Cache:**
  ```bash
  npx expo start -c
  ```

- **Create a Production / Preview APK via EAS:**
  ```bash
  eas build -p android --profile preview
  ```

---

## 📜 License

This project is licensed under the MIT License — feel free to explore, customize, and build upon it!
