![pnpm](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=flat-square&logo=pnpm&logoColor=f69220)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![SWR](https://img.shields.io/badge/SWR-000000?style=flat-square&logo=vercel&logoColor=white)](https://swr.vercel.app/)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
[![uv](https://img.shields.io/badge/uv-DE5FE9?style=flat-square&logo=uv&logoColor=white)](https://github.com/astral-sh/uv)
![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat-square&logo=pydantic&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![PayFast](https://img.shields.io/badge/PayFast-CC0000?style=flat-square&logo=creditcard&logoColor=white)
# 💆 Spa Booking Application

A full-stack single-page web application (SPA) designed for browsing spa services, scheduling appointments, and managing online bookings.

<br />

## 🚀 Key Features

- **Authentication & Security**: Secure user registration and login using JWT tokens stored in `HttpOnly`, `SameSite` cookies to prevent XSS/CSRF attacks.
- **Real-Time Data Fetching**: Optimized client-side data updates and caching using SWR.
- **Online Payments**: Integrated South African **PayFast** payment gateway for instant, secure checkout.
- **Appointment Management**: Manage active bookings, view history, and cancel or reschedule appointments.

---

<br />

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Routing**: React Router SPA
- **Data Fetching**: SWR
- **Styling**: Tailwind CSS

### Backend
- **Framework**: FastAPI (Python)
- **Data Validation**: Pydantic
- **Database**: MongoDB (via Motor async driver)
- **Auth**: PyJWT with `HttpOnly` Secure Cookies
- **Payment Gateway**: PayFast Integration API

---

<br />

## Getting Started

### Prerequisites
- Node.js v24
- Python v3
- A Mongodb Atlas (URL)
- PayFast merchant credentials (sandbox)

### 1. Clone the repository
```bash
git clone <repo-url>
cd spa-booking
```

### 2. Install dependencies
```bash
# Frontend
cd frontend
pnpm install

# Backend
cd backend
uv venv  # Create virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate
uv sync # Install dependencies
```

### 3. Environment variables

**Backend (`backend/.env.local`)**
```env
DB_URL=
DB_NAME=
JWT_SECRET=
PAYFAST_MERCHANT_ID=
PAYFAST_MERCHANT_KEY=
PAYFAST_PASSPHRASE=
ENVIRONMENT=
```

<br />

**Frontend (`frontend/.env`)**
```env
VITE_BACKEND_URL=

```

### 4. Run the app locally

```bash
# Backend
cd backend
uvicorn app.main:app --reload # Start FastAPI development server

# Frontend (in a separate terminal)
cd frontend
pnpm run dev
```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:8000` by default.

---

<br />

## Scripts

| Command | Location | Description |
|---|---|---|
| `pnpm run dev` | frontend | Start development server |
| `uvicorn app.main:app --reload` | backend | Start development server |


