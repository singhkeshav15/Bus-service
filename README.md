# 🚌 MK Bus Service

<div align="center">

**A full-stack seat booking platform built to solve a real operational problem — reliable exam-day transport for NPTEL students.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Turnstile-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://www.cloudflare.com/products/turnstile/)

[Live Demo](#) · [Report Bug](https://github.com/singhkeshav15/Bus-service/issues) · [GitHub](https://github.com/singhkeshav15/Bus-service)

</div>

---

## 📌 The Problem I Solved

Every NPTEL exam season, hundreds of students from GLA University needed transport to exam centers spread across the city. The existing process was chaotic — students messaged on WhatsApp, admins tracked bookings in spreadsheets, payments were unverified, and seats were double-booked.

**I built MK Bus Service to replace that entire mess with a single web app.**

Students get a clean booking flow. Admins get a real-time dashboard. Everything is automated — except payment verification, which I intentionally kept manual (explained below).

---

## ✨ Features

### For Students (Public)
- 🗓️ **Multi-step booking wizard** — Center → Date → Slot → Identity → Payment → Confirm
- 💳 **UPI payment flow** — Scan QR or copy UPI ID; upload screenshot as proof
- 🤖 **Bot protection** — Cloudflare Turnstile on every form submission
- 🎟️ **Digital boarding pass** — 3D tilt card with animated barcode; retrievable anytime via Booking ID + Phone
- 📸 **Client-side image compression** — Screenshots compressed from 5 MB → ~200 KB before upload
- 🔄 **Real-time seat availability** — Live updates via Supabase WebSockets
- 📱 **Fully responsive** — Mobile-first with sticky bottom CTA bar

### For Admins
- 📊 **Live dashboard** — Total / Pending / Approved / Revenue / Today stats with animated counters
- ✅ **One-click approve / reject** with optimistic UI updates
- 💬 **WhatsApp notification** — Auto-generates personalized message from template; opens wa.me link in one click
- 🔍 **Search & filter** — Filter bookings by status, center, or free-text (name / phone / ID / college)
- 📥 **CSV export** — All booking data exported instantly for records
- ⚙️ **Full settings control** — UPI ID, QR code, seat limits, centers, dates, slots, pickup points, announcement banner — all live via Supabase Realtime
- 🚦 **Booking gate toggle** — Open or close bookings for all students instantly

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React SPA (Vite)                          │
│                                                             │
│  Landing → BookingFlow → Confirmation → TicketPass          │
│  AdminLogin → AdminDashboard                                │
│                                                             │
│  State Machine: useState("page") — no React Router          │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS + WebSocket
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase (BaaS)                           │
│                                                             │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │   Auth   │  │  PostgreSQL  │  │       Storage         │ │
│  │  (JWT)   │  │              │  │  "payments" bucket    │ │
│  │Turnstile │  │ students     │  │  screenshot uploads   │ │
│  │ CAPTCHA  │  │ settings     │  └───────────────────────┘ │
│  └──────────┘  │ seat_counts  │                            │
│                │   (view)     │  ┌───────────────────────┐ │
│                └──────────────┘  │      Realtime         │ │
│                                  │ Postgres logical repl │ │
│                                  │ → WebSocket broadcast │ │
│                                  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### `students` table
| Column | Type | Description |
|---|---|---|
| `id` | uuid PK | Auto-generated |
| `booking_ref` | text | Human-readable ID e.g. `MK4F2A9B` |
| `name` | text | Passenger full name |
| `phone` | text | WhatsApp number (10 digits) |
| `email` | text | Optional |
| `college` | text | Institution name |
| `roll_no` | text | University roll number |
| `pickup_point` | text | Selected pickup location |
| `center` | text | Exam center ID |
| `exam_date` | date | Journey date |
| `slot` | text | Time slot ID |
| `group_size` | int | Number of seats (1–4) |
| `price` | int | Total amount paid (₹) |
| `utr` | text | UPI transaction reference (11–12 chars, unique) |
| `screenshot_url` | text | URL of payment proof in Supabase Storage |
| `payment_status` | text | `pending` / `approved` / `rejected` |
| `created_at` | timestamptz | Booking timestamp |

### `settings` table
| Column | Type | Description |
|---|---|---|
| `id` | int PK | Always `1` — single row |
| `data` | jsonb | All app config (UPI, centers, dates, slots, templates…) |

> **Design decision:** One JSONB column means new config fields can be added without `ALTER TABLE` migrations. Trade-off is no schema enforcement — acceptable for admin-controlled config.

### `seat_counts` — PostgreSQL view
Aggregates non-rejected bookings grouped by `(center, exam_date, slot)`. Lets public users see availability without exposing individual booking records.

### Row Level Security (RLS)
| Table | Public | Authenticated Admin |
|---|---|---|
| `students` | INSERT only | Full SELECT, UPDATE, DELETE |
| `settings` | SELECT only | SELECT, UPDATE |

---

## ⚡ Key Technical Decisions

**Why Supabase over Firebase?**
Booking data is structured and relational — each booking ties a student to a center, date, slot, and payment. PostgreSQL's relational model and unique constraints fit better than Firestore's document model. Supabase also gave Realtime and Auth for free, eliminating the need for a custom backend.

**Why manual UPI instead of Razorpay?**
Razorpay was integrated first, then removed. Students on mobile data experienced friction with the checkout iframe, and transaction fees reduced margin for a student-run service. Manual verification (admin reviews screenshot + UTR) was more trustworthy for this user base. This was a deliberate product decision.

**Why no React Router?**
6 views, strictly linear flow. A `useState("page")` state machine is faster to reason about and produces no URL changes — fine for an internal tool with no SEO requirements.

**Why client-side image compression?**
Students upload 5 MB+ screenshots. `browser-image-compression` uses an off-screen HTML Canvas to resize images entirely in the browser, cutting average file size by ~80% before upload. No server round-trip, no extra cost.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Realtime | Supabase Realtime (WebSocket) |
| Storage | Supabase Storage |
| Bot protection | Cloudflare Turnstile |
| Image compression | browser-image-compression |
| Receipt download | html2canvas |
| Styling | Pure CSS-in-JS |
| Fonts | Outfit + JetBrains Mono |

---

## 🚀 Getting Started

### 1. Clone & install
```bash
git clone https://github.com/singhkeshav15/Bus-service.git
cd Bus-service/bus-service
npm install
```

### 2. Environment variables
Create `.env` in the `bus-service/` folder:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key
VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

### 3. Supabase setup
Run in your Supabase SQL editor:

```sql
create table students (
  id uuid default gen_random_uuid() primary key,
  booking_ref text unique not null,
  name text not null, phone text not null, email text,
  college text not null, roll_no text, pickup_point text,
  center text not null, exam_date date not null, slot text not null,
  group_size int default 1, price int,
  utr text unique, screenshot_url text,
  payment_status text default 'pending',
  created_at timestamptz default now()
);

create table settings (id int primary key default 1, data jsonb default '{}'::jsonb);
insert into settings (id, data) values (1, '{}');

create view seat_counts as
  select center, exam_date, slot, count(*) as used_seats
  from students where payment_status != 'rejected'
  group by center, exam_date, slot;

alter table students enable row level security;
alter table settings enable row level security;

create policy "Public insert" on students for insert with check (true);
create policy "Public read settings" on settings for select using (true);
create policy "Admin all" on students for all using (auth.role() = 'authenticated');
create policy "Admin update settings" on settings for update using (auth.role() = 'authenticated');
```

Create a storage bucket named `payments` with **public read** access.

### 4. Run
```bash
npm run dev      # development
npm run build    # production build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.jsx   # Admin panel (overview, bookings, settings tabs)
│   │   └── AdminLogin.jsx       # Email + password + Turnstile login
│   ├── booking/
│   │   ├── BookingFlow.jsx      # 4-step booking wizard
│   │   ├── Confirmation.jsx     # Post-booking receipt + download
│   │   └── TicketPass.jsx       # Digital boarding pass with 3D tilt
│   ├── landing/
│   │   └── Landing.jsx          # Homepage, hero, centers grid, support modal
│   └── ui/
│       ├── Counter.jsx          # Animated number counter
│       ├── HeroGraphic.jsx      # SVG hero illustration
│       ├── HeroBus.jsx          # Animated bus SVG
│       └── ToastContainer.jsx   # Toast notification renderer
├── constants/
│   ├── defaults.js              # DEFAULT_SETTINGS fallback values
│   └── icons.jsx                # SVG icons as JSX constants
├── hooks/
│   └── useToast.js              # Toast queue hook
├── styles/
│   └── globals.js               # All CSS as JS string, injected at runtime
├── utils/
│   └── helpers.js               # genId, fmtDate, fmtTime, usedSeats
├── supabase.js                  # Supabase client singleton
├── App.jsx                      # Root: page state machine + Supabase subscriptions
└── main.jsx                     # Entry point
```

---

## 🔒 Security

- Cloudflare Turnstile on booking form and admin login
- Row Level Security enforced at the PostgreSQL level
- Duplicate check on phone, roll number, and UTR before insert
- All secrets in `.env`, never committed to git
- Admin queries validated via JWT server-side by Supabase

---

## 🧩 Challenges

**Race condition** — Two simultaneous submissions for the last seat both land in `pending`. Admin resolves via timestamp. A proper fix would use `SELECT ... FOR UPDATE` in a PostgreSQL transaction to enforce hard limits at the DB level.

**Razorpay pivot** — Removing a half-built integration taught me that reverting a technical decision is sometimes the right engineering call.

**Bundle size** — Vite flags the output at ~769 kB. Fix is lazy-loading the `AdminDashboard` with React `lazy()` + `Suspense` since students never need admin code.

---

## 👤 Author

**Keshav Singh** · [@singhkeshav15](https://github.com/singhkeshav15)

---

<div align="center">
  <sub>Built with ❤️ for NPTEL students · Safe · Punctual · Affordable</sub>
</div>
