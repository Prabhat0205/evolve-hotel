# Evolve Hotels & Resorts — Comprehensive Project Documentation

## 1. Project Overview

**Evolve Hotels & Resorts** is an enterprise-grade luxury hospitality and loyalty web platform built with **React 19**, **TypeScript**, and **Vite 8**. The application delivers a high-end guest booking and member rewards experience inspired by top-tier global boutique hospitality brands.

### Key Highlights
- **Curated Global Portfolio**: Multi-destination luxury properties (Kyoto, Manhattan, Houston Medical Center, Little Rock).
- **Flexible Guest & Member Scoping**: Seamless guest booking with instant confirmation codes, alongside rich member accounts with tier-based perks and points accumulation.
- **Evolve Rewards Loyalty Program**: Multi-tier loyalty system (`MEMBER`, `PRESTIGE`, `LEGACY`) with tier progression tracking, reward night redemptions, and exclusive perks.
- **In-Stay Guest Experience**: In-room dining and breakfast folio ordering tied to verified reservations.
- **Comprehensive Admin Portal**: Multi-role back-office interface for Property Managers and Front Desk personnel to track bookings, occupancy, revenue, guest profiles, and room inventory.
- **Luxury Design System**: Custom design tokens, serif typography (`Playfair Display`), warm natural neutrals, forest pine accents, and responsive layout styling.

---

## 2. Technology Stack & Dependencies

| Category | Technology / Library | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | [React](https://react.dev/) | `^19.2.8` | Core UI library with modern hooks and concurrent features |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `~6.0.2` | Strictly typed interfaces, enums, and data contracts |
| **Build Tool & Bundler** | [Vite](https://vitejs.dev/) | `^8.2.2` | Fast HMR, optimized ESM bundling, and asset pipelines |
| **Icons** | [Lucide React](https://lucide.dev/) | `^1.43.0` | Comprehensive iconography for luxury hospitality UI |
| **Linter** | [oxlint](https://oxc.rs/) | `^1.79.0` | High-performance Rust-based JavaScript/TypeScript linter |
| **Styling** | Vanilla CSS Tokens & Modules | Native | Zero-runtime CSS design tokens (`tokens.css`, `reset.css`, `components.css`, `admin.css`) |
| **Hosting & Deployment** | [Vercel](https://vercel.com/) | Static SPA | Configured via `vercel.json` with SPA routing rewrites |

---

## 3. Directory Structure

```text
Evolve frontend WEB/
├── index.html                  # HTML entry point with Google Fonts & meta tags
├── package.json                # Project dependencies, scripts, and engine requirements
├── tsconfig.json               # Base TypeScript configuration
├── tsconfig.app.json           # Application TypeScript compiler settings
├── tsconfig.node.json          # Node/tooling TypeScript compiler settings
├── vite.config.ts              # Vite plugins and server configuration
├── vercel.json                 # Deployment rewrite rules for client-side routing
├── public/                     # Static assets, logos, and favicons
└── src/
    ├── main.tsx                # React DOM mount point
    ├── App.tsx                 # Main application router and shell layout
    ├── App.css                 # Base application animations and layout rules
    ├── index.css               # Global entry styling
    ├── assets/                 # SVGs, images, and graphics
    ├── components/
    │   ├── common/
    │   │   ├── Header.tsx      # Navigation bar, currency/language selectors, member status
    │   │   ├── Footer.tsx      # Multi-column luxury footer, brand credentials, newsletter
    │   │   ├── AuthModal.tsx   # Login, registration, guest-to-member upgrade modals
    │   │   └── Toast.tsx       # System notifications and toast alerts
    │   └── rewards/
    │       └── RewardComponents.tsx # Tier badges, points meters, redemption widgets
    ├── context/
    │   ├── AppContext.tsx      # Global state (user, reservations, routing, active filters)
    │   └── AdminContext.tsx    # Back-office admin state (active role, active property, metrics)
    ├── data/
    │   ├── mockProperties.ts   # Property listings, rooms, rates, amenities, gallery images
    │   ├── mockUsers.ts        # Seed member and guest profiles
    │   ├── mockStays.ts        # Active, upcoming, and past reservations
    │   ├── mockRewards.ts      # Reward night catalog and redemption items
    │   ├── mockBreakfast.ts    # In-room breakfast menus, dietary options, and time slots
    │   ├── mockSupport.ts      # Help center topics, FAQs, and contact forms
    │   ├── mockNotifications.ts# User notification items
    │   ├── mockAdminProperties.ts # Admin property stats and readiness status
    │   ├── mockAdminUsers.ts   # Admin staff profiles (Property Manager, Front Desk)
    │   └── mockDashboardData.ts# Admin KPI metrics, revenue charts, and occupancy data
    ├── pages/
    │   ├── LandingPage.tsx     # Homepage with hero search, destination showcases, curated collections
    │   ├── SearchPage.tsx      # Property search with filters (city, date, guests, price, rating)
    │   ├── PropertyDetailPage.tsx # Room rate selection, gallery, amenities, location guide
    │   ├── CheckoutPage.tsx    # Multi-step checkout with guest details, payment, promo codes
    │   ├── ConfirmationPage.tsx # Booking confirmation with itinerary summary and QR/Code
    │   ├── MyStaysPage.tsx     # Guest/Member reservation management, cancel/modify stays
    │   ├── MembershipPage.tsx  # Evolve Rewards overview, tier tiers, qualifying progress
    │   ├── RewardsCatalogPage.tsx # Points redemption catalog for stays and luxury perks
    │   ├── InStayBreakfastPage.tsx # In-room dining ordering for active hotel stays
    │   ├── AccountPage.tsx     # Guest profile, preferences, saved payment methods
    │   ├── CorporateBookingPage.tsx # Corporate & group rate inquiry and booking
    │   ├── SupportPage.tsx     # Customer care, FAQs, and concierge inquiries
    │   └── admin/
    │       └── AdminPortal.tsx # Enterprise admin dashboard (KPIs, Bookings, Guests, Operations)
    ├── services/
    │   └── index.ts            # Data access layer, localStorage synchronization, booking API
    ├── styles/
    │   ├── tokens.css          # Design tokens (colors, typography, spacing, shadows, radii)
    │   ├── reset.css           # Modern CSS reset and normalization
    │   ├── components.css      # Reusable UI component styling (buttons, inputs, cards)
    │   └── admin.css           # Back-office dashboard and table styling
    └── types/
        ├── index.ts            # Core types (User, Reservation, Property, Room, Rate)
        └── admin.ts            # Admin types (AdminUser, AdminRole, DashboardGuestItem, Activity)
```

---

## 4. Key Functional Modules

### 4.1 Guest & Member Booking Engine
- **Search & Discovery**: Filter properties by destination (`Kyoto`, `Manhattan`, `Houston`, `Little Rock`), travel dates, guest count, and star ratings.
- **Room & Rate Selection**: View high-resolution image galleries, room dimensions (sqm), bed configurations, and selectable rate packages:
  - *Best Available Rate*
  - *Member Exclusive Rate* (includes bonus loyalty points and free cancellation)
  - *Corporate / Negotiated Rate*
  - *Military & Government Rate*
- **Checkout Flow**: 
  - Dual checkout options: Continue as Guest (with auto-generated Guest Code) or Sign In as Evolve Member.
  - Promo code redemption, tax & resort fee calculations, and simulated credit card billing (Visa, Mastercard, Amex).
  - Instant booking confirmation code generation.

### 4.2 Guest vs. Member Scoping
- **Isolated Storage**: Supports both guest sessions and persistent authenticated member accounts.
- **Guest-to-Member Conversion**: Guests can convert their stay directly into an Evolve Rewards account with a single password creation step, instantly absorbing their booked stays.
- **Cross-Tab Synchronization**: State is mirrored in `localStorage` with `storage` event listeners ensuring consistency across open browser windows.

### 4.3 Evolve Rewards Loyalty System
- **Tier Structure**:
  - `MEMBER`: Entry tier, access to member rates, complimentary Wi-Fi.
  - `PRESTIGE`: Enhanced tier, complimentary room upgrades upon availability, 2:00 PM late checkout, 25% bonus points.
  - `LEGACY`: Elite tier, guaranteed suite upgrades, 4:00 PM late checkout, dedicated concierge, 50% bonus points.
- **Points & Nights**: Tracks qualifying nights per calendar year, nights required for next tier upgrade, and lifetime stay metrics.
- **Redemption Catalog**: Redeem points for reward nights, private dining experiences, and airport transfers.

### 4.4 In-Stay Experience
- Verified guests with an active stay can order in-room dining and breakfast.
- Custom dietary preference toggling (vegan, gluten-free, nut allergy).
- Scheduled delivery time selection directly billed to the room folio.

### 4.5 Enterprise Admin Portal (`AdminPortal.tsx`)
- **Role-Based Views**: Tailored permissions for `Property Manager` and `Front Desk`.
- **Operational Dashboard**: Live statistics for Occupancy %, RevPAR (Revenue Per Available Room), ADR (Average Daily Rate), and pending arrivals/departures.
- **Reservation Directory**: Filter, search, check-in, or modify guest reservations.
- **Guest Profiles & CRM**: View guest loyalty status, total spend, Cloudbeds PMS integration IDs, and communication preferences.
- **Room Inventory & Maintenance**: Track room readiness, cleaning statuses, and out-of-order rooms.

---

## 5. Design System & Styling Architecture

The project features a bespoke design system defined in `src/styles/tokens.css`:

### Color Palette
- **Pine Forest Core**:
  - Primary: `#173f34` (Deep Pine Forest)
  - Primary Dark: `#17271f` (Deep Obsidian Forest)
  - Primary Subtle: `#e8edea` (Soft Pine Tint)
- **Honey Ochre & Gold Accents**:
  - Secondary: `#dda943` (Warm Honey Ochre)
  - Secondary Subtle: `#fcf6eb` (Light Honey Ochre Wash)
  - Eyebrow Amber: `#997125`
- **Canvas & Neutrals**:
  - Background Canvas: `#f6f3ec` (Warm Linen / Sand Canvas)
  - Surface: `#ffffff` (Pure White)
  - Sunken Surface: `#ede9df` (Muted Warm Linen)
  - Border: `#e2ded5`

### Typography
- **Headings**: `Playfair Display`, serif, Georgia (Luxury editorial typography)
- **Body Text**: `Plus Jakarta Sans`, sans-serif (Clean, readable modern sans-serif)
- **Monospace**: `ui-monospace`, SFMono-Regular, Menlo, monospace

---

## 6. Getting Started & Development

### 6.1 Prerequisites
- **Node.js**: Version `18.0.0` or higher
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`

### 6.2 Installation
```bash
# Clone the repository (if applicable)
git clone https://github.com/Prabhat0205/evolve-hotel.git
cd "Evolve frontend WEB"

# Install project dependencies
npm install
```

### 6.3 Local Development
```bash
# Start Vite development server with Hot Module Replacement (HMR)
npm run dev
```
Open your browser at `http://localhost:5173` (or the port specified in terminal output).

### 6.4 Type-Checking & Production Build
```bash
# Run TypeScript compilation and create production bundle
npm run build

# Preview the production build locally
npm run preview
```

### 6.5 Code Quality & Linting
```bash
# Fast linting using oxlint
npm run lint
```

---

## 7. Deployment Configuration

The application is prepared for zero-configuration static deployment on **Vercel** via `vercel.json`:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This guarantees client-side single-page application routing without 404 errors on deep URL refreshes.
