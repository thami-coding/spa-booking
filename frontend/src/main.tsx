import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import Booking from './components/booking/Booking'
import Login from './components/login/Login'
import BookingSummary from './components/bookingSummary/BookingSummary'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/checkout" element={<BookingSummary />} />
        {/* <Route path="/payment" element={<App />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
