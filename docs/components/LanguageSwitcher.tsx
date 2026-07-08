'use client'
import { useRouter } from 'next/router'

export function LanguageSwitcher() {
  const router = useRouter()
  const { pathname } = router

  const isSpanish = pathname.startsWith('/es')

  const toggle = () => {
    if (isSpanish) {
      const englishPath = pathname.replace(/^\/es/, '') || '/'
      router.push(englishPath)
    } else {
      const spanishPath = '/es' + (pathname === '/' ? '' : pathname)
      router.push(spanishPath)
    }
  }

  return (
    <button
      onClick={toggle}
      title={isSpanish ? 'Switch to English' : 'Cambiar a Español'}
      style={{
        padding: '4px 12px',
        borderRadius: '6px',
        border: '1px solid currentColor',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 500,
        opacity: 0.75,
        background: 'transparent',
        color: 'inherit',
        lineHeight: 1.5,
      }}
    >
      {isSpanish ? 'EN' : 'ES'}
    </button>
  )
}
