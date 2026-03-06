# FestMate – Event Management Web App

![FestMate](public/FestMate.png)

**FestMate** is a full-featured event management web application built with **React** and **Vite**. It provides role-based dashboards for **Admins**, **Coordinators**, and **Students** to create, manage, and participate in events seamlessly.

---

## Features

- **Role-Based Access Control** – Separate dashboards and permissions for Admin, Coordinator, and Student roles
- **Event Management** – Create, browse, and manage events with detailed event pages
- **Upcoming & Trending Events** – Horizontal card carousels showcasing latest and most popular events
- **Event Registration** – Step-by-step wizard for students to register for events
- **User Management** – Admin panel to manage users, view profiles, and handle approvals
- **Calendar View** – Visual calendar for tracking events and tasks
- **Notifications** – Real-time notification system
- **Toast Notifications** – Clean, non-intrusive toast alerts
- **Dark / Light Theme** – Toggle between themes with persistent preference
- **Responsive Design** – Works across desktop, tablet, and mobile devices
- **Charts & Reports** – Dashboard analytics with Chart.js

---

## Tech Stack

| Category       | Technology                          |
| -------------- | ----------------------------------- |
| Frontend       | React 19, React Router v7          |
| Build Tool     | Vite 7                             |
| HTTP Client    | Axios                              |
| Charts         | Chart.js, react-chartjs-2          |
| Carousel       | Swiper.js                          |
| Styling        | CSS (custom), Google Fonts, Material Symbols |
| Linting        | ESLint                             |

---

## Project Structure

```
src/
├── assets/             # Images and static assets
├── component/          # Reusable UI components
│   ├── AdminCards.jsx
│   ├── Aside.jsx
│   ├── Dashboardheader.jsx
│   ├── EventCard.jsx
│   ├── EventNavbar.jsx
│   ├── PublicNavbar.jsx
│   ├── TrendingEvents.jsx
│   ├── UpComingEvent.jsx
│   ├── Toast.jsx
│   └── styles/         # Component-level CSS
├── context/            # React Context providers
│   ├── ThemeProvider.jsx
│   └── ToastProvider.jsx
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── Events.jsx
│   ├── CreateEvent.jsx
│   ├── EventDetailsPage.jsx
│   ├── Calendar.jsx
│   ├── Users.jsx
│   ├── Approvals.jsx
│   ├── Settings.jsx
│   ├── public/         # Public pages (Home, Login, Register, etc.)
│   └── styles/         # Page-level CSS
├── routers/            # Routing & layouts
│   ├── MainRouter.jsx
│   ├── ProtectedRoute.jsx
│   ├── AutoRedirect.jsx
│   └── Layouts/        # Admin, Student, Coordinator, Public layouts
└── utils/              # Utilities & auth
    ├── AuthProvider.jsx
    └── api.jsx
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/Vinoth001704/FestMateWebApp.git

# Navigate to the project
cd FestMateWebApp

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

> Replace with your backend API URL. The `.env` file is git-ignored so your secrets stay local.

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The optimized output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start development server with HMR  |
| `npm run build`   | Build for production               |
| `npm run preview` | Preview the production build       |
| `npm run lint`    | Run ESLint checks                  |

---

## User Roles

| Role          | Access                                                              |
| ------------- | ------------------------------------------------------------------- |
| **Admin**     | Full access – Dashboard, Events, Users, Approvals, Reports, Calendar |
| **Coordinator** | Dashboard, Events, Tasks, Calendar, Settings                      |
| **Student**   | Dashboard, Events, Registered Events, Calendar, Settings            |

---

## Deployment

This project is configured for **Vercel** deployment with SPA routing support (`vercel.json` included).

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add `VITE_API_URL` in Environment Variables
4. Deploy

---

## License

This project is private and not currently licensed for public distribution.

---

## Author

**Vinoth** – [@Vinoth001704](https://github.com/Vinoth001704)
