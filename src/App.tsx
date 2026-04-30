import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Placeholders para páginas ainda não implementadas
function PostPage() {
  return <div className="min-h-screen bg-black text-[#525252] flex items-center justify-center text-sm font-mono">em breve — página do post</div>
}
function AdminLogin() {
  return <div className="min-h-screen bg-black text-[#525252] flex items-center justify-center text-sm font-mono">em breve — admin login</div>
}
function NotFound() {
  return <div className="min-h-screen bg-black text-[#525252] flex items-center justify-center text-sm font-mono">404 — página não encontrada</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:slug" element={<Home />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
