<div align="center">

  <h3 align="center">Anime Watchlist</h3>

  <p align="center">
    A modern, full-stack web application to track your anime journey and get automated push notifications for upcoming episodes.
    <br />
    <br />
    <a href="https://github.com/TuheliRay/Anime-Watchlist/issues">Report Bug</a>
    ·
    <a href="https://github.com/TuheliRay/Anime-Watchlist/issues">Request Feature</a>
  </p>

  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"></a>
    <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase"></a>
  </p>
</div>

---

##  About The Project

**Anime Watchlist** is designed for anime enthusiasts who want a reliable and intuitive way to manage their currently watching, completed, and planned anime. Beyond just keeping lists, this application automatically fetches real-time broadcast schedules and delivers push notifications right to your device before an episode airs, so you never miss a release.

###  Key Features

-  **Personalized Tracking**: Organize your anime into categorized lists ("Watching", "Completed", "Plan to Watch").
-  **Smart Push Notifications**: Automated alerts sent to your device via Firebase Cloud Messaging for anime episodes airing within the next 3 hours.
-  **Auto-Sync Airing Data**: A sophisticated backend cron job keeps the anime release schedules synchronized with the unofficial MyAnimeList API (Jikan API).
-  **Secure Authentication**: Robust user sign-up, login, and session management powered by Supabase.
-  **Responsive & Modern UI**: A clean, accessible, and highly responsive interface built with Tailwind CSS, React, and Headless UI.

---

## 🛠 Built With

### Frontend Architecture
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Headless UI
- **Icons:** Lucide React
- **Client Networking:** Axios, Supabase JS Client, Firebase Web SDK (Service Workers)

### Backend Architecture
- **Runtime:** Node.js + Express
- **Database & Auth:** Supabase (PostgreSQL)
- **Push Notifications:** Firebase Admin SDK
- **Task Scheduling:** Node-Cron (`node-cron`)

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

You will need the following tools and accounts:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) Project (Database & Authentication)
- A [Firebase](https://firebase.google.com/) Project (Cloud Messaging)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TuheliRay/Anime-Watchlist.git
   cd Anime-Watchlist
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env.local` file in the `frontend` directory and add your keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

3. **Setup Backend**
   ```bash
   cd ../backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add your configurations:
   ```env
   PORT=3001
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Firebase Admin SDK Configuration (From Service Account JSON)
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY="your_firebase_private_key"
   ```

4. **Run the Application locally**

   *Start the Backend Server (Terminal 1):*
   ```bash
   cd backend
   node index.js
   ```

   *Start the Frontend Development Server (Terminal 2):*
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📜 Available Scripts

### Frontend (`/frontend`)
- `npm run dev` - Starts the Vite development server.
- `npm run build` - Compiles TypeScript and builds the production bundle.
- `npm run lint` - Runs ESLint for code formatting and error checking.
- `npm run preview` - Previews the production build locally.

### Backend (`/backend`)
- `node index.js` - Starts the Express server and initializes background cron jobs for episode notifications.

---

##  Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with ❤️ by <a href="https://github.com/TuheliRay">TuheliRay</a></b>
</div>
