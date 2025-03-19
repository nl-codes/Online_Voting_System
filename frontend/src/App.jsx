import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AssignCandidates from './pages/AssignCandidates'
import AdminDashboardPage from './pages/AdminDashboardPage'

const App = () => {
  return (<>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sec/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  </>
  )
}

export default App