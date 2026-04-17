import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Categories from './pages/Categories'
import CategoryPage from './pages/CategoryPage'
import Settings from './pages/Settings'
import Webspaces from './pages/Webspaces'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/category/:slug/:tab" element={<CategoryPage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/webspaces" element={<Webspaces />} />
    </Routes>
  )
}

export default AppRoutes
