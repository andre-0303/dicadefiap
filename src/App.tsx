import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PostPage from './pages/Post'
import AdminLogin from './pages/Admin/Login'
import Dashboard from './pages/Admin/Dashboard'
import NewPost from './pages/Admin/NewPost'
import EditPost from './pages/Admin/EditPost'

function NotFound() {
  return (
    <div className="min-h-screen bg-black font-mono flex items-center justify-center">
      <p className="text-xs text-[#333]">404 — página não encontrada</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:slug" element={<Home />} />
        <Route path="/post/:slug" element={<PostPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/posts" element={<Dashboard />} />
        <Route path="/admin/posts/new" element={<NewPost />} />
        <Route path="/admin/posts/:id/edit" element={<EditPost />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
