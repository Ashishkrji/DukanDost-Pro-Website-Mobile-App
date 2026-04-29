# DukanDost Pro 🚀

![DukanDost Pro Banner](./assets/banner.png)

*Built by [Maajanki Web Tech Digital Agency](https://maajankiwebtech.com/)*

**DukanDost Pro** is a premium, full-stack Business Operating System designed for modern retail. It replaces legacy tools like OkCredit, Khatabook, and myBillBook with a unified, AI-powered workspace for store management, invoicing, credit recovery, and automated marketing.

---

## 🌟 Key Features

- **AI Business Intelligence**: Proprietary "Business Health Score", automated recovery risk alerts, and smart growth recommendations.
- **Digital Khata System**: Professional-grade ledger for tracking customer credit (Udhaar) and payments with one-click WhatsApp reminders.
- **Marketing Campaigns**: Promotional WhatsApp broadcast engine with audience segmentation for Business plan users.
- **Invoicing & Billing**: Digital GST-compliant invoice generation with instant sharing and payment link integration.
- **Financing Visibility**: Integrated credit grading and loan eligibility scoring based on real business history.
- **Modern & Responsive UI**: Stunning glassmorphic design built with React 19, TailwindCSS, and Motion (Framer).
- **Secure Architecture**: Hardened with Helmet, rate-limiting, and JWT-based role-based access control (RBAC).
- **CI/CD & Monitoring**: Automated deployment via GitHub Actions, Sentry error tracking, and Prometheus uptime monitoring.

---

## 💻 Technology Stack

### **Frontend**
- **Framework**: React 19, Vite
- **Styling**: TailwindCSS (Modern 4.x), Framer Motion
- **State Management**: Zustand
- **E2E Testing**: Playwright
- **Visualization**: Recharts, Lucide Icons

### **Backend**
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js (TypeScript)
- **Database**: MongoDB (via Mongoose)
- **Security**: Helmet, Express-Rate-Limit, Bcrypt
- **Monitoring**: Sentry, Prometheus/Grafana
- **Testing**: Jest, Supertest

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher)
- [MongoDB](https://www.mongodb.com/)
- [Razorpay Account](https://razorpay.com/) (for payments)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ashishkrji/DukanDost-Pro-Website-Mobile-App.git
   cd DukanDost-Pro-Website-Mobile-App
   ```

2. **Automated VPS Setup (Production):**
   Copy `scripts/setup_vps.sh` to your server and run:
   ```bash
   chmod +x setup_vps.sh
   ./setup_vps.sh
   ```

3. **Local Setup:**
   ```bash
   # Backend
   cd Backend && npm install
   # Frontend
   cd ../Frontend && npm install
   ```

### Running the Application

**Development Mode:**
```bash
# In Backend directory
npm run dev
# In Frontend directory
npm run dev
```

---

## 🛡️ Production Readiness
- **Backup**: Daily automated snapshots via `scripts/backup.ts`.
- **Infrastructure**: Nginx reverse proxy with SSL termination (template in `nginx.conf.template`).
- **CI/CD**: Fully automated pipeline in `.github/workflows/main.yml`.
- **Maintenance**: Structured release cycle and rollback strategies in `MAINTENANCE.md`.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Check the [Phase 3 Progress](./Phase_3_Progress.md) for current development status.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
