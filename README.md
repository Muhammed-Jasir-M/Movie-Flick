# 🎬 Movie Flick

A feature-rich web application built with **React**, **Tailwind CSS**, **Firebase**, and **TMDB (The Movie Database) API**. Movie Flick offers users a modern, responsive streaming UI experience where they can discover trending movies and TV shows, watch trailers, manage watchlist items, and authenticate securely.

---

## ✨ Features

- 🔐 **User Authentication**: Secure Login & Sign Up powered by Firebase Auth (with Formik & Yup validation).
- 🍿 **Explore & Discover**: Browse trending, popular, top-rated movies and TV shows.
- 🔍 **Search**: Fast real-time search functionality for titles, cast, and genres.
- 🎬 **Trailer & Video Player**: Embedded media player for watching trailers directly on the site.
- 🔖 **Watchlist**: Save your favorite movies and TV shows to view later.
- 📱 **Responsive Design**: Modern, glassmorphism-inspired UI designed using Tailwind CSS & Swiper slider.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM v6
- **Styling**: Tailwind CSS, PostCSS, React Icons
- **State Management / Data Fetching**: Axios, React Context / State
- **Form Handling**: Formik, Yup
- **Backend Services**: Firebase (Authentication & Database)
- **API Source**: TMDB (The Movie Database API)
- **UI Components & Utilities**: Swiper.js, React Toastify, Moment.js

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v14+ recommended) and `yarn` installed on your system.

### 1. Clone the Repository

```bash
git clone https://github.com/Muhammed-Jasir-M/Movie-Flick.git
cd Movie-Flick
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory of your project and configure your Firebase and TMDB API keys:

```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_TMDB_API_KEY=your_tmdb_read_access_token_or_api_key
```

### 4. Run the Application

Start the local development server:

```bash
yarn start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📂 Project Structure

```text
Movie-Flick/
├── public/              # Static public assets
├── src/
│   ├── components/      # Reusable UI components (Navbar, Cards, Slider, etc.)
│   ├── constants/       # App constants and configuration files
│   ├── pages/           # Page routes (Home, Explore, Details, Profile, WatchList, etc.)
│   ├── services/        # API request services & Firebase configuration
│   ├── store/           # Global state / context providers
│   ├── App.js           # Main routing & application wrapper
│   └── index.js         # Entry point
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md            # Project documentation
```

---

## 📜 Available Scripts

In the project directory, you can run:

- `yarn start` – Runs the app in development mode.
- `yarn build` – Builds the app for production in the `build` folder.
- `yarn test` – Launches the test runner.

