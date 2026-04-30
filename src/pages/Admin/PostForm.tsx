import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Markdown from 'react-markdown'
import { getCategories } from '../../lib/db'
import type { Category, PostInput } from '../../types'

export type PostFormProps = {
  initialValues?: Partial<PostInput>
  onSave: (data: PostInput) => Promise<void>
  onDelete?: () => Promise<void>
  title: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

export default function PostForm({ initialValues, onSave, onDelete, title }: PostFormProps) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [slugEdited, setSlugEdited] = useState(!!initialValues?.slug)
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')

  const [form, setForm] = useState<PostInput>({
    titulo: initialValues?.titulo ?? '',
    slug: initialValues?.slug ?? '',
    conteudo_md: initialValues?.conteudo_md ?? '',
    categoria_id: initialValues?.categoria_id ?? null,
    publicado: initialValues?.publicado ?? true,
  })

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  function handleTituloChange(value: string) {
    setForm(f => ({
      ...f,
      titulo: value,
      slug: slugEdited ? f.slug : slugify(value),
    }))
  }

  function handleSlugChange(value: string) {
    setSlugEdited(true)
    setForm(f => ({ ...f, slug: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.titulo.trim() || !form.slug.trim()) return
    setSaving(true)
    try {
      await onSave(form)
      navigate('/admin/posts')
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar. Veja o console.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!onDelete) return
    if (!confirm('Deletar este post permanentemente?')) return
    setDeleting(true)
    try {
      await onDelete()
      navigate('/admin/posts')
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black font-mono">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff605c]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd44]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ca4e]" />
            </div>
            <h1 className="text-sm font-bold text-white">
              <span className="text-green-400 mr-2">{'>'}</span>
              {title}
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/posts')}
            className="text-xs text-[#444] hover:text-[#777] transition-colors"
          >
            cancelar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Campos de metadados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* Título */}
            <div className="md:col-span-2">
              <label className="block text-[10px] text-[#555] mb-1 uppercase tracking-wider">título</label>
              <input
                type="text"
                value={form.titulo}
                onChange={e => handleTituloChange(e.target.value)}
                required
                className="w-full bg-[#0d0d0d] border border-[#222] rounded px-3 py-2 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
                placeholder="Título do post..."
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-[10px] text-[#555] mb-1 uppercase tracking-wider">categoria</label>
              <select
                value={form.categoria_id ?? ''}
                onChange={e => setForm(f => ({ ...f, categoria_id: e.target.value || null }))}
                className="w-full bg-[#0d0d0d] border border-[#222] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444] transition-colors"
              >
                <option value="">— sem categoria —</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Slug + publicado */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-[10px] text-[#555] mb-1 uppercase tracking-wider">slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => handleSlugChange(e.target.value)}
                required
                className="w-full bg-[#0d0d0d] border border-[#222] rounded px-3 py-2 text-sm text-[#888] placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
                placeholder="meu-post-aqui"
              />
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setForm(f => ({ ...f, publicado: !f.publicado }))}
                  className={`w-9 h-5 rounded-full border transition-colors cursor-pointer flex items-center px-0.5 ${
                    form.publicado
                      ? 'bg-green-400/20 border-green-400/40'
                      : 'bg-[#111] border-[#222]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full transition-all ${
                    form.publicado ? 'bg-green-400 translate-x-4' : 'bg-[#444] translate-x-0'
                  }`} />
                </div>
                <span className="text-xs text-[#555]">
                  {form.publicado ? 'publicado' : 'rascunho'}
                </span>
              </label>
            </div>
          </div>

          {/* Tabs editar/preview */}
          <div className="flex items-center gap-0 mb-0 border-b border-[#1a1a1a]">
            {(['edit', 'preview'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-xs border-b-2 transition-colors -mb-px ${
                  tab === t
                    ? 'border-green-400 text-green-400'
                    : 'border-transparent text-[#555] hover:text-[#888]'
                }`}
              >
                {t === 'edit' ? 'editar' : 'preview'}
              </button>
            ))}
          </div>

          {/* Editor */}
          {tab === 'edit' && (
            <textarea
              value={form.conteudo_md}
              onChange={e => setForm(f => ({ ...f, conteudo_md: e.target.value }))}
              rows={28}
              className="w-full bg-[#0d0d0d] border border-t-0 border-[#1a1a1a] rounded-b px-4 py-4 text-sm text-[#d4d4d4] placeholder-[#333] focus:outline-none resize-none leading-relaxed"
              placeholder="# Título&#10;&#10;Escreva em markdown..."
            />
          )}

          {/* Preview */}
          {tab === 'preview' && (
            <div className="border border-t-0 border-[#1a1a1a] rounded-b bg-[#0d0d0d] px-6 py-6 min-h-[400px] prose overflow-auto">
              {form.conteudo_md.trim()
                ? <Markdown>{form.conteudo_md}</Markdown>
                : <p className="text-[#333] text-sm">nada para preview.</p>
              }
            </div>
          )}

          {/* Botões */}
          <div className="flex items-center justify-between mt-4 pt-4">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-xs text-[#555] hover:text-red-400 transition-colors disabled:opacity-40"
                >
                  {deleting ? 'deletando...' : 'deletar post'}
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#111] hover:bg-[#1a1a1a] border border-[#333] hover:border-green-400/30 hover:text-green-400 text-white text-sm rounded transition-colors disabled:opacity-40"
            >
              {saving ? 'salvando...' : 'salvar →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
