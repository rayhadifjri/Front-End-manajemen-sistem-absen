import Dashboard from './landingPages/dashboard'
import Login from './landingPages/login'
import ProtectedRoutes from './context/ProtectedRoutes'
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const App = () => {

  return (
    <main className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Dashboard />}>
            <Route element={<ProtectedRoutes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App;