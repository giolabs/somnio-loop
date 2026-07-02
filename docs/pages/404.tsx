import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>404 — Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">← Go home</Link>
    </div>
  )
}
