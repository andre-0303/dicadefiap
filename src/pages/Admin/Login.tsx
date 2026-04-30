import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem('admin_token', Date.now().toString())
      navigate('/admin/posts')
    } else {
      setError('senha incorreta.')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-black font-mono flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Três bolinhas */}
        <div className="flex items-center gap-1.5 mb-8">
          <div className="w-3 h-3 rounded-full bg-[#ff605c]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd44]" />
          <div className="w-3 h-3 rounded-full bg-[#00ca4e]" />
        </div>

        <h1 className="text-lg font-bold text-white mb-1">
          <span className="text-green-400 mr-2">{'>'}</span>
          admin
        </h1>
        <p className="text-xs text-[#555] mb-8">dica da fiap — painel</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#555] mb-2">senha</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              autoFocus
              className="w-full bg-[#0d0d0d] border border-[#222] rounded px-3 py-2.5 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500/70">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#111] hover:bg-[#1a1a1a] border border-[#222] hover:border-[#333] rounded px-4 py-2.5 text-sm text-white transition-colors"
          >
            entrar →
          </button>
        </form>
      </div>
    </div>
  )
}
