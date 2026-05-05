# DukanDost Pro — Complete Project Report

> **Developed by:** Maajanki Web Tech Digital Agency  
> **GitHub:** [Ashishkrji/DukanDost-Pro-Website-Mobile-App](https://github.com/Ashishkrji/DukanDost-Pro-Website-Mobile-App)  
> **Report Date:** May 2026  
> **Version:** 1.0 (Production-Ready)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Proposed Solution](#3-proposed-solution)
4. [Product Features](#4-product-features)
5. [Technology Stack & Architecture](#5-technology-stack--architecture)
6. [System Design & Database Schema](#6-system-design--database-schema)
7. [API Architecture](#7-api-architecture)
8. [Security & Compliance](#8-security--compliance)
9. [Market Analysis](#9-market-analysis)
10. [Business Model & Monetization](#10-business-model--monetization)
11. [Investor Pitch Summary](#11-investor-pitch-summary)
12. [Project Timeline & Milestones](#12-project-timeline--milestones)
13. [Team & Roles](#13-team--roles)
14. [Conclusion & Future Scope](#14-conclusion--future-scope)
15. [References](#15-references)

---

## 1. Executive Summary

**DukanDost Pro** is a premium, full-stack **AI-powered Business Operating System (BOS)** designed specifically for Indian retail merchants, shopkeepers, and small-to-medium businesses (SMBs). It is a unified digital platform that replaces fragmented legacy tools like OkCredit, Khatabook, and myBillBook with a single, intelligent workspace.

The platform combines:
- **Digital Khata (Ledger)** for credit/udhaar tracking
- **GST-Compliant Smart Invoicing** with automatic inventory sync
- **AI Business Assistant** capable of executing database operations via natural language
- **Automated WhatsApp Marketing & Reminders**
- **Staff, Attendance & Vendor Management**
- **Financing Visibility** with credit scoring

DukanDost Pro targets India's **63+ million registered SMBs** who are underserved by existing digital tools. The platform is built using modern full-stack technologies (React 19, Node.js, MongoDB) with enterprise-grade security (AES-256, JWT, RBAC, DPDP Act 2023 compliant).

---

## 2. Problem Statement

### 2.1 The Fragmented Tools Problem

Indian retail merchants today rely on **4–7 disconnected apps** to manage their business:

| Task | Current Tool Used |
|------|------------------|
| Credit/Udhaar tracking | OkCredit / Khatabook |
| Billing & GST invoices | myBillBook / Vyapar |
| Inventory management | Manual registers / Excel |
| Staff attendance | WhatsApp groups |
| Customer reminders | Manual calls |
| Marketing campaigns | Not done at all |

This fragmentation leads to:
- **Data inconsistency** — inventory not synced with sales
- **Lost revenue** — no automated udhaar recovery
- **Wasted time** — manually switching between 5+ apps
- **No business insights** — zero analytics or forecasting

### 2.2 Key Pain Points

1. **Udhaar Recovery Crisis** — ₹15,000–₹50,000 average outstanding credit per small shop with no system for recovery.
2. **GST Compliance Burden** — Filing returns manually causes errors and penalties.
3. **Inventory Shrinkage** — No real-time stock tracking leads to overstocking or stockouts.
4. **Digital Illiteracy Barrier** — Existing solutions are too complex for Tier 2/3 merchants.
5. **No Credit Access** — Banks cannot assess creditworthiness of informal traders without transaction data.

---

## 3. Proposed Solution

### 3.1 DukanDost Pro — One App, Everything

DukanDost Pro solves all the above problems through a **single unified platform** with:

```
┌─────────────────────────────────────────────────────────────┐
│                    DukanDost Pro BOS                        │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Digital     │  GST Smart   │  AI Business │  WhatsApp      │
│  Khata       │  Invoicing   │  Assistant   │  Marketing     │
├──────────────┼──────────────┼──────────────┼────────────────┤
│  Inventory   │  Staff &     │  Analytics & │  Financing     │
│  Management  │  Attendance  │  Reports     │  Visibility    │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

### 3.2 Core Innovation — Agentic AI Layer

Unlike competitors, DukanDost Pro features a **Tool-Calling AI Agent** (powered by Llama 3 / Gemini Pro via OpenRouter) that does not just answer questions — it **executes real database operations** via natural language commands:

> *"Add customer Rahul with ₹500 udhaar"* → AI creates customer record in DB  
> *"Add 50 milk packets to stock"* → AI updates inventory in real-time  
> *"Show me this week's sales report"* → AI generates and displays analytics  

---

## 4. Product Features

### 4.1 Core Modules

#### 🏦 Digital Khata (Credit Ledger)
- Add customers with phone number & initial balance
- Record credit (udhaar) and payment transactions
- Real-time outstanding balance per customer
- Ledger history with timestamps
- Customer credit grading (A/B/C/D)

#### 🧾 GST Smart Invoicing
- GST-compliant invoice generation (PDF)
- Atomic inventory deduction on invoice creation
- WhatsApp sharing of invoices directly from dashboard
- Multiple tax slabs (0%, 5%, 12%, 18%, 28%)
- Invoice history, search, and download

#### 📦 Inventory Management
- Product catalog with categories, HSN codes, MRP, and selling price
- Real-time stock level tracking
- Low-stock alerts and reorder suggestions
- Vendor management for purchase orders
- Barcode-ready product entries

#### 🤖 AI Business Assistant
- Natural language interface (Hindi + English)
- Tool-calling capability (actual DB operations)
- Business Health Score (0–100)
- Recovery risk alerts for overdue customers
- Predictive cashflow recommendations
- Smart tips for revenue growth

#### 👥 Staff & Attendance
- Staff profile management (role, salary, contact)
- Daily attendance marking (Present/Absent/Half-day)
- Performance metrics and salary calculation
- Shift management

#### 📢 WhatsApp Marketing Campaigns
- Audience segmentation (all customers, overdue, top buyers)
- Promotional broadcast messages
- Automated daily payment reminders (11:00 AM)
- Campaign history and delivery tracking

#### 📊 Analytics & Reports
- Daily/Weekly/Monthly sales trends
- Top products by revenue
- Customer lifetime value (CLV)
- Cash flow projections
- Exportable reports (PDF/Excel)

#### 💳 Subscriptions & Billing
- Free tier with basic features
- Business Plan with AI + WhatsApp campaigns
- In-app subscription management

#### 📉 Expense Tracking (New)
- Record daily shop outgoings (Rent, Tea, Electricity, etc.)
- Categorize expenses and track payment methods
- Dashboard summary cards for total outgoings

#### 🔄 Sales & Purchase Returns (Credit/Debit Notes)
- Issue Credit Notes for sales returns with auto-inventory restock
- Issue Debit Notes for purchase returns to vendors
- Automatic balance adjustments for customers and vendors

#### 📊 Advanced Reports & Compliance
- GSTR-1 and GSTR-3B compliant reports
- Tally ERP 9 / Prime XML export
- Secure CA Portal link for read-only accountant access

#### 🏦 Fintech Integration
- Built-in NBFC loan eligibility check
- Instant loan application flow via partner API simulation
- Credit scoring based on transaction history

#### 📱 PWA & Offline Support
- Mobile-installable PWA with offline indicator
- Basic offline billing support (simulated)
- Real-time connectivity monitoring

### 4.2 Admin Panel (Super Admin)
- Platform-wide user management
- Subscription oversight
- Support ticket management
- Revenue analytics
- Testimonial & content management
- Platform settings (payments, notifications)
- Audit logs for all critical operations

---

## 5. Technology Stack & Architecture

### 5.1 Frontend

| Component | Technology |
|-----------|-----------|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | TailwindCSS 4.x |
| Animations | Framer Motion |
| State Management | Zustand (Atomic) |
| Data Fetching | React Query + Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Testing | Playwright (E2E) |

### 5.2 Backend

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js v20+ |
| Framework | Express.js (TypeScript) |
| Database | MongoDB (Mongoose ODM) |
| Caching | Redis + In-memory fallback |
| AI Engine | OpenRouter (Llama 3 / Gemini Pro) |
| Authentication | JWT + HTTP-only Cookies |
| Security | Helmet, CORS, Rate Limiting |
| Monitoring | Sentry (errors), Prometheus + Grafana |
| Process Manager | PM2 (ecosystem.config.js) |
| Scheduler | Node-cron (automated reminders) |
| Testing | Jest |

### 5.3 Infrastructure & DevOps

| Component | Technology |
|-----------|-----------|
| Web Server | Nginx (reverse proxy + SSL) |
| CI/CD | GitHub Actions |
| Backups | Automated daily snapshots |
| Container | Docker-ready |
| Env Management | dotenv (.env per environment) |
| Version Control | Git + GitHub |

### 5.4 System Architecture Diagram

```
┌────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                        │
│         React 19 + Vite SPA (TailwindCSS)              │
│      Zustand State │ React Query │ Framer Motion        │
└────────────────────┬───────────────────────────────────┘
                     │ HTTPS (Nginx SSL Proxy)
┌────────────────────▼───────────────────────────────────┐
│                  API LAYER (Port 5000)                  │
│          Express.js + TypeScript Backend                │
│    Helmet │ Rate Limit │ CORS │ JWT Auth │ Sentry       │
├────────────────────┬───────────────────────────────────┤
│   Business Logic   │    AI Engine (OpenRouter)          │
│   Controllers      │    Llama 3 / Gemini Pro            │
│   Services         │    Tool-Calling Agents             │
└─────────┬──────────┴──────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────┐
│                  DATA LAYER                             │
│         MongoDB (Primary Database)                     │
│         Redis (Cache Layer)                            │
│         In-Memory Fallback (Dev)                       │
└────────────────────────────────────────────────────────┘
```

---

## 6. System Design & Database Schema

### 6.1 Core Data Models (23 MongoDB Collections)

| Model | Purpose |
|-------|---------|
| **User** | Store merchant profile, credentials, and GSTIN |
| **Customer** | Store buyer details, udhaar balance, and credit grade |
| **Vendor** | Store supplier details and payable balances |
| **Product** | Catalog with stock levels, barcodes, and HSN codes |
| **Invoice** | GST-compliant sales records with atomic stock sync |
| **Transaction** | Ledger entries for udhaar given/received |
| **CreditDebitNote** | Store sales and purchase returns (Vouchers) |
| **Expense** | Store shop outgoings categorized by type |
| **Staff** | Employee data and performance metrics |
| **SalaryPayment** | Payroll history and deduction tracking |
| **Shop** | Multi-branch shop configuration |
| **Voucher** | Discount coupons and promotional codes |
| **Admin** | Super admin credentials and platform oversight |
| **Warehouse** | Inventory storage location management |
| **Notification** | System and user alerts |
| **Subscription** | Plan data and billing cycles |
| **AuditLog** | Critical action tracking for security |
| **Campaign** | WhatsApp marketing broadcast records |
| **SupportTicket** | User issue tracking and resolution |
| **CAAccess** | Accountant portal link tokens |

### 6.2 Key Relationship Flow

```
User (Merchant)
  ├── Shop (multi-branch)
  │     ├── Product → Inventory
  │     └── Staff → Attendance
  ├── Customer
  │     ├── LedgerEntry (Udhaar/Payment)
  │     ├── Invoice → Transaction
  │     └── Reminder (auto WhatsApp)
  └── Campaign → Broadcast to Customers
```

---

## 7. API Architecture

### 7.1 API Modules (23 Route Files)

| Route Module | Endpoints | Description |
|-------------|-----------|-------------|
| `/api/auth` | 4 | Register, Login, OTP, Logout |
| `/api/customers` | 8+ | Full CRUD + search + credit grading |
| `/api/invoices` | 10+ | Create, list, PDF, WhatsApp share |
| `/api/inventory` | 6+ | Stock management, low-stock alerts |
| `/api/products` | 8+ | Product catalog CRUD |
| `/api/ledger` | 6+ | Khata entries, balance history |
| `/api/transactions` | 8+ | Financial transaction records |
| `/api/staff` | 6+ | Staff CRUD + attendance |
| `/api/vendors` | 6+ | Vendor management |
| `/api/campaigns` | 4+ | WhatsApp campaign management |
| `/api/reminders` | 4+ | Automated reminder config |
| `/api/analytics` | 10+ | Dashboard KPIs, charts, reports |
| `/api/ai` | 3+ | AI assistant, health score, tips |
| `/api/admin` | 12+ | Super admin panel APIs |
| `/api/subscriptions` | 4+ | Plan management & billing |
| `/api/vouchers` | 6+ | Discount voucher system |
| `/api/returns` | 4+ | Credit Note & Debit Note (Returns) |
| `/api/payroll` | 6+ | Staff salary & payroll processing |
| `/api/reports` | 8+ | Tally, CA, and advanced business reports |
| `/api/loans` | 3+ | Fintech/Loan API integration |
| `/api/whatsapp` | 2+ | WhatsApp integration |
| `/api/settings` | 3+ | User/payment settings |
| `/api/notifications` | 2+ | Notification management |
| `/api/shops` | 6+ | Multi-branch shop management |
| `/api/payments` | 3+ | Payment processing |
| `/api/support` | 4+ | Helpdesk tickets |
| `/api/landing` | 2+ | Public landing page data |

### 7.2 Security Middleware Stack

```
Request → Helmet (Headers) → Rate Limiter (100 req/15min)
       → CORS → Cookie Parser → JWT Verify
       → RBAC (Role Check) → Controller → Response
```

---

## 8. Security & Compliance

### 8.1 Security Measures

| Layer | Implementation |
|-------|--------------|
| **Encryption** | AES-256 for data at rest |
| **Auth** | JWT with HTTP-only cookies (XSS safe) |
| **API Protection** | Rate limiting (100 req / 15 min / IP) |
| **Headers** | Helmet.js (CSP, HSTS, X-Frame) |
| **Access Control** | RBAC (Merchant / Staff / Admin roles) |
| **Password** | Bcrypt hashing (salt rounds: 12) |
| **Input Validation** | Express validator on all endpoints |
| **Error Monitoring** | Sentry.io integration |
| **Audit Trail** | AuditLog model for all critical ops |

### 8.2 Regulatory Compliance

- ✅ **DPDP Act 2023** (Digital Personal Data Protection Act, India)
- ✅ **GST Compliance** — Invoice format as per GST rules
- ✅ **Data Residency** — India-based server deployment
- ✅ **GDPR-inspired** data deletion & portability features

---

## 9. Market Analysis

### 9.1 Market Size

| Segment | Size |
|---------|------|
| Total Indian SMBs | 63+ million |
| SMBs using digital tools | ~18 million (29%) |
| SMBs without proper accounting | 45+ million |
| Target Addressable Market (TAM) | ₹12,000 Cr+ |
| Serviceable Addressable Market (SAM) | ₹3,500 Cr |
| Serviceable Obtainable Market (SOM) | ₹350 Cr (Year 3) |

### 9.2 Competitive Landscape

| Feature | DukanDost Pro | OkCredit | Khatabook | myBillBook |
|---------|:------------:|:--------:|:---------:|:----------:|
| AI Assistant (Tool-Calling) | ✅ | ❌ | ❌ | ❌ |
| GST Invoicing | ✅ | ❌ | ❌ | ✅ |
| Inventory Sync | ✅ | ❌ | ❌ | ✅ |
| WhatsApp Campaigns | ✅ | ❌ | ✅ | ❌ |
| Staff Management | ✅ | ❌ | ❌ | ❌ |
| Credit Scoring | ✅ | ❌ | ❌ | ❌ |
| Business Health Score | ✅ | ❌ | ❌ | ❌ |
| Multi-branch Support | ✅ | ❌ | ❌ | ✅ |
| Admin Super Panel | ✅ | ❌ | ❌ | ❌ |
| Open Source / Self-hostable | ✅ | ❌ | ❌ | ❌ |

### 9.3 Competitive Advantage (Moats)

1. **AI Moat** — Tool-calling AI that acts, not just talks
2. **Data Moat** — Transaction history enables credit scoring (fintech upsell)
3. **Network Effect** — WhatsApp campaigns bring more customers into the ecosystem
4. **Switching Cost** — Once ledger data is in, merchants don't leave
5. **Integration Depth** — Single platform for all business ops

---

## 10. Business Model & Monetization

### 10.1 Subscription Plans

| Plan | Price | Features |
|------|-------|---------|
| **Free** | ₹0/month | Basic Khata, 50 invoices/month, 100 customers |
| **Business** | ₹299/month | Unlimited invoices, WhatsApp reminders, AI assistant |
| **Pro** | ₹599/month | All Business + campaigns, staff, advanced analytics |
| **Enterprise** | Custom | White-label, API access, dedicated support |

### 10.2 Revenue Streams

1. **SaaS Subscriptions** — Monthly/Annual plan fees (primary)
2. **Transaction Fees** — 0.5–1% on digital payments processed
3. **Lending Commission** — Referral fee from NBFC/bank partnerships (fintech)
4. **WhatsApp API** — Per-message charges passed through (small margin)
5. **Data Insights** — Anonymized aggregate market intelligence (B2B)

### 10.3 Unit Economics (Projections)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Total Users | 5,000 | 25,000 | 100,000 |
| Paid Users | 1,000 | 8,000 | 40,000 |
| ARPU (₹/month) | 350 | 380 | 420 |
| MRR | ₹3.5L | ₹30.4L | ₹168L |
| ARR | ₹42L | ₹3.6Cr | ₹20Cr |
| CAC | ₹250 | ₹200 | ₹150 |
| LTV | ₹4,200 | ₹5,700 | ₹7,560 |
| LTV:CAC Ratio | 16.8x | 28.5x | 50.4x |

---

## 11. Investor Pitch Summary

### 11.1 The Opportunity

> **₹12,000 Crore market. 63 million SMBs. 71% still digitally unserved.**

Indian retail is the backbone of the economy — but it runs on notebooks, WhatsApp forwards, and fragmented apps. DukanDost Pro is the **unified OS for Indian retail**, powered by AI.

### 11.2 Why Now?

- 🇮🇳 **UPI + Aadhaar** infrastructure is ready — digital adoption is accelerating
- 📱 **Smartphone penetration** in Tier 2/3 cities crossed 60% in 2024
- 🤖 **Generative AI** is now cost-effective enough to deploy at SMB scale
- 📜 **DPDP Act 2023** creates compliance demand for structured data management
- 💳 **RBI's Account Aggregator** framework opens fintech lending opportunities

### 11.3 Traction Metrics (Target — End of Beta)

- 500+ active merchants onboarded
- ₹2 Cr+ total invoices processed through platform
- 85%+ D30 retention rate
- NPS Score: 72+
- 10,000+ customers managed across all shops

### 11.4 Funding Ask

| Round | Amount | Use of Funds |
|-------|--------|-------------|
| **Seed** | ₹1.5 Crore | Team hiring (3 engineers, 1 sales), server infra, marketing |
| **Series A** | ₹8 Crore | Scale to 1L merchants, WhatsApp API, NBFC partnerships |

### 11.5 Fund Utilization (Seed Round)

```
Engineering & Product   ──────────────────────── 40%  (₹60L)
Sales & Marketing       ──────────────────────── 30%  (₹45L)
Infrastructure          ──────────────────────── 15%  (₹22.5L)
Operations & Legal      ──────────────────────── 10%  (₹15L)
Reserve                 ───────────────────────── 5%  (₹7.5L)
```

---

## 12. Project Timeline & Milestones

```
Phase 1 — Foundation (Month 1–2)
  ✅ Backend API architecture (Node.js + MongoDB)
  ✅ Authentication system (JWT + OTP)
  ✅ Digital Khata module
  ✅ Basic invoicing

Phase 2 — Core Features (Month 3–4)
  ✅ GST invoice with PDF generation
  ✅ Inventory sync with invoicing
  ✅ Staff & attendance management
  ✅ WhatsApp integration (reminders)

Phase 3 — AI & Intelligence (Month 5–6)
  ✅ AI Agent with tool-calling (OpenRouter)
  ✅ Business Health Score algorithm
  ✅ Credit grading system
  ✅ Campaign management

Phase 4 — Admin & Production (Month 7–8)
  ✅ Super Admin panel
  ✅ Subscription billing
  ✅ Sentry + Prometheus monitoring
  ✅ CI/CD pipeline (GitHub Actions)
  ✅ Nginx + SSL + PM2 deployment

Phase 5 — Scale & Fintech (Month 9–12) ✅ COMPLETED
  ✅ NBFC lending API simulation
  ✅ Offline PWA mode + Connectivity UI
  ✅ Multi-language support (Hindi/English)
  ✅ Advanced Reports (Tally/CA Portal)
  ✅ Expense Tracking module

Phase 6 — Advanced Enterprise (Year 2) [UPCOMING]
  ⏳ Mobile app (React Native)
  ⏳ Credit Note & Debit Note (Sales Return)
  ⏳ E-Invoice & E-Way Bill integration
  ⏳ Batch & Serial Number tracking
  ⏳ Digital Catalog / Online Store
```

---

## 13. Team & Roles

| Role | Responsibility |
|------|---------------|
| **Full-Stack Architect** | System design, backend API, database schema |
| **Frontend Engineer** | React 19 UI, animations, state management |
| **AI/ML Engineer** | OpenRouter integration, tool-calling agent |
| **DevOps Engineer** | CI/CD, Docker, Nginx, monitoring |
| **UI/UX Designer** | Glassmorphic design system, user flows |
| **Product Manager** | Roadmap, merchant research, analytics |

> *Built under the umbrella of **Maajanki Web Tech Digital Agency***

---

## 14. Conclusion & Future Scope

### 14.1 Summary

DukanDost Pro successfully addresses the core pain points of India's 63+ million SMBs by providing:
- A **unified digital workspace** replacing 4–7 fragmented apps
- An **AI agent** that acts on natural language commands
- **GST compliance** without complexity
- **Automated udhaar recovery** via WhatsApp
- **Credit visibility** for future fintech integration

The platform is built on production-grade, enterprise architecture and is ready for scale.

### 14.2 Future Scope

| Feature | Timeline | Impact |
|---------|----------|--------|
| **React Native Mobile App** | Q3 2026 | Tier 2/3 offline merchants |
| **Offline-First PWA** | Q3 2026 | No-internet usage in rural areas |
| **Working Capital Loans** | Q4 2026 | Fintech revenue stream |
| **Account Aggregator Integration** | Q4 2026 | RBI-compliant credit scoring |
| **Barcode/QR Scanner** | Q3 2026 | Faster inventory entry |
| **Multi-language (Hindi/Tamil/Telugu)** | Q4 2026 | 3x addressable market |
| **B2B Marketplace** | 2027 | Vendor-merchant trade network |
| **ERP Integration APIs** | 2027 | Enterprise upsell |
| **Tally Plugin** | 2027 | Existing accountant adoption |

### 14.3 Vision

> *"To become the financial operating system for every shop in Bharat — from the kirana store on your street to the multi-branch retail chain in your city."*

---

## 15. References

1. MSME Ministry of India — Annual Report 2023–24
2. NASSCOM India SMB Digital Adoption Report 2024
3. RBI — Account Aggregator Framework Documentation
4. DPDP Act 2023 — Ministry of Electronics & IT (MeitY)
5. OpenRouter API Documentation — https://openrouter.ai/docs
6. MongoDB Atlas — https://www.mongodb.com/atlas
7. React 19 Documentation — https://react.dev
8. Express.js — https://expressjs.com
9. Sentry — https://sentry.io
10. Prometheus Monitoring — https://prometheus.io
11. GitHub Repository — https://github.com/Ashishkrji/DukanDost-Pro-Website-Mobile-App

---

*© 2026 DukanDost Pro | Maajanki Web Tech Digital Agency | All Rights Reserved*  
*This document is confidential and intended for authorized recipients only.*
