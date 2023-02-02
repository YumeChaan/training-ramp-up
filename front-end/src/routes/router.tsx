import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from '../pages/SignIn/SignIn'
import Grid from '../pages/Grid/Grid'
import SignUp from '../pages/SignUp/SignUp'
import Test from '../pages/Test/Test'
import { ToastContainer } from 'react-toastify'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/grid' element={<Grid />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/test' element={<Test />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}
