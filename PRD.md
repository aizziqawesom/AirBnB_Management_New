# Product Requirements Document (PRD)
## StayFlow - Property Management Platform

**Version:** 1.0
**Last Updated:** December 26, 2024
**Status:** Living Document

---

## Product Identity

| Attribute | Details |
|-----------|---------|
| **Product Name** | StayFlow |
| **Platform** | Web Application (Next.js 16.x)|
| **Database** 
| **Minimum OS** | Modern browsers (Chrome 90+, Safari 14+, Firefox 88+, Edge 90+) |
| **Developer** | amsoftware |
| **Release Philosophy** | SLC (Simple, Lovable, Complete) - Not an MVP |

---

## SLC Commitment: Simple, Lovable, Complete

StayFlow is built on the **SLC philosophy**, not as a Minimum Viable Product, but as a **complete experience** from day one:

- **Simple**: Intuitive workflows that property managers can master in 15 minutes
- **Lovable**: Delightful UX with beautiful email templates, smooth animations, and professional branding
- **Complete**: Full automation stack from booking to checkout with no "coming soon" placeholders in core features

We ship complete features, not half-baked experiments. Each release is production-ready, not beta.

---

## Overview

StayFlow is Southeast Asia's first property management platform purpose-built for modern hosts who manage 10-50 vacation rental properties. We automate the entire guest lifecycle—from booking to checkout—with intelligent event-driven triggers, WhatsApp-native communication, and professional branded experiences that make small operators look like 5-star hotels.

**Core Value Proposition:**
Turn property management chaos into seamless automation. Save 10+ hours weekly while delivering 5-star guest experiences through smart triggers, WhatsApp communication, and direct booking websites.

---

## Problem

Property managers scaling from 10-50 listings face a critical gap:

### The Pain Points:
1. **Manual Communication Overload**
   - Juggling WhatsApp, email, Airbnb messages, Instagram DMs across dozens of properties
   - Copy-pasting check-in details, house rules, WiFi passwords manually
   - Missing messages leads to poor reviews and lost revenue

2. **Expensive, Complex Enterprise Tools**
   - Tools like Hostaway/Guesty cost $1000+/month with complex setup (2-3 weeks)
   - Built for hotel chains, not mid-sized property managers
   - Western-focused, ignoring SEA realities (WhatsApp, local payments, regional OTAs)

3. **OTA Commission Drain**
   - Paying 15-20% to Airbnb/Booking.com on every reservation
   - No direct booking solution that's affordable and easy
   - Losing profit to platforms while doing all the work

4. **Inventory Chaos**
   - No clear view of what's in each property (towels, toiletries, furniture)
   - Cleaners asking "where's the spare bedsheets?" constantly
   - Restocking delays because you don't track what's running low

5. **Basic Automation Fails Them**
   - Generic scheduled emails don't adapt to real guest behavior
   - Can't react to events (early check-in, extended stay, maintenance issues)
   - Time-based drips feel robotic, not intelligent

### The Gap:
**Spreadsheets** are chaos. **Enterprise PMS** are overkill and expensive. **Mid-market tools** ignore SEA needs and lack true intelligent automation. **Nobody** offers affordable direct booking sites + WhatsApp + smart triggers in one platform.

---

## Motivation

### Why We're Building This:

**Personal Experience:**
amsoftware understands property management because we've lived it. We've felt the frustration of lost DMs, manual WhatsApp copy-paste, and watching 15% of revenue disappear to Airbnb.

**Market Opportunity:**
- SEA vacation rental market growing 25% YoY (2024)
- 78% of SEA guests prefer WhatsApp for host communication
- Average host with 10-20 properties spends 15+ hours/week on manual admin
- Direct booking adoption increasing as hosts seek commission-free revenue

**Technical Advantage:**
- Modern tech stack (Next.js, Supabase, React Email) enables rapid feature development
- Event-driven architecture allows true intelligent automation vs basic scheduled messages
- Malaysian-built means we understand local payment methods, OTAs (Agoda, Traveloka), and cultural nuances

**Pricing Philosophy:**
We can profitably serve the 10-50 property segment at RM1000/month while competitors ignore them (too small for enterprise, too big for free tools). This is our wedge.

---

## Target Users

### Primary Avatar (Core Focus):

**Multi-Property Pros: 10-50 Listings**

**Demographics:**
- Age: 32-55
- Location: Malaysia (Penang, KL, Johor Bahru), Singapore
- Properties: 10-50 vacation rentals (condos, landed houses, villas)
- Revenue: RM50k-200k/month gross
- Team: 1-2 admin staff, 3-5 cleaners, maybe 1 VA

**Psychographics:**
- Entrepreneurial, grew from side hustle to full business
- Overwhelmed by manual processes but too small for enterprise solutions
- Tech-savvy enough to adopt new tools quickly
- Values time over money (will pay to automate)
- Wants to scale to 100+ properties but current systems won't allow it

**Pain Points:**
- Spending 15+ hours/week on repetitive admin (messages, calendar checks, inventory)
- Losing bookings due to slow response times
- Paying $800-1500/month for tools that don't fit their needs
- No clear system for inventory tracking across properties
- Can't afford to hire full-time ops manager yet

**Goals:**
- Automate 80% of guest communication
- Reduce admin time from 15 hours/week to <5 hours/week
- Increase direct bookings (cut OTA dependency from 90% to 50%)
- Scale to 100 properties without doubling team size
- Professional brand image that rivals hotel chains

**Tools They Currently Use:**
- Airbnb/Booking.com (primary channels)
- WhatsApp Business (manual messaging)
- Google Sheets (property/inventory tracking)
- iCal sync (calendar management)
- Maybe: Hospitable or TouchStay (frustrated with limitations)

---

### Secondary Avatars (Future Focus):

**Growing Property Managers: 3-10 Listings**
- Scaling past the spreadsheet phase
- First tool adoption (moving from pure manual)
- Price-sensitive, need Starter tier
- High churn risk if not quickly successful

**Enterprise Operators: 50+ Listings**
- Custom needs, white-glove onboarding
- Custom pricing, longer sales cycles
- Future revenue opportunity but not SLC focus

---

## Pricing & Access (SLC)

### Pricing Tiers:

| Tier | Price | Listings Included | Additional Listing Cost | Target User |
|------|-------|-------------------|------------------------|-------------|
| **Starter** | RM 300/month | 0-5 listings | +RM 59/listing | Growing managers testing the platform |
| **Pro** | RM 1,000/month | 10-20 listings | +RM 59/listing | **Core Avatar** - Multi-Property Pros |
| **Enterprise** | Custom pricing | 50+ listings | Negotiated | Large operators, custom needs |

### Add-On Services (Future):

**Planned Add-Ons:**
- **Direct Booking Website Service**: RM 500 setup + RM 200/month/property (amsoftware builds custom site)
- **Premium Email Templates**: RM 150/month (designer-crafted templates)
- **WhatsApp Business API**: RM 300/month (official WhatsApp Business integration)
- **Advanced Analytics Dashboard**: RM 200/month (deeper insights, forecasting)

**Pricing Philosophy:**
- Base platform is complete and valuable on its own
- Add-ons are genuine enhancements, not held-back features
- Direct booking sites are high-touch service (we build it), justifies premium pricing

### Payment Terms:
- Monthly or annual billing (annual = 2 months free: RM 3,000 → RM 10,000 for Pro)
- Accepted methods: Credit card (Stripe), DuitNow, FPX, GrabPay
- 14-day money-back guarantee
- No setup fees, no hidden costs

---

## Limit Tracking for Tiers

### Hard Limits (Enforced):

| Resource | Starter | Pro | Enterprise |
|----------|---------|-----|------------|
| **Properties/Listings** | 5 | 20 | Unlimited |
| **Additional Listings** | +RM 59/listing | +RM 59/listing | Custom |
| **Team Members** | 2 users | 5 users | Unlimited |
| **Automated Messages/Month** | 200 | 1,000 | Unlimited |
| **Message Templates** | 10 | 50 | Unlimited |
| **Trigger Rules** | 5 active | 25 active | Unlimited |
| **Inventory Items/Property** | 50 | Unlimited | Unlimited |
| **API Calls/Day** | N/A | 1,000 | Custom |

### Soft Limits (Warnings, Not Blocks):

| Resource | Warning Threshold | Action |
|----------|------------------|--------|
| **Email Deliverability** | >500/day | Review for spam behavior |
| **WhatsApp Messages** | >50/property/day | Flag for review (potential abuse) |
| **Failed Messages** | >10% failure rate | Alert user, check integrations |

### Usage Tracking Implementation:

**Technical Approach:**
- `organization_usage` table tracks current month's consumption
- Resets 1st of each month
- Pre-flight checks before message send, property creation, user invitation
- Graceful degradation: Show upgrade prompt before hard block

**User Experience:**
- Usage dashboard shows current tier limits and consumption
- Proactive notifications at 80% and 100% of limits
- One-click upgrade flow when limits reached

---

## Key Features by Tier

### Core Features (All Tiers):

**Available to Starter, Pro, and Enterprise:**

1. **Property Management**
   - Add/edit properties with photos, descriptions, amenities
   - Calendar view with availability sync
   - Booking conflict detection

2. **Booking Management**
   - Create/edit/cancel bookings
   - Guest information capture (name, email, phone, guests count)
   - Status tracking (pending, confirmed, checked_in, checked_out, cancelled)
   - Price calculation

3. **Automated Messaging**
   - Email automation with React-based templates
   - Event-driven triggers (booking confirmed, check-in, check-out, etc.)
   - Template variable substitution ({{guest_name}}, {{property_name}}, etc.)
   - Idempotency protection (no duplicate sends)

4. **Message Templates**
   - Create/edit reusable message templates
   - Visual template editor
   - Preview with sample data

5. **Trigger System**
   - Event-based automation (not just time-based)
   - Custom trigger rules per property or organization-wide
   - Active/inactive toggle

6. **Team Collaboration**
   - Multi-user access with role-based permissions (within tier limits)
   - Organization management
   - Activity logs

7. **Basic Analytics**
   - Booking overview (total bookings, revenue)
   - Occupancy rates per property
   - Message delivery stats

### Pro & Enterprise Only:

8. **WhatsApp Integration**
   - WhatsApp Business API integration
   - Two-way messaging
   - Template message broadcasting
   - WhatsApp-specific automation triggers

9. **Inventory Management**
   - Track items per property (towels, toiletries, furniture, appliances)
   - Stock levels and low-stock alerts
   - Restock history
   - Assign items to rooms/areas

10. **Advanced Analytics & AI**
    - Revenue forecasting
    - Peak season identification
    - Guest behavior insights
    - AI-powered pricing suggestions
    - Performance benchmarks

11. **Priority Support**
    - Dedicated support channel
    - <2 hour response time (business hours)
    - Onboarding call

### Enterprise Only:

12. **Custom Integrations**
    - API access for custom workflows
    - Webhook support
    - SSO (Single Sign-On)

13. **White-Label Options**
    - Custom branding on emails
    - Custom domain for booking sites

14. **Dedicated Account Manager**
    - Monthly strategy calls
    - Custom training sessions

---

## MUST HAVE Features (SLC Launch)

**These features must be complete, polished, and production-ready for SLC launch:**

### ✅ Already Built (In Codebase):
1. ✅ **Property Management** - CRUD operations, photos, amenities
2. ✅ **Booking Management** - Create, edit, calendar, conflict detection
3. ✅ **Message Templates** - Visual editor, variable substitution
4. ✅ **Trigger System** - Event-driven automation (confirmed, checked_in, checked_out)
5. ✅ **Email Automation** - React Email templates, Resend integration, idempotency
6. ✅ **Organization & Team** - Multi-user, RLS policies, role-based access

### 🚧 Must Build for SLC:
7. 🚧 **WhatsApp Integration** - WhatsApp Business API, two-way messaging, triggers
8. 🚧 **Direct Booking Website Service** - Order form, website build process (amsoftware builds)
9. 🚧 **Inventory Management** - Items per property, stock tracking, low-stock alerts
10. 🚧 **Basic Analytics Dashboard** - Bookings, revenue, occupancy, message stats
11. 🚧 **AI Features (Basic)** - Smart message suggestions, auto-response to common questions

**Quality Bar:**
- All features fully tested (no beta labels)
- Mobile-responsive
- Error handling and graceful degradation
- Onboarding guides/tooltips
- Beautiful, polished UI

---

## Future Roadmap (Post-SLC)

**Phase 2 (3-6 months post-launch):**
- 🔮 **Social Media Integration** - Instagram DM booking, Facebook Messenger
- 🔮 **Advanced Analytics & AI** - Forecasting, dynamic pricing, guest segmentation
- 🔮 **OTA Integrations** - Airbnb API, Agoda, Traveloka channel manager

**Phase 3 (6-12 months post-launch):**
- 🔮 **Smart Lock Integration** - Igloohome, Schlage, Yale
- 🔮 **Automatic Lock Code Generation** - Unique codes per booking, auto-expire
- 🔮 **Mobile Apps** - iOS/Android native apps (PWA first)
- 🔮 **Payment Processing** - In-platform payment collection (Stripe, iPay88)

**Phase 4 (12+ months):**
- 🔮 **Marketplace** - Template marketplace, integration marketplace
- 🔮 **API Platform** - Public API for developers
- 🔮 **White-Label SaaS** - Let agencies resell StayFlow under their brand

---

## Core Screens & UX Flow

### Navigation Structure:

**Main Navigation (Sidebar):**
1. 🏠 **Dashboard** - Overview, quick stats, recent activity
2. 📅 **Calendar** - Multi-property calendar view
3. 🏢 **Properties** - Property list and management
4. 📋 **Bookings** - Booking list and details
5. 💬 **Messages** - Message templates library
6. ⚡ **Triggers** - Automation rules
7. 📦 **Inventory** - Stock tracking (Pro+)
8. 📊 **Analytics** - Reports and insights
9. ⚙️ **Settings** - Organization, team, billing, integrations

### Key User Flows:

---

#### **Flow 1: Onboarding (New User)**

**Goal:** Get user to first automated message sent in <15 minutes

```
1. Sign Up (Email/OAuth)
   ↓
2. Create Organization
   - Organization name
   - Currency (MYR, SGD, THB, IDR)
   - Timezone
   ↓
3. Add First Property (Guided)
   - Property name
   - Address
   - Upload 1-3 photos
   - Skip advanced settings (can edit later)
   ↓
4. Create First Booking (Sample or Real)
   - If sample: Pre-fill with demo data
   - If real: Simple form (guest name, dates, email)
   ↓
5. Choose First Trigger (Template)
   - Show 3 popular templates:
     - ✉️ "Welcome Email" (on booking confirmed)
     - 🔑 "Check-in Details" (24h before check-in)
     - 👋 "Thank You Message" (on check-out)
   - User picks one, preview, activate
   ↓
6. See It Work (Confirmation)
   - "🎉 You're all set! Your first automation is live."
   - Dashboard tour (optional, skippable)
   - Invite team members (optional)
```

**Success Metric:** 70% of users complete onboarding and activate ≥1 trigger within 24 hours

---

#### **Flow 2: Creating a Booking**

**Entry Points:**
- Dashboard → "New Booking" button
- Bookings page → "Add Booking"
- Calendar → Click date range

**Flow:**
```
1. Select Property (Dropdown or Calendar Click)
   ↓
2. Choose Dates
   - Check-in date picker
   - Check-out date picker
   - Real-time conflict detection (red warning if overlap)
   ↓
3. Guest Information
   - Guest name*
   - Guest email*
   - Phone number
   - Number of guests
   ↓
4. Booking Details
   - Price (auto-calculated or manual)
   - Status (Pending, Confirmed, Paid)
   - Special notes (optional)
   ↓
5. Review & Confirm
   - Summary card
   - "Create Booking" button
   ↓
6. Confirmation + Trigger Execution
   - Success message: "Booking created!"
   - Auto-trigger check: "Sending welcome email to guest..."
   - Redirect to booking detail page
```

**Edge Cases:**
- Date conflict: Show warning, block creation, suggest alternative dates
- Missing guest email: Warning that automated emails won't send
- Past dates: Allow but show warning "This booking is in the past"

---

#### **Flow 3: Setting Up Automation Trigger**

**Entry Points:**
- Triggers page → "Create Trigger"
- Message template detail → "Add to Trigger"

**Flow:**
```
1. Choose Event Type
   - Booking Confirmed
   - Check-in (X hours before/after)
   - Check-out (X hours before/after)
   - Custom event (future)
   ↓
2. Set Timing
   - If time-based: "Send 24 hours before check-in"
   - If immediate: "Send immediately when booking confirmed"
   - Time picker with presets (1h, 24h, 48h, 1 week)
   ↓
3. Select Message Template
   - Browse template library
   - Preview template with sample data
   - Or "Create New Template"
   ↓
4. Apply to Properties
   - All properties (default)
   - Specific properties (multi-select)
   ↓
5. Activate & Preview
   - Toggle "Active" switch
   - See example: "When a booking is confirmed at Sunset Villa, send 'Welcome Email' immediately"
   - "Save Trigger"
   ↓
6. Confirmation
   - Success: "Trigger activated! This will apply to all new bookings."
   - Return to triggers list
```

**Smart Defaults:**
- New triggers are "Active" by default
- Apply to "All properties" by default
- Suggest most popular timing for each event type

---

#### **Flow 4: Managing Property Inventory (Pro+)**

**Entry Points:**
- Inventory page → Select property
- Property detail page → "Manage Inventory" tab

**Flow:**
```
1. Select Property
   - Dropdown or property card
   ↓
2. View Inventory Dashboard
   - Categories: Linens, Toiletries, Kitchen, Furniture, Electronics
   - Low stock alerts highlighted in red
   ↓
3. Add/Edit Item
   - Click category or "Add Item"
   - Item name* (e.g., "Bath Towels")
   - Quantity*
   - Minimum threshold (optional, for low-stock alerts)
   - Location/Room (optional, e.g., "Master Bedroom")
   - Photo (optional)
   - Notes (optional)
   ↓
4. Stock Adjustment
   - Quick buttons: +1, +5, -1, -5
   - Or manual input
   - Logs history: "Restocked 10 towels on Dec 26"
   ↓
5. Low Stock Alert
   - When quantity < threshold: Show alert banner
   - "🚨 Bath Towels running low (3 left, min: 10)"
   - Quick action: "Mark as Restocked"
```

**Integration with Bookings:**
- (Future) Auto-decrement consumables after checkout
- (Future) Generate restock list for cleaners

---

#### **Flow 5: Viewing Analytics**

**Entry Points:**
- Dashboard → "View Full Analytics"
- Analytics page (sidebar)

**Flow:**
```
1. Landing on Analytics
   - Date range selector (Last 7 days, 30 days, 3 months, Custom)
   - Summary cards:
     - 📊 Total Bookings
     - 💰 Total Revenue
     - 📈 Occupancy Rate
     - ✉️ Messages Sent
   ↓
2. Revenue Chart
   - Line chart: Revenue over time
   - Breakdown by property (stacked area chart)
   ↓
3. Occupancy Heatmap
   - Calendar view showing booked/available dates
   - Filter by property
   ↓
4. Message Performance
   - Delivery rate (sent vs failed)
   - Open rate (if tracking enabled)
   - Click rate (for links in emails)
   ↓
5. Property Leaderboard (Pro+)
   - Top performing properties by revenue, occupancy, reviews
   ↓
6. AI Insights (Pro+)
   - "Your peak season is June-August based on 2024 data"
   - "Consider increasing prices for Sunset Villa on weekends (+15% potential)"
```

**Export Options:**
- Download CSV (all tiers)
- PDF report (Pro+)
- Scheduled email reports (Enterprise)

---

### Core Screens Overview:

#### **Dashboard**
The home screen shows a personalized greeting, summary cards (total properties, active bookings, revenue, messages sent), upcoming check-ins for the next 7 days, recent activity feed, and quick action buttons for common tasks like creating bookings or adding properties.

#### **Property List**
Displays all properties as cards with photos, showing key details (location, bedrooms, price, occupancy rate). Includes search and filter functionality. Clicking a card opens property details, with action buttons for editing, viewing calendar, and managing inventory.

#### **Booking Detail**
Shows comprehensive booking information split into sections: guest details (name, email, phone), property info, dates and pricing, and action buttons (mark as checked in/out, edit, message guest, cancel). Includes a timeline of automated messages sent for this booking with delivery status.

#### **Message Templates**
A form-based editor for creating/editing email templates with three main fields: template name, subject line (with variable support), and rich text body editor. Includes a live preview pane showing how the template looks with sample data. Variable insertion dropdown helps users add dynamic content like {{guest_name}} or {{property_name}}.

#### **Triggers**
Lists all automation rules with event type, timing, applied properties, and active/inactive status. Create/edit flow guides users through choosing an event (confirmed, check-in, check-out), setting timing (immediate or offset), selecting a message template, and choosing which properties it applies to.

#### **Inventory (Pro+)**
Shows property inventory organized by categories (linens, toiletries, kitchen, furniture, electronics). Each item displays quantity, minimum threshold, and location. Low-stock items are highlighted. Quick adjustment buttons (+/-) allow easy stock updates, with history log showing restock and consumption events.

#### **Analytics**
Dashboard with date range selector showing key metrics: revenue chart over time, occupancy heatmap calendar, message delivery performance, and property leaderboard. Pro tier includes AI-generated insights like peak season identification and pricing suggestions.

#### **Settings**
A dedicated page for settings which displays all the relevant settings that can be applied or changed by the user. These are but not limited to :
1. The organisation management - admin of the organisations can manage the access of each of the member in the org
2. The automated email feature, which allow the user to set the messages for each of the steps in the customer experience (booking, check in, check out)

---

## Automated Trigger System: Technical Implementation

### Overview
StayFlow's automated trigger system sends emails to guests based on booking events and scheduled times. The system consists of two execution modes: **event-based** (immediate reactions to booking status changes) and **time-based** (scheduled messages relative to check-in/checkout dates).

### Architecture Components

#### 1. Trigger Types

**Event-Based Triggers** (Immediate Execution)
- Fire synchronously when booking status changes
- Event types map to booking statuses:
  - `booking_created` → status: pending
  - `booking_confirmed` → status: confirmed
  - `booking_checked_in` → status: checked_in
  - `booking_checked_out` → status: checked_out
  - `booking_completed` → status: completed
  - `booking_cancelled` → status: cancelled
  - `booking_no_show` → status: no_show

**Time-Based Triggers** (Scheduled Execution)
- Configured with:
  - **Offset**: Number + unit (hours/days) relative to reference point
  - **Reference**: `before_checkin`, `after_checkin`, `before_checkout`, `after_checkout`
  - **Send Time**: Specific time of day (HH:MM format, e.g., "10:00")
- Examples:
  - "2 days before check-in at 10:00" → Pre-arrival instructions
  - "1 hour after check-in at 15:00" → Welcome message
  - "1 day after check-out at 09:00" → Thank you + review request

#### 2. Execution Flow

**Event-Based Execution:**
```
User creates/updates booking
  ↓
Booking status changes in database
  ↓
triggerEventBasedMessages() called (lib/services/trigger-handler.ts)
  ↓
Finds all active event triggers matching the status
  ↓
Filters by property assignments
  ↓
sendBookingMessage() for each trigger
  ↓
Email sent via Resend API
  ↓
Logged in sent_messages table
```

**Time-Based Execution:**
```
Vercel Cron (runs hourly)
  ↓
/api/cron/process-scheduled-messages endpoint
  ↓
processScheduledMessages() (lib/services/scheduled-message-processor.ts)
  ↓
For each active time_based trigger:
  - Fetch bookings within 30-day window
  - Calculate trigger time using offset + reference + send_time
  - Check if trigger time is within the past hour
  - Verify idempotency (prevent duplicates)
  ↓
sendBookingMessage() if conditions met
  ↓
Returns stats: processed, sent, failed, skipped
```

#### 3. Key Files and Their Roles

**Database Schema**
- `migrations/automated-messaging-system.sql` - Defines all tables
  - `message_triggers` - Trigger configurations
  - `trigger_property_assignments` - Property-specific triggers
  - `sent_messages` - Audit log of all sent emails
  - `message_idempotency` - Duplicate prevention

**Type Definitions**
- `lib/types/trigger.ts` - TypeScript interfaces for triggers
- `lib/types/message.ts` - Message template types

**Core Services**
- `lib/services/trigger-handler.ts` - Event-based trigger execution
- `lib/services/scheduled-message-processor.ts` - Time-based trigger execution
- `lib/services/message-sender.ts` - Unified email sending (handles both trigger types)
- `lib/services/email.ts` - Resend API integration
- `lib/services/template-parser.ts` - Variable substitution ({{guest_name}}, {{property_name}}, etc.)

**Server Actions (CRUD)**
- `lib/actions/triggers.ts` - Create, update, delete, toggle triggers
- `lib/services/triggers.ts` - Read operations (getTriggers, getTrigger, etc.)

**UI Components**
- `app/(dashboard)/messages/triggers/page.tsx` - Trigger list page
- `components/triggers/trigger-form.tsx` - Create/edit trigger form
- `components/triggers/trigger-card.tsx` - Display trigger with description
- `components/triggers/triggers-list.tsx` - List of all triggers

**Email Templates**
- `components/email/booking-email-template.tsx` - React Email template
- Professional HTML email with booking details table

**Integration Points**
- `lib/actions/bookings.ts` - Calls `triggerEventBasedMessages()` on status change
- `app/api/cron/process-scheduled-messages/route.ts` - Vercel Cron endpoint
- `vercel.json` - Cron schedule configuration (runs every hour)

#### 4. Idempotency & Duplicate Prevention

**Strategy:**
- `message_idempotency` table with unique constraint on `(booking_id, trigger_id)`
- Before sending, check if this trigger already fired for this booking
- Prevents duplicate sends even if cron runs multiple times or booking is updated repeatedly

**Implementation:**
- Event-based: Check on each status change
- Time-based: Check in `shouldFireNow()` function before sending

#### 5. Variable Substitution

**Supported Variables:**
- `{{guest_name}}` / `{guest_name}` - Guest's name
- `{{property_name}}` / `{property_name}` - Property name
- `{{check_in}}` / `{check_in}` - Check-in date (formatted)
- `{{check_out}}` / `{check_out}` - Check-out date (formatted)
- `{{price}}` / `{price}` - Booking price
- `{{nights}}` / `{nights}` - Number of nights
- `{{guests}}` / `{guests}` - Number of guests

**Implementation:**
- `lib/services/template-parser.ts` - Extracts booking data and replaces placeholders
- Supports both `{{var}}` and `{var}` syntax for flexibility

#### 6. Property Assignment

**Options:**
- **All Properties**: Trigger applies to all properties in organization
- **Specific Properties**: Trigger applies only to selected properties

**Database:**
- Empty `trigger_property_assignments` = applies to all properties
- Non-empty = applies only to specified property IDs

**Use Case:**
- Send luxury welcome message only to premium properties
- Send specific check-in instructions per property location

#### 7. Monitoring & Tracking

**sent_messages Table:**
- Logs every email sent (success or failure)
- Tracks status: 'pending', 'sent', 'failed', 'bounced'
- Stores Resend's `provider_message_id` for tracking
- Records `retry_count` and `error_message` for debugging

**Message History Page:**
- `/messages/history` - View all sent messages
- Stats cards: Total, sent, failed, pending
- Filter by booking, status, date range

**Unified Inbox:**
- `/messages` - Groups sent messages by booking (thread view)
- Shows message count and latest message per booking
- Expandable threads to see all messages for a booking

#### 8. Error Handling

**Email Send Failures:**
- Logged in `sent_messages` table with `status: 'failed'`
- Error message stored for debugging
- User can manually retry from message history

**Missing Guest Email:**
- Warning shown during booking creation
- Trigger won't fire (skipped with log entry)
- User prompted to add email and send manually

**Cron Failures:**
- Secured with `CRON_SECRET` environment variable
- Returns stats for monitoring (sent, failed, skipped counts)
- Automatic retry on next hourly run

#### 9. Environment Variables

**Required:**
- `RESEND_API_KEY` - Resend email service API key
- `CRON_SECRET` - Secures cron endpoint (Bearer token)
- Supabase credentials (from existing setup)

**Email Sender:**
- Default: `StayFlow <onboarding@resend.dev>`
- Configurable in organization email settings (planned feature)

#### 10. Trigger Execution Timeline

**Event-Based Example:**
```
User clicks "Create Booking" with status: confirmed
  ↓ (0ms)
Booking saved to database
  ↓ (50ms)
triggerEventBasedMessages() called
  ↓ (100ms)
Finds trigger: "Send welcome email on booking_confirmed"
  ↓ (150ms)
sendBookingMessage() → Resend API
  ↓ (500ms)
Email delivered to guest
  ↓ (550ms)
sent_messages record updated: status='sent'
```

**Time-Based Example:**
```
Booking: Check-in Dec 27 at 14:00
Trigger: "2 days before check-in at 10:00"
  ↓
Calculated trigger time: Dec 25 at 10:00
  ↓
Cron runs at Dec 25 at 10:15 (hourly)
  ↓
shouldFireNow() checks: Is trigger time between 09:15-10:15? YES
  ↓
Idempotency check: Already sent? NO
  ↓
sendBookingMessage() → Email sent
  ↓
Idempotency record created (prevents duplicate on next cron run)
```

### User Experience

**Creating a Trigger:**
1. Navigate to `/messages/settings` → Triggers & Templates tab
2. Click "New Trigger"
3. Choose trigger type: Event-based or Time-based
4. If event: Select event type (booking confirmed, check-in, etc.)
5. If time: Configure offset (2 days), reference (before check-in), send time (10:00)
6. Select message template (or create new)
7. Choose properties (all or specific)
8. Toggle "Active" switch
9. Save trigger

**Viewing Trigger Activity:**
1. Navigate to `/messages` (unified inbox)
2. See threads grouped by booking
3. Expand thread to view all messages sent for that booking
4. Each message shows: template name, status, sent time, recipient

**Managing Triggers:**
- Toggle active/inactive without deleting
- Edit to change properties or timing
- Delete to remove permanently
- View count of active triggers in dashboard stats

### System Benefits

1. **Idempotency Guarantee** - No duplicate emails even with cron retries
2. **Separation of Concerns** - Clear boundaries between handlers, senders, email service
3. **Property-Specific or Global** - Flexible trigger scope
4. **Comprehensive Tracking** - Full audit trail in sent_messages
5. **RLS Security** - Multi-tenant data isolation
6. **Graceful Error Handling** - Failures logged, don't block other messages
7. **Template Variable System** - Dynamic content without manual work

---

## Error States & Friendly Fixes

### Philosophy:
Errors are opportunities to help, not scold. Every error message should:
1. **Explain what happened** (friendly language)
2. **Why it happened** (if helpful)
3. **What to do next** (actionable fix)

---

### Common Error Scenarios:

#### **1. Email Failed to Send**

**Scenario:** Resend API returns error (invalid email, rate limit, API key issue)

**Error Message:**
```
❌ Oops! We couldn't send that email to john@example.com

This could be because:
• The email address might be incorrect
• Our email service is experiencing issues

What to do:
✅ Double-check the guest's email address
✅ Try sending again in a few minutes
✅ Contact support if this keeps happening

[Retry] [Edit Email Address] [Contact Support]
```

**Technical Details Logged:** (Hidden from user, visible in support dashboard)
- Resend error code and message
- Timestamp
- User ID, Organization ID
- Email content (for debugging)

---

#### **2. Booking Date Conflict**

**Scenario:** User tries to create booking when property is already booked

**Error Message:**
```
⚠️ Hold on! This property is already booked for those dates

Sunset Villa is booked from Dec 27-30 by another guest.

What to do:
✅ Choose different dates for this guest
✅ Select a different property
✅ Check the calendar for available dates

[View Calendar] [Choose Different Property]
```

**UX Enhancement:**
- Highlight conflicting dates in red on calendar
- Show suggested alternative dates (next 3 available periods)

---

#### **3. Image Upload Failed**

**Scenario:** Property photo upload fails (too large, wrong format, network error)

**Error Message:**
```
📸 That image didn't upload. Here's why:

• File size is too large (max 5MB per photo)
• Or: Connection interrupted during upload

What to do:
✅ Compress the image (try tinypng.com)
✅ Make sure you're connected to internet
✅ Try uploading again

[Try Again] [Choose Different Photo]
```

**Preventive UX:**
- Show file size before upload
- Client-side validation (image type, size)
- Progress bar during upload

---

#### **4. Payment Failed**

**Scenario:** Subscription payment fails (card declined, expired, insufficient funds)

**Error Message:**
```
💳 Payment didn't go through

Your card ending in 1234 was declined.

This usually means:
• Insufficient funds
• Card expired or blocked
• Bank security check

What to do:
✅ Try a different card
✅ Contact your bank
✅ Update payment method in Settings

[Update Payment Method] [Contact Support]
```

**Grace Period:**
- 7-day grace period before account suspension
- Daily reminders (email + in-app banner)
- Downgrade option (if over limits, offer to downgrade tier)

---

#### **5. Trigger Not Firing**

**Scenario:** User expects automation to run but it didn't

**Error Message (in Activity Log):**
```
⚠️ "Welcome Email" didn't send automatically

Why?
• Guest email was missing from booking
• Or: Trigger was inactive when booking created

What to do:
✅ Add guest email to booking
✅ Send message manually: [Send Now]
✅ Check trigger is active: [View Trigger]

[Add Email] [Send Manually]
```

**Proactive Prevention:**
- When creating booking without email: Warning banner "Automated emails won't send without guest email"
- Trigger status visible on trigger list (active/inactive badges)

---

#### **6. Tier Limit Reached**

**Scenario:** User hits property limit, message limit, or team member limit

**Error Message:**
```
🎯 You've reached your plan limit

Your Starter plan includes 5 properties. You currently have 5 active.

What to do:
✅ Upgrade to Pro (20 properties): RM 1,000/month
✅ Or add properties individually: +RM 59/property

[Upgrade to Pro] [Add Individual Property]
```

**Upgrade Flow:**
- One-click upgrade (no re-entering card)
- Prorated billing (credit for remaining days)
- Instant limit increase (no waiting)

---

#### **7. Network/Connection Error**

**Scenario:** User loses internet, request times out

**Error Message:**
```
🌐 Connection issue

We couldn't reach the server. Check your internet and try again.

What to do:
✅ Make sure you're connected to internet
✅ Refresh the page
✅ Try again in a moment

[Retry] [Refresh Page]
```

**Auto-Retry:**
- Automatic retry after 3 seconds (background)
- Exponential backoff (3s, 9s, 27s)
- Show "Retrying..." indicator

---

#### **8. Form Validation Errors**

**Scenario:** User submits form with missing/invalid fields

**Error Message (Inline, Per Field):**
```
Email address
[john@example] ❌ Please enter a valid email address

Check-in date
[Not selected] ❌ Check-in date is required

Price
[-100] ❌ Price must be a positive number
```

**UX Principles:**
- Inline validation (on blur, not just on submit)
- Friendly language ("Please enter..." not "Invalid input")
- Show fix, not just problem

---

#### **9. WhatsApp Rate Limit (Pro+ Feature)**

**Scenario:** User hits WhatsApp API rate limit (too many messages in short time)

**Error Message:**
```
⏸️ WhatsApp rate limit reached

You've sent 50 messages in the last hour. WhatsApp limits messages to prevent spam.

What to do:
✅ Wait 30 minutes and messages will resume automatically
✅ Or send via email instead: [Send as Email]

Scheduled messages will send when rate limit resets.

[Got It]
```

**Transparency:**
- Show current usage: "45/50 messages this hour"
- Reset time: "Resets in 15 minutes"

---

#### **10. Data Export Failed**

**Scenario:** User tries to export analytics/bookings, export times out or fails

**Error Message:**
```
📊 Export taking longer than expected

Your data export is processing. We'll email it to you when ready (usually <5 min).

What to do:
✅ Check your email in a few minutes
✅ Or download now if it's ready: [Check Status]

[Close] [Check Status]
```

**Background Processing:**
- Don't block user (async job)
- Email download link when ready
- 24-hour expiry on download link

---

## Accessibility

### Commitment:
StayFlow aims for **WCAG 2.1 AA compliance** at launch. Accessibility is not a "nice-to-have" but a core requirement.

---

### Key Accessibility Features:

#### **1. Keyboard Navigation**
- All interactive elements accessible via Tab/Shift+Tab
- Skip to main content link (bypass navigation)
- Focus indicators visible and high-contrast
- Logical tab order (top-to-bottom, left-to-right)

**Keyboard Shortcuts (Optional):**
- `Ctrl+K` or `Cmd+K`: Quick command palette
- `N`: New booking (when on bookings page)
- `?`: Show keyboard shortcuts help

---

#### **2. Screen Reader Support**
- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<aside>`)
- ARIA labels where needed:
  - `aria-label` on icon-only buttons
  - `aria-describedby` for form hints
  - `aria-live` regions for dynamic content (success messages, errors)
- Alt text on all images (property photos, user avatars)

**Example:**
```html
<button aria-label="Delete booking #abc123">
  <TrashIcon aria-hidden="true" />
</button>

<div role="alert" aria-live="polite">
  Booking created successfully
</div>
```

---

#### **3. Color Contrast**
- Text: Minimum 4.5:1 contrast ratio (WCAG AA)
- UI elements: Minimum 3:1 contrast ratio
- Dark theme optimized for readability
- Never rely on color alone (use icons + text for status)

**Status Indicators:**
```
✅ Confirmed (green + checkmark)
⏳ Pending (yellow + clock)
❌ Cancelled (red + X)
```

---

#### **4. Text Scaling**
- Support browser zoom up to 200% without breaking layout
- Use relative units (rem, em) not pixels for font sizes
- Min touch target size: 44x44px (iOS guidelines)

---

#### **5. Forms**
- All inputs have visible labels (not just placeholders)
- Required fields marked with `*` and aria-required="true"
- Error messages linked to inputs (aria-describedby)
- Autocomplete attributes where appropriate

**Example:**
```html
<label for="guest-email">
  Guest Email *
</label>
<input
  id="guest-email"
  type="email"
  required
  aria-required="true"
  aria-describedby="email-error"
  autocomplete="email"
/>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>
```

---

#### **6. Dynamic Content**
- Loading states announced to screen readers
- Success/error messages in aria-live regions
- Modals trap focus (can't tab outside)
- Modals closable via Escape key

---

#### **7. Language**
- `lang="en"` attribute on HTML element
- Support for right-to-left languages (future: Arabic, Hebrew)
- Simple, clear language (avoid jargon)

---

### Testing Plan:
- Manual keyboard-only navigation testing (every release)
- NVDA/JAWS screen reader testing (quarterly)
- Lighthouse accessibility audit (automated in CI/CD, must score >90)
- Color contrast checker (automated via axe DevTools)

---

## Success Metrics

### 6-Month Targets (Post-Launch):

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Paying Customers** | 50 | Stripe active subscriptions |
| **MRR (Monthly Recurring Revenue)** | RM 50,000 | Stripe MRR |
| **Customer Activation Rate** | 70% | Users who activate ≥1 trigger within 7 days |
| **Average Properties/Customer** | 12 | Mean properties per paying org |
| **Churn Rate** | <5% | Monthly churn (cancellations / active customers) |
| **NPS (Net Promoter Score)** | >50 | Quarterly survey |

---

### 12-Month Targets:

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Paying Customers** | 150 | Stripe active subscriptions |
| **MRR** | RM 150,000 | Stripe MRR |
| **Customer LTV** | RM 15,000 | Average customer lifetime value |
| **Support Ticket Response Time** | <2 hours | Median first response time |
| **Feature Adoption (WhatsApp)** | 60% | % of Pro+ customers using WhatsApp |
| **Direct Booking Sites Sold** | 30 | Custom sites delivered by amsoftware |

---

### 18-Month Targets:

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Paying Customers** | 300 | Stripe active subscriptions |
| **MRR** | RM 300,000 | Stripe MRR |
| **Profitability** | Break-even | Revenue ≥ Costs |
| **Enterprise Customers** | 10 | Customers on Enterprise tier (50+ properties) |
| **Properties Managed on Platform** | 3,000+ | Total properties across all orgs |
| **Team Size** | 5-7 | Founders + support + dev + sales |

---

### Leading Indicators (Track Weekly):

**Product Health:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Session length (target: >5 min)
- Feature usage rates (messages sent, triggers activated, bookings created)

**Growth:**
- Waitlist signups (pre-launch)
- Trial-to-paid conversion (if offering trials)
- Referral rate (% of customers who refer others)
- Inbound demo requests

**Retention:**
- D7 retention (% still active after 7 days)
- D30 retention
- Feature stickiness (DAU/MAU ratio)

**Support Quality:**
- Time to first response
- Time to resolution
- CSAT (Customer Satisfaction Score) per ticket

---

### Definition of Success:

**6-month success:**
50 paying customers, RM 50k MRR, <5% churn, positive customer feedback

**12-month success:**
150 customers, RM 150k MRR, sustainable growth trajectory, proven product-market fit

**18-month success:**
300 customers, RM 300k MRR, profitable, market leader in SEA for 10-50 property segment

---

## Security & Privacy

### Compliance & Standards:

**Primary Compliance:**
- **PDPA (Personal Data Protection Act 2010) - Malaysia**: Primary regulation for Malaysian users
- **Standard SaaS Security Practices**: Industry-standard encryption, authentication, authorization

**Future Compliance (if expanding):**
- GDPR (EU): If serving European customers
- CCPA (California): If significant US customer base

---

### Data Protection Principles:

#### **1. Data Minimization**
- Collect only necessary data (guest name, email, phone, booking details)
- No sensitive data collection (religion, political views, health data)
- Optional fields clearly marked

#### **2. Purpose Limitation**
- Data used only for stated purposes (booking management, guest communication)
- No selling/sharing data with third parties (except required service providers: Resend, WhatsApp API)
- Clear privacy policy explaining data usage

#### **3. Data Retention**
- Active bookings: Retained indefinitely while customer is subscribed
- Cancelled/completed bookings: Retained for 7 years (tax/legal compliance)
- Deleted accounts: Data anonymized or deleted within 30 days
- Right to deletion: Users can request data deletion (GDPR "right to be forgotten")

---

### Technical Security Measures:

#### **1. Authentication**
- Password requirements: Min 8 characters, complexity enforced
- Bcrypt password hashing (cost factor 12)
- OAuth support: Google, Microsoft (reduce password fatigue)
- Session management: JWT tokens, 7-day expiry, refresh tokens
- "Remember me" option: 30-day session
- Password reset: Email-based, token expires in 1 hour

**Future Enhancements:**
- Two-Factor Authentication (2FA) via SMS/Authenticator app (Enterprise tier)
- SSO (Single Sign-On) for Enterprise customers

---

#### **2. Authorization (Row-Level Security)**
- Supabase RLS policies enforce data isolation
- Users only see data for their organization
- Role-based access:
  - **Owner**: Full access (billing, team, delete org)
  - **Admin**: Manage properties, bookings, messages (no billing)
  - **Member**: View/edit bookings and messages (no delete)
  - **Viewer**: Read-only access (future tier)

**RLS Policy Example:**
```sql
-- Users can only read bookings from their org
CREATE POLICY "Users can view own org bookings"
ON bookings FOR SELECT
USING (organization_id IN (
  SELECT organization_id FROM organization_members
  WHERE user_id = auth.uid()
));
```

---

#### **3. Data Encryption**

**At Rest:**
- Database: Supabase PostgreSQL with encryption at rest (AES-256)
- File storage: Encrypted (property photos, user avatars)
- Backup encryption: Automated daily backups, encrypted

**In Transit:**
- HTTPS/TLS 1.3 for all connections
- No plain HTTP allowed (automatic redirect to HTTPS)
- HSTS (HTTP Strict Transport Security) headers
- API keys encrypted in environment variables

---

#### **4. API Security**

**Rate Limiting:**
- Per user: 100 requests/minute (authenticated)
- Per IP: 20 requests/minute (unauthenticated, e.g., login page)
- Prevents brute force attacks, DDoS

**Input Validation:**
- All user input validated server-side (never trust client)
- SQL injection prevention (Supabase parameterized queries)
- XSS prevention (React auto-escapes, CSP headers)
- CSRF tokens for state-changing operations

**API Keys:**
- Resend API key: Stored in environment variables, never in code
- WhatsApp API credentials: Encrypted in database
- Rotation policy: Quarterly rotation reminder

---

#### **5. Third-Party Integrations**

**Data Processors (PDPA compliant):**
- **Supabase**: Database, authentication (ISO 27001 certified, SOC 2 Type II)
- **Vercel**: Hosting (SOC 2 Type II, GDPR compliant)
- **Resend**: Email delivery (GDPR compliant, data residency options)
- **Stripe**: Payment processing (PCI DSS Level 1)

**Data Processing Agreements (DPA):**
- DPAs signed with all third-party processors
- Subprocessor list published in privacy policy
- Users notified of new subprocessors (30-day notice)

---

### Third-Party Integration Architecture

This section documents how StayFlow integrates with external services, what code needs to change if switching providers, and what should remain unchanged.

---

#### **Email Service Integration (Resend)**

StayFlow uses Resend for transactional email delivery. The integration is abstracted through a service layer to make provider switching easier.

**Current Provider:** Resend (resend.com)

**Integration Layer:**

```
Application Code (Triggers, Messages, etc.)
        ↓
lib/services/email.ts (ABSTRACTION LAYER - Provider-specific)
        ↓
Resend API (External Service)
```

**Files That Use Email Service:**

1. **Core Email Service (CHANGE THIS):**
   - `lib/services/email.ts` - Main integration point
     - Lines 1-5: Import Resend SDK and initialize client
     - Lines 26-94: `sendEmail()` function - Resend-specific API calls
     - Line 65: `resend.emails.send()` - Resend SDK method
     - Lines 101-102: `isEmailConfigured()` - Checks RESEND_API_KEY

2. **Test Email Routes (CHANGE THIS):**
   - `app/api/send/route.ts` - Test email endpoint
     - Lines 2, 5: Direct Resend import and initialization
     - Lines 16-21: Resend-specific API call
   - `app/api/send-booking-email/route.ts` - Booking email test endpoint
     - Lines 2, 5: Direct Resend import and initialization
     - Similar Resend API call structure

3. **Application Services (KEEP UNCHANGED):**
   - `lib/services/message-sender.ts` - Uses abstraction layer
     - Line 2: Imports `sendEmail()` from `lib/services/email.ts`
     - Lines 139-152: Calls `sendEmail()` with standard params
     - **No changes needed** - already abstracted
   - `lib/services/trigger-handler.ts` - Trigger execution
     - Uses `sendBookingMessage()` from message-sender
     - **No changes needed** - fully abstracted
   - `lib/services/scheduled-message-processor.ts` - Cron processor
     - Uses `sendBookingMessage()` from message-sender
     - **No changes needed** - fully abstracted

4. **UI Components (KEEP UNCHANGED):**
   - `components/email/booking-email-template.tsx` - React Email template
     - **No changes needed** - provider-agnostic JSX
   - `components/email/email-template.tsx` - Generic email template
     - **No changes needed** - provider-agnostic JSX

5. **Settings UI (UPDATE INSTRUCTIONS ONLY):**
   - `components/settings/test-email-tab.tsx`
     - Line 185: Shows `RESEND_API_KEY` in setup instructions
     - **Update instructions** to reflect new provider's API key name

**Environment Variables:**
- `RESEND_API_KEY` - Resend API key (required)
- `RESEND_FROM_EMAIL` - Default sender email (optional, falls back to onboarding@resend.dev)

**Package Dependencies:**
```json
{
  "resend": "^6.5.2"
}
```

---

#### **How to Switch Email Providers**

To replace Resend with another email service (e.g., SendGrid, Mailgun, AWS SES):

**Step 1: Update Core Service (`lib/services/email.ts`)**

Replace the entire file with your new provider's implementation, maintaining the same interface:

```typescript
// Example: Switching to SendGrid
import sgMail from '@sendgrid/mail';
import { ReactElement } from 'react';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export interface SendEmailParams {
  to: string;
  subject: string;
  html?: string;
  react?: ReactElement;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  react,
  from,
}: SendEmailParams): Promise<SendEmailResult> {
  try {
    // Convert React to HTML if needed
    const htmlContent = react ? renderReactToHtml(react) : html;

    const msg = {
      to,
      from: from || 'StayFlow <noreply@yourdomain.com>',
      subject,
      html: htmlContent,
    };

    const [response] = await sgMail.send(msg);

    return {
      success: true,
      messageId: response.headers['x-message-id'],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function isEmailConfigured(): boolean {
  return !!process.env.SENDGRID_API_KEY;
}
```

**Step 2: Update Test Routes**

Update these files to use the new provider (or better: refactor to use `lib/services/email.ts`):
- `app/api/send/route.ts`
- `app/api/send-booking-email/route.ts`

**Step 3: Update Package Dependencies**

```bash
npm uninstall resend
npm install @sendgrid/mail  # or your new provider's SDK
```

**Step 4: Update Environment Variables**

Replace in `.env.local`:
```
# Old
RESEND_API_KEY=re_xyz123

# New
SENDGRID_API_KEY=SG.xyz123
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

**Step 5: Update UI Instructions**

Update `components/settings/test-email-tab.tsx` line 185 to show correct API key name.

**Step 6: Update Database Records**

Update `sent_messages.provider` field default value:
```sql
ALTER TABLE sent_messages ALTER COLUMN provider SET DEFAULT 'sendgrid';
```

**What NOT to Change:**

✅ Keep unchanged:
- `lib/services/message-sender.ts` - Already abstracted
- `lib/services/trigger-handler.ts` - Uses abstraction
- `lib/services/scheduled-message-processor.ts` - Uses abstraction
- `components/email/booking-email-template.tsx` - Provider-agnostic
- All trigger UI components
- All message template components

❌ Only change:
- `lib/services/email.ts` - Provider-specific integration
- `app/api/send/route.ts` - Test endpoint (or refactor to use service)
- `app/api/send-booking-email/route.ts` - Test endpoint (or refactor to use service)
- Environment variable names
- Package dependencies
- Setup documentation

---

#### **Database Integration (Supabase)**

StayFlow uses Supabase for PostgreSQL database and authentication.

**Provider:** Supabase (supabase.com)

**Integration Points:**
- Database client: `lib/supabase/client.ts`
- Admin client: `lib/supabase/admin.ts`
- Server client: `lib/supabase/server.ts`

**Abstraction Level:** Medium
- Uses Supabase-specific RLS (Row-Level Security) policies
- Uses Supabase Auth for user management
- SQL migrations are portable to any PostgreSQL database

**Switching Difficulty:** High
- Would require rewriting auth layer
- RLS policies would need translation
- Could migrate to raw PostgreSQL + separate auth service

---

#### **Hosting (Vercel)**

**Provider:** Vercel (vercel.com)

**Integration Points:**
- `vercel.json` - Cron configuration for scheduled triggers
- Serverless functions (Next.js API routes)
- Edge functions (middleware)

**Switching Difficulty:** Low-Medium
- Next.js app is portable to other hosts (AWS Amplify, Railway, Render)
- Would need to replace Vercel Cron with alternative (AWS EventBridge, Render Cron, etc.)
- File: `app/api/cron/process-scheduled-messages/route.ts` uses `CRON_SECRET` for security

---

#### **Payment Processing (Stripe)**

**Provider:** Stripe (stripe.com)

**Current Status:** Planned (not yet implemented)

**Future Integration Points:**
- Subscription management
- Payment processing for direct bookings
- Webhook handling for payment events

**Abstraction Strategy:**
- Create `lib/services/payment.ts` abstraction layer
- Keep Stripe-specific code isolated
- Design interfaces to support alternative providers (iPay88, Molpay for SEA markets)

---

#### **WhatsApp Integration (Future)**

**Planned Provider:** WhatsApp Business API

**Integration Strategy:**
- Abstract through `lib/services/whatsapp.ts`
- Support multiple providers (Twilio, MessageBird, official Meta API)
- Design for easy provider switching

---

#### **Integration Best Practices**

**Design Principles:**
1. **Abstraction Layer Pattern**: Always create service layer (`lib/services/`) that abstracts provider-specific code
2. **Consistent Interfaces**: Maintain same function signatures even when changing providers
3. **Environment-Based Config**: All provider credentials in environment variables
4. **Graceful Degradation**: System should handle provider outages gracefully
5. **Provider Isolation**: Keep provider SDK imports limited to service layer files

**Service Layer Structure:**
```
lib/services/
  ├── email.ts          ← Provider-specific (Resend)
  ├── payment.ts        ← Provider-specific (Stripe) - Future
  ├── whatsapp.ts       ← Provider-specific - Future
  │
  ├── message-sender.ts ← Provider-agnostic (uses email.ts)
  ├── trigger-handler.ts ← Provider-agnostic
  └── template-parser.ts ← Provider-agnostic
```

**Testing Provider Changes:**
1. Create staging environment with new provider
2. Test automated triggers end-to-end
3. Verify email delivery and tracking
4. Check error handling and retry logic
5. Monitor for 24-48 hours before production switch

**Rollback Strategy:**
- Keep both provider SDKs installed during transition
- Use feature flag or environment variable to switch providers
- Example: `EMAIL_PROVIDER=resend` or `EMAIL_PROVIDER=sendgrid`
- Allows instant rollback if issues arise

---

#### **6. Audit Logging**

**What We Log:**
- User login/logout (timestamp, IP, user agent)
- Password changes
- Team member invitations/removals
- Booking creation/deletion
- Trigger activation/deactivation
- Billing changes (plan upgrades, payment method updates)

**What We Don't Log:**
- Guest personal data access (too granular, privacy risk)
- Message content (stored separately, not in audit log)

**Retention:**
- Audit logs: 1 year
- Security logs (failed logins): 90 days

---

### Privacy Features for Users:

#### **1. Guest Data Management**
- **Export**: Users can export all guest data (CSV/JSON)
- **Delete**: Bulk delete old bookings (GDPR compliance)
- **Anonymize**: "Anonymize guest data" for completed bookings (replace names/emails with "Guest #123")

#### **2. Transparency**
- **Privacy Dashboard**: Show users what data is stored, where, and why
- **Data map**: Visual diagram of data flow (Guest → StayFlow → Resend/WhatsApp)

#### **3. Guest Rights**
- Guests can request their data (via property manager)
- Guests can opt-out of marketing emails (unsubscribe link in every email)
- Guests cannot directly access StayFlow (B2B product, not B2C)

---

### Incident Response Plan:

**Data Breach Protocol:**
1. **Detection**: Automated monitoring (failed login spikes, unusual API activity)
2. **Containment**: Immediately revoke compromised credentials, block IPs
3. **Assessment**: Determine scope (which users/data affected)
4. **Notification**:
   - Affected users: Within 72 hours (PDPA requirement)
   - Authorities: Report to PDPA Commissioner (if >1000 users affected)
5. **Remediation**: Patch vulnerability, force password resets
6. **Post-Mortem**: Document incident, publish transparency report

**Responsible Disclosure:**
- Security email: security@stayflow.com
- Bug bounty program (future): Reward researchers who report vulnerabilities
- 90-day disclosure timeline (private report → fix → public disclosure)

---

### Security Roadmap:

**SLC Launch (Must Have):**
- ✅ HTTPS/TLS encryption
- ✅ RLS policies (data isolation)
- ✅ Password hashing
- ✅ Rate limiting
- ✅ Input validation
- ✅ Audit logging

**6 Months Post-Launch:**
- 🔒 Two-Factor Authentication (2FA)
- 🔒 Security headers (CSP, X-Frame-Options, etc.)
- 🔒 Penetration testing (third-party audit)

**12 Months Post-Launch:**
- 🔒 SOC 2 Type I certification (if targeting enterprise)
- 🔒 Bug bounty program
- 🔒 Advanced threat detection (SIEM integration)

---

## Core Data Model

### Database: Supabase (PostgreSQL)

**Schema Version:** 1.0
**Last Updated:** December 26, 2024

---

### Entity Relationship Diagram (Simplified):

```
organizations
    ↓ (1:N)
organization_members ← users (Supabase Auth)
    ↓ (N:1)
properties
    ↓ (1:N)
bookings
    ↓ (1:N)
sent_messages ← messages (templates)
                    ↓ (1:N)
                triggers
```

---

### Core Tables:

---

#### **Table: `users`**
**Purpose:** User accounts (managed by Supabase Auth)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Supabase Auth user ID |
| `email` | TEXT | UNIQUE, NOT NULL | User email (from Auth) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last profile update |

**Notes:**
- Managed by Supabase Auth (not directly editable)
- Additional profile data in `organization_members`

---

#### **Table: `organizations`**
**Purpose:** Customer accounts (each paying customer is an org)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Organization ID |
| `name` | TEXT | NOT NULL | Organization name (e.g., "Sarah's Properties") |
| `slug` | TEXT | UNIQUE | URL-friendly identifier |
| `tier` | ENUM | NOT NULL | 'starter', 'pro', 'enterprise' |
| `stripe_customer_id` | TEXT | UNIQUE | Stripe customer ID |
| `stripe_subscription_id` | TEXT | | Stripe subscription ID |
| `subscription_status` | ENUM | NOT NULL | 'active', 'past_due', 'cancelled', 'trialing' |
| `currency` | TEXT | DEFAULT 'MYR' | MYR, SGD, THB, IDR |
| `timezone` | TEXT | DEFAULT 'Asia/Kuala_Lumpur' | Org timezone |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Org creation date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- `stripe_customer_id` (for webhook lookups)
- `slug` (for vanity URLs)

**RLS Policy:**
- Users can only view/edit orgs they belong to

---

#### **Table: `organization_members`**
**Purpose:** Many-to-many relationship between users and organizations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Membership ID |
| `organization_id` | UUID | FK → organizations | Org this user belongs to |
| `user_id` | UUID | FK → users | User account |
| `role` | ENUM | NOT NULL | 'owner', 'admin', 'member' |
| `invited_by` | UUID | FK → users | Who invited this user |
| `joined_at` | TIMESTAMP | DEFAULT NOW() | When user joined |

**Unique Constraint:**
- (`organization_id`, `user_id`) - Can't join same org twice

**RLS Policy:**
- Users see memberships for orgs they belong to
- Only 'owner' can invite/remove members

---

#### **Table: `properties`**
**Purpose:** Vacation rental properties managed in platform

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Property ID |
| `organization_id` | UUID | FK → organizations, NOT NULL | Owner org |
| `name` | TEXT | NOT NULL | Property name (e.g., "Sunset Villa") |
| `address` | TEXT | | Full address |
| `city` | TEXT | | City |
| `state` | TEXT | | State/province |
| `country` | TEXT | DEFAULT 'Malaysia' | Country |
| `bedrooms` | INT | | Number of bedrooms |
| `bathrooms` | INT | | Number of bathrooms |
| `max_guests` | INT | | Maximum guests allowed |
| `price_per_night` | DECIMAL(10,2) | | Default nightly rate |
| `currency` | TEXT | DEFAULT 'MYR' | Pricing currency |
| `description` | TEXT | | Property description (rich text) |
| `amenities` | JSONB | | Array of amenities (e.g., ["WiFi", "Pool", "Parking"]) |
| `photos` | JSONB | | Array of photo URLs |
| `status` | ENUM | DEFAULT 'active' | 'active', 'inactive', 'archived' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Property creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- `organization_id` (frequent joins)
- `status` (filter active properties)

**RLS Policy:**
- Users see properties belonging to their org

---

#### **Table: `bookings`**
**Purpose:** Guest reservations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Booking ID |
| `organization_id` | UUID | FK → organizations, NOT NULL | Owner org |
| `property_id` | UUID | FK → properties, NOT NULL | Booked property |
| `guest_name` | TEXT | NOT NULL | Guest full name |
| `guest_email` | TEXT | | Guest email (for automation) |
| `phone` | TEXT | | Guest phone |
| `guests` | INT | NOT NULL | Number of guests |
| `check_in` | DATE | NOT NULL | Check-in date |
| `check_out` | DATE | NOT NULL | Check-out date |
| `price` | DECIMAL(10,2) | NOT NULL | Total booking price |
| `currency` | TEXT | DEFAULT 'MYR' | Booking currency |
| `status` | ENUM | DEFAULT 'pending' | 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled' |
| `notes` | TEXT | | Internal notes |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Booking creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- `property_id, check_in, check_out` (conflict detection)
- `organization_id` (org bookings)
- `status` (filter by status)

**Constraints:**
- `check_out > check_in` (check constraint)

**RLS Policy:**
- Users see bookings for their org's properties

---

#### **Table: `messages`**
**Purpose:** Reusable message templates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Template ID |
| `organization_id` | UUID | FK → organizations, NOT NULL | Owner org |
| `name` | TEXT | NOT NULL | Template name (e.g., "Welcome Email") |
| `subject` | TEXT | NOT NULL | Email subject line |
| `body` | TEXT | NOT NULL | Email body (with {{variables}}) |
| `channel` | ENUM | DEFAULT 'email' | 'email', 'whatsapp', 'sms' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Template creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last edit |

**Indexes:**
- `organization_id` (org templates)

**RLS Policy:**
- Users see templates for their org

---

#### **Table: `triggers`**
**Purpose:** Automation rules (when to send messages)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Trigger ID |
| `organization_id` | UUID | FK → organizations, NOT NULL | Owner org |
| `message_id` | UUID | FK → messages, NOT NULL | Template to send |
| `event` | ENUM | NOT NULL | 'confirmed', 'checked_in', 'checked_out', 'cancelled' |
| `timing` | ENUM | DEFAULT 'immediate' | 'immediate', 'hours_before', 'hours_after' |
| `hours_offset` | INT | DEFAULT 0 | If timing = hours_before/after, how many hours |
| `apply_to` | ENUM | DEFAULT 'all_properties' | 'all_properties', 'specific_properties' |
| `property_ids` | JSONB | | Array of property IDs (if apply_to = specific) |
| `status` | ENUM | DEFAULT 'active' | 'active', 'inactive' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Trigger creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- `organization_id, event, status` (lookup active triggers for event)

**RLS Policy:**
- Users see triggers for their org

**Example Trigger:**
```json
{
  "event": "checked_in",
  "timing": "hours_after",
  "hours_offset": 2,
  "message_id": "uuid-of-welcome-template",
  "apply_to": "all_properties",
  "status": "active"
}
// Sends "Welcome Email" 2 hours after guest checks in
```

---

#### **Table: `sent_messages`**
**Purpose:** Log of all sent messages (audit trail + idempotency)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Sent message ID |
| `organization_id` | UUID | FK → organizations, NOT NULL | Owner org |
| `booking_id` | UUID | FK → bookings, NOT NULL | Related booking |
| `trigger_id` | UUID | FK → triggers | If auto-sent, which trigger |
| `message_id` | UUID | FK → messages | Which template was used |
| `recipient_email` | TEXT | | Email sent to |
| `subject` | TEXT | | Actual subject sent |
| `body` | TEXT | | Actual body sent (after variable substitution) |
| `channel` | ENUM | NOT NULL | 'email', 'whatsapp', 'sms' |
| `status` | ENUM | DEFAULT 'sent' | 'sent', 'failed', 'bounced', 'opened' |
| `idempotency_key` | TEXT | UNIQUE | Prevents duplicate sends |
| `external_id` | TEXT | | Resend message ID |
| `sent_at` | TIMESTAMP | DEFAULT NOW() | When sent |
| `opened_at` | TIMESTAMP | | When opened (if tracking) |
| `error_message` | TEXT | | If failed, error details |

**Indexes:**
- `booking_id` (message history per booking)
- `idempotency_key` (duplicate check)
- `organization_id, sent_at` (usage tracking)

**RLS Policy:**
- Users see sent messages for their org

---

#### **Table: `inventory_items`** (Pro+)
**Purpose:** Track items in each property

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Item ID |
| `organization_id` | UUID | FK → organizations, NOT NULL | Owner org |
| `property_id` | UUID | FK → properties, NOT NULL | Property this item belongs to |
| `name` | TEXT | NOT NULL | Item name (e.g., "Bath Towels") |
| `category` | ENUM | NOT NULL | 'linens', 'toiletries', 'kitchen', 'furniture', 'electronics', 'other' |
| `quantity` | INT | NOT NULL | Current quantity |
| `min_threshold` | INT | DEFAULT 0 | Low-stock alert threshold |
| `location` | TEXT | | Room/area (e.g., "Master Bedroom") |
| `notes` | TEXT | | Additional notes |
| `photo_url` | TEXT | | Item photo |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Item added |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last stock update |

**Indexes:**
- `property_id` (property inventory)
- `organization_id` (all org inventory)

**RLS Policy:**
- Users see inventory for their org's properties

---

#### **Table: `inventory_logs`** (Pro+)
**Purpose:** History of inventory changes (restock, consumption)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Log ID |
| `inventory_item_id` | UUID | FK → inventory_items, NOT NULL | Which item |
| `change_type` | ENUM | NOT NULL | 'restock', 'consumed', 'adjustment' |
| `quantity_change` | INT | NOT NULL | +10 (restock), -5 (consumed) |
| `quantity_after` | INT | NOT NULL | Quantity after this change |
| `notes` | TEXT | | E.g., "Restocked after guest checkout" |
| `changed_by` | UUID | FK → users | Who made the change |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When change happened |

**Indexes:**
- `inventory_item_id, created_at` (item history)

**RLS Policy:**
- Users see logs for their org's inventory

---

### Planned Tables (Future):

#### **`direct_booking_sites`** (Add-On Feature)
**Purpose:** Track custom booking websites built by amsoftware

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Site ID |
| `organization_id` | UUID | Owner org |
| `property_id` | UUID | Property this site is for (or NULL for multi-property site) |
| `domain` | TEXT | Custom domain (e.g., "sunsetvilla.com") |
| `status` | ENUM | 'pending', 'live', 'paused' |
| `setup_fee_paid` | BOOLEAN | Has RM 500 setup fee been paid |
| `monthly_fee` | DECIMAL(10,2) | RM 200/month |
| `created_at` | TIMESTAMP | Site order date |

---

#### **`whatsapp_conversations`** (WhatsApp Feature)
**Purpose:** Track WhatsApp message threads with guests

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Conversation ID |
| `organization_id` | UUID | Owner org |
| `booking_id` | UUID | Related booking |
| `guest_phone` | TEXT | WhatsApp number |
| `last_message_at` | TIMESTAMP | Last activity |
| `status` | ENUM | 'active', 'archived' |

---

#### **`whatsapp_messages`** (WhatsApp Feature)
**Purpose:** Individual WhatsApp messages

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Message ID |
| `conversation_id` | UUID | Parent conversation |
| `direction` | ENUM | 'inbound', 'outbound' |
| `content` | TEXT | Message text |
| `status` | ENUM | 'sent', 'delivered', 'read', 'failed' |
| `sent_at` | TIMESTAMP | Send time |

---

#### **`ota_integrations`** (Future Roadmap)
**Purpose:** Sync with Airbnb, Agoda, Traveloka APIs

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Integration ID |
| `organization_id` | UUID | Owner org |
| `platform` | ENUM | 'airbnb', 'booking_com', 'agoda', 'traveloka' |
| `api_key` | TEXT | Encrypted API credentials |
| `sync_status` | ENUM | 'active', 'error', 'paused' |
| `last_sync_at` | TIMESTAMP | Last successful sync |

---

### Database Migrations Strategy:

**Tool:** Supabase Migrations (SQL-based)

**Process:**
1. Create migration file: `supabase/migrations/20241226_add_inventory.sql`
2. Test in local Supabase instance
3. Apply to staging environment
4. Apply to production (with rollback plan)

**Version Control:**
- All migrations in Git
- No direct production schema changes (always via migration)

**Rollback Plan:**
- Each migration has a `down` script
- Backup database before major migrations

---

This PRD is a living document. Update as features evolve, user feedback comes in, and the market changes.

**Next Review Date:** March 2025 (3 months post-launch)
