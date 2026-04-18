'use client'

import { useState, useRef, useEffect } from 'react'
import type { LookupResult } from './api/lookup/route'
import styles from './page.module.css'

const EXAMPLES = [
  '+44 7700 900123',
  '+1 415 555 0132',
  '+61 412 345 678',
  '+49 30 12345678',
]

export default function Home() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<LookupResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [placeholder, setPlaceholder] = useState(EXAMPLES[0])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % EXAMPLES.length
      setPlaceholder(EXAMPLES[i])
    }, 3000)
    return () => clearInterval(id)
  }, [])

  async function lookup(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`/api/lookup?number=${encodeURIComponent(input.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Lookup failed.')
      } else {
        setResult(data as LookupResult)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.badge}>Free · No signup</div>
        <h1 className={styles.title}>Who Texted Me?</h1>
        <p className={styles.sub}>
          Enter a phone number to see carrier, line type, and location.
          Include the country code.
        </p>
      </div>

      <form className={styles.form} onSubmit={lookup}>
        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            className={styles.input}
            type="tel"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={placeholder}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          <button className={styles.btn} type="submit" disabled={loading || !input.trim()}>
            {loading ? '…' : 'Look up'}
          </button>
        </div>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {result && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={result.valid ? styles.valid : styles.invalid}>
              {result.valid ? '✓ Valid number' : '✗ Invalid number'}
            </span>
            {result.source === 'local' && (
              <span className={styles.sourceNote}>Basic lookup (no API key configured)</span>
            )}
          </div>

          <div className={styles.number}>{result.international || result.number}</div>

          <div className={styles.grid}>
            {result.national && result.national !== result.international && (
              <Row label="National format" value={result.national} />
            )}
            {result.country_name && <Row label="Country" value={result.country_name} />}
            {result.country_code && !result.country_name && <Row label="Country code" value={result.country_code} />}
            {result.location && <Row label="Location" value={result.location} />}
            {result.carrier && <Row label="Carrier" value={result.carrier} />}
            {result.line_type && <Row label="Line type" value={capitalize(result.line_type)} />}
          </div>

          {result.valid && (
            <div className={styles.search}>
              <span className={styles.searchLabel}>Search further:</span>
              <a href={`https://www.google.com/search?q=${encodeURIComponent(result.international)}`} target="_blank" rel="noopener noreferrer">Google</a>
              <a href={`https://www.truepeoplesearch.com/find/phone/${result.number.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">TruePeopleSearch</a>
              <a href={`https://www.whitepages.com/phone/${result.number.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">Whitepages</a>
            </div>
          )}
        </div>
      )}

      <footer className={styles.footer}>
        No ads. No investors. No agenda. &nbsp;·&nbsp; <a href="https://hive.baby">hive.baby</a>
      </footer>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')
}
