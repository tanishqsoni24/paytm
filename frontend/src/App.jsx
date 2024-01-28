import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cookies from 'js-cookie';

function App() {

  const token = Cookies.get('token')

  return (
    <>
      <Router>
        <Routes>
          <Route 
            path="/"
            element={!token? <Login/> : <Home/>} />
          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!token ? <Signup /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
