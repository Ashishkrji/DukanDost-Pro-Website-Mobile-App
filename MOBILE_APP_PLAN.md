# DukanDost Pro - Mobile App Implementation Plan

This document serves as a roadmap for building the DukanDost Pro Mobile Application. The decision is to use **React Native** to leverage the existing JavaScript/React knowledge from the web project.

---

## 🚀 Tech Stack Decision
- **Framework:** React Native (Managed Workflow via Expo)
- **Language:** JavaScript / TypeScript
- **Styling:** NativeWind (TailwindCSS for React Native) or Styled Components
- **State Management:** Redux Toolkit (to sync with Web state logic)
- **Backend:** Existing MERN Backend (REST APIs)
- **Database:** MongoDB (via existing Backend)

---

## 🛠 Prerequisites for Development
When you are ready to start, ensure you have the following installed:
1. **Node.js:** (Already installed for the web project)
2. **Watchman:** (For macOS users, recommended for file watching)
3. **Android Studio:**
   - Install Android SDK
   - Setup Android Virtual Device (Emulator)
   - Configure `ANDROID_HOME` environment variable
4. **Expo CLI:** `npm install -g expo-cli`
5. **Mobile Testing:** Download the **"Expo Go"** app on your physical Android/iOS device.

---

## 📂 Project Structure (Planned)
```text
/MobileApp
  ├── assets/          # Images, Icons, Fonts
  ├── src/
  │   ├── components/  # Reusable UI components
  │   ├── screens/     # Page-level components (Login, Dashboard, etc.)
  │   ├── navigation/  # React Navigation (Stack, Tabs, Drawer)
  │   ├── services/    # API calls (Axios instances)
  │   ├── store/       # Redux slices and store
  │   └── utils/       # Helper functions
  ├── App.js           # Entry point
  └── app.json         # Expo configuration
```

---

## 📝 Key Features to Port from Website
1. **User Authentication:** Login/Signup using existing JWT-based Backend.
2. **Dashboard:** Overview of sales, inventory, and shop status.
3. **Inventory Management:** Add/Edit/Delete products via mobile camera/barcode scanner.
4. **Sales Tracking:** Real-time updates of daily transactions.
5. **Push Notifications:** Alert users for low stock or new orders.
6. **Offline Support:** Basic caching using `AsyncStorage` or `SQLite`.

---

## 🔗 Backend Integration
The mobile app will connect to the same backend:
- **Base URL:** `http://<your-server-ip>:5000/api`
- **Authentication:** Bearer Token in Headers.

---

## 📅 Roadmap to Start
1. **Step 1:** Run `npx create-expo-app MobileApp`.
2. **Step 2:** Setup `react-navigation` for screen transitions.
3. **Step 3:** Connect to the Backend `.env` variables.
4. **Step 4:** Build the Login screen and verify Token storage.
5. **Step 5:** Gradually build features corresponding to the Website's functionality.

---

> **Note:** Refer to the "Google Stitch" design files for UI/UX consistency when starting development.
