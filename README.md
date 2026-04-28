# Anime Watchlist

A modern web application for tracking and managing your anime watchlist. Built with TypeScript, React, and Tailwind CSS, with a robust backend for data persistence.

## Features

-  **Track Anime**: Keep track of anime you want to watch, are currently watching, or have completed
-  **User Authentication**: Secure login and account management via Supabase
-  **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
-  **Modern UI**: Clean and intuitive user experience with Headless UI components

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Supabase JS** - Backend client
- **Headless UI** - Unstyled UI components
- **Lucide React** - Icon library

### Backend
- Node.js / TypeScript - Server runtime and language
- Supabase - PostgreSQL database and authentication

## Project Structure

```
Anime-Watchlist/
├── frontend/          # React frontend application
│   ├── src/          # Source code
│   ├── package.json  # Frontend dependencies
│   └── vite.config.ts # Vite configuration
├── backend/          # Backend services
└── README.md         # This file
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TuheliRay/Anime-Watchlist.git
   cd Anime-Watchlist
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env.local` file in the `frontend` directory
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the [GitHub Issues](https://github.com/TuheliRay/Anime-Watchlist/issues) page.

---

Made with ❤️ by [TuheliRay](https://github.com/TuheliRay)
