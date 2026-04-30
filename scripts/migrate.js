// node --env-file=.env scripts/migrate.js
import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

if (!process.env.VITE_DATABASE_URL) {
  console.error('Erro: VITE_DATABASE_URL não encontrada no .env')
  process.exit(1)
}

const sql = neon(process.env.VITE_DATABASE_URL)
const migration = readFileSync(join(__dirname, '../migrations/001_init.sql'), 'utf-8')

const statements = migration
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

console.log(`Executando ${statements.length} statements...`)

for (const stmt of statements) {
  await sql.query(stmt)
  process.stdout.write('.')
}

console.log('\n✓ Migration executada com sucesso!')
