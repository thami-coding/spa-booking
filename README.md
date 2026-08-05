# 💆 Spa Booking Application

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

## Project Setup

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies fast with pnpm
pnpm install

#  Run Vite dev server
pnpm run dev
```

### 1. Backend Setup
```bash
cd backend

# Create virtual environment and install dependencies using uv
uv venv
source .venv/bin/activate
.venv\Scripts\activate # On Windows

# Install dependencies fast with uv
uv sync

# Start FastAPI development server
uv run uvicorn main:app --reload
