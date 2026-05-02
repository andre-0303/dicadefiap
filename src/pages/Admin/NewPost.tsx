import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PostForm from './PostForm'
import { createPost } from '../../lib/db'
import { invalidate } from '../../lib/cache'
import type { PostInput } from '../../types'

function checkAuth(): boolean {
  const token = localStorage.getItem('admin_token')
  if (!token) return false
  return Date.now() - parseInt(token) < 7 * 24 * 60 * 60 * 1000
}

export default function NewPost() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!checkAuth()) navigate('/admin')
  }, [navigate])

  return (
    <PostForm
      title="novo post"
      onSave={(data: PostInput) => createPost(data).then(() => { invalidate('posts:') })}
    />
  )
}
