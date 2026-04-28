# DukanDost Pro 🚀

![DukanDost Pro Banner](./assets/banner.png)

**DukanDost Pro** is a comprehensive, full-stack platform designed to serve as both a website and a mobile application. It empowers retail businesses, providing state-of-the-art tools for store management, invoicing, analytics, and intelligent automation.

---

## 🌟 Key Features

- **Modern & Responsive UI**: Built with React, TailwindCSS, and Framer Motion for a stunning, smooth, and highly responsive user experience across desktop and mobile devices.
- **Robust Backend API**: Powered by Node.js, Express, and TypeScript, ensuring scalable and type-safe server operations.
- **Secure Authentication**: Implements industry-standard security using JWT (JSON Web Tokens) and bcryptjs for password hashing.
- **Payments Integration**: Fully integrated with **Razorpay** to handle seamless and secure digital transactions.
- **AI-Powered Insights**: Integrates **Google GenAI** to provide intelligent business insights, automated responses, and smart assistance.
- **Data Visualization**: Interactive and rich charts/graphs using **Recharts** to analyze sales, inventory, and user data.
- **Automated Tasks**: Background job scheduling with `node-cron` for automated report generation, reminders, and data syncing.
- **Database**: Reliable and flexible data modeling utilizing MongoDB and Mongoose.

---

## 💻 Technology Stack

### **Frontend**
- **Framework**: React 19, Vite
- **Styling**: TailwindCSS, Class Variance Authority (CVA), CLSX
- **State Management**: Zustand
- **Routing**: React Router DOM
- **UI Components**: Radix UI (accessible, unstyled components)
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React, React Icons
- **Data Visualization**: Recharts
- **Payment Gateway**: Razorpay
- **AI Integration**: `@google/genai`

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT, bcryptjs
- **Task Scheduling**: Node-cron
- **Payments**: Razorpay Node SDK

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ashishkrji/DukanDost-Pro-Website-Mobile-App.git
   cd DukanDost-Pro-Website-Mobile-App
   ```

2. **Setup the Backend:**
   ```bash
   cd Backend
   npm install
   ```
   *Create a `.env` file in the Backend directory and add your environment variables (MongoDB URI, JWT Secret, Razorpay Keys, etc.).*

3. **Setup the Frontend:**
   ```bash
   cd ../Frontend
   npm install
   ```
   *Create a `.env` file in the Frontend directory for your frontend API keys and configuration.*

### Running the Application

**Run Backend (Development Mode):**
```bash
cd Backend
npm run dev
```

**Run Frontend (Development Mode):**
```bash
cd Frontend
npm run dev
```

The frontend will start typically on `http://localhost:5173` and the backend on the configured port.

---

## 🛡️ Security & Privacy

We take user data security seriously. The application features robust API endpoint protection, hashed passwords, and secure HTTP cookies. For production, ensure you are serving over HTTPS and have configured CORS appropriately.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Ashishkrji/DukanDost-Pro-Website-Mobile-App/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
