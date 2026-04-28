# Anime Watchlist

A modern web application for tracking and managing your anime watchlist. Built with TypeScript, React, and Tailwind CSS, with a robust backend for data persistence.

## Features

- 📺 **Track Anime**: Keep track of anime you want to watch, are currently watching, or have completed
- ⭐ **Rate & Review**: Rate anime and add personal reviews
- 🔍 **Search & Filter**: Easily find anime in your watchlist with search and filtering capabilities
- 📊 **Statistics**: View your watching statistics and progress
- 🔐 **User Authentication**: Secure login and account management via Supabase
- 📱 **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- 🎨 **Modern UI**: Clean and intuitive user experience with Headless UI components

## Tech Stack

### Frontend
- **React** 19.2.4 - UI library
- **TypeScript** 6.0.2 - Type-safe JavaScript
- **Vite** 8.0.4 - Lightning-fast build tool
- **Tailwind CSS** 4.2.2 - Utility-first CSS framework
- **React Router** 7.14.2 - Client-side routing
- **Axios** 1.15.1 - HTTP client
- **Supabase JS** 2.104.0 - Backend client
- **Headless UI** 2.2.10 - Unstyled UI components
- **Lucide React** 1.8.0 - Icon library

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
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the [GitHub Issues](https://github.com/TuheliRay/Anime-Watchlist/issues) page.

---

Made with ❤️ by [TuheliRay](https://github.com/TuheliRay)
