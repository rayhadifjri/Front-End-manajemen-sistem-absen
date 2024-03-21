import Dashboard from './landingPages/dashboard'
import Login from './landingPages/login'
import ForgetPassword from './landingPages/forget-password'
import ResetPassword from './landingPages/reset-password'
import ProtectedRoutes from './context/ProtectedRoutes'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const App = () => {

  return (
    <main className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/forget-password' element={<ForgetPassword />} />
          <Route path='/reset-password/:id_user/:token' element={<ResetPassword />} />
          <Route path="/*" element={<Dashboard />}>
            <Route element={<ProtectedRoutes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App;