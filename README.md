# DukanDost Pro 🚀

![DukanDost Pro Banner](./assets/banner.png)

*Built by [Maajanki Web Tech Digital Agency](https://maajankiwebtech.com/)*

**DukanDost Pro** is a premium, full-stack Business Operating System designed for modern retail. It replaces legacy tools like OkCredit, Khatabook, and myBillBook with a unified, AI-powered workspace for store management, invoicing, credit recovery, and automated marketing.

---

## 🌟 Key Features

- **AI Agent (Tool Calling)**: A persistent AI assistant (Llama 3/Gemini) that doesn't just talk—it **acts**. Ask it to "Add a customer named Rahul with 500 balance" or "Add 50 Milk packets to inventory," and it handles the database operations for you.
- **AI Business Intelligence**: Proprietary "Business Health Score," automated recovery risk alerts, and predictive cashflow recommendations.
- **Digital Khata System**: Professional-grade ledger for tracking customer credit (Udhaar) and payments with automated WhatsApp reminders.
- **Smart Invoicing & Inventory Sync**: GST-compliant invoice generation with **atomic stock deduction**. Sales are automatically synced with your inventory levels in real-time.
- **Staff & Attendance Management**: Full CRUD for staff members with daily attendance tracking and performance metrics.
- **Marketing Campaigns**: Promotional WhatsApp broadcast engine with audience segmentation for Business plan users.
- **Financing Visibility**: Integrated credit grading and loan eligibility scoring based on real business transaction history.
- **Modern & Responsive UI**: Stunning glassmorphic design built with React 19, TailwindCSS, and Framer Motion.

---

## 🛡️ Nodal Security & Persistence

- **Nodal Data Integrity**: Multi-device synchronization with bank-grade AES-256 encryption.
- **Hybrid Cache**: High-performance Redis caching with a robust in-memory fallback for development environments.
- **Privacy First**: Compliant with the **Digital Personal Data Protection (DPDP) Act 2023** (India). All data is stored on India-based servers.
- **Hardened API**: Protected with Helmet, rate-limiting, and RBAC (Role-Based Access Control).

---

## 💻 Technology Stack

### **Frontend**
- **Core**: React 19, Vite
- **Styling**: TailwindCSS (Modern 4.x), Framer Motion
- **State**: Zustand (Atomic State Management)
- **Networking**: React Query, Axios
- **Visualization**: Recharts, Lucide Icons

### **Backend**
- **Runtime**: Node.js (v20+)
- **Logic**: Express.js (TypeScript)
- **AI Engine**: OpenRouter (Llama 3 / Gemini Pro)
- **Database**: MongoDB (via Mongoose)
- **Security**: Bcrypt, JWT, Helmet, Express-Rate-Limit
- **Monitoring**: Sentry, Prometheus/Grafana

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher)
- [MongoDB](https://www.mongodb.com/)
- [OpenRouter API Key](https://openrouter.ai/) (For AI Assistant)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ashishkrji/DukanDost-Pro-Website-Mobile-App.git
   cd DukanDost-Pro-Website-Mobile-App
   ```

2. **Setup Environment Variables:**
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   OPENROUTER_API_KEY=your_key
   REDIS_URL=optional_redis_url
   ```

3. **Install Dependencies:**
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
- **Infrastructure**: Nginx reverse proxy with SSL termination.
- **CI/CD**: Fully automated pipeline via GitHub Actions.
- **Hardened**: All dashboard charts and data tables include optional-chaining to prevent frontend crashes.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
