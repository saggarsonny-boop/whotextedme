'use client'
import { useState, useEffect } from 'react'

interface Tip { label: string; text: string }
interface Props { engineId: string; tips: Tip[] }

export default function TooltipTour({ engineId, tips }: Props) {
  const key = `hive_tour_${engineId}`
  const [step, setStep] = useState<number | null>(null)

  useEffect(() => {
    // Auto-start on first ever visit (after welcome card)
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && !localStorage.getItem(key)) {
        setStep(0)
      }
    }, 1200)
    return () => clearTimeout(timer)
  }, [key])

  function start() { setStep(0) }
  function next() {
    if (step === null) return
    if (step < tips.length - 1) { setStep(step + 1) } else { done() }
  }
  function prev() { if (step !== null && step > 0) setStep(step - 1) }
  function done() {
    if (typeof window !== 'undefined') localStorage.setItem(key, '1')
    setStep(null)
  }

  const tip = step !== null ? tips[step] : null

  return (
    <>
      {/* ? button — fixed bottom-left */}
      <button
        onClick={start}
        title="How to use this"
        style={{
          position: 'fixed', bottom: 24, left: 24, zIndex: 50,
          background: 'rgba(17,24,39,0.85)', border: '1px solid rgba(107,114,128,0.3)',
          borderRadius: 20, padding: '6px 11px', color: '#6b7280',
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'inherit', backdropFilter: 'blur(4px)',
          lineHeight: 1,
        }}
      >
        ?
      </button>

      {/* Tour card */}
      {tip && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          padding: '0 16px 32px',
        }}
          onClick={done}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 400,
              background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(107,114,128,0.25)',
              borderRadius: 18, padding: '20px 22px',
            }}
          >
            {/* Step indicator */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
              {tips.map((_, i) => (
                <div key={i} style={{
                  height: 3, flex: 1, borderRadius: 2,
                  background: i <= step! ? '#f59e0b' : 'rgba(107,114,128,0.25)',
                  transition: 'background 0.2s',
                }} />
              ))}
            </div>

            <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              {tip.label}
            </div>
            <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.6, marginBottom: 20 }}>
              {tip.text}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {step! > 0 && (
                <button onClick={prev} style={btnStyle('ghost')}>← Back</button>
              )}
              <div style={{ flex: 1 }} />
              <button onClick={done} style={btnStyle('ghost')}>Skip</button>
              <button onClick={next} style={btnStyle('primary')}>
                {step! < tips.length - 1 ? 'Next →' : 'Done ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function btnStyle(variant: 'primary' | 'ghost'): React.CSSProperties {
  return variant === 'primary' ? {
    background: '#f59e0b', color: '#0f172a', border: 'none',
    borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
  } : {
    background: 'none', color: '#64748b', border: '1px solid rgba(107,114,128,0.25)',
    borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
  }
}



<!-- Stripe Checkout Block -->
<div id="stripe-checkout-cta" style="margin: 2rem auto; padding: 2rem; border-radius: 12px; background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.2); text-align: center; font-family: sans-serif; max-width: 600px;">
    <h3 style="margin-top: 0; color: #fff;">Activate Premium License</h3>
    <p style="color: #9ca3af; font-size: 0.95rem; margin-bottom: 1.5rem;">Get instant access to all advanced capabilities and integration features.</p>
    <a href="https://buy.stripe.com/6oU00lb2L6F37bIazv0RG0J" target="_blank" style="display: inline-block; padding: 0.8rem 2rem; background: #3b82f6; color: #fff; font-weight: bold; border-radius: 8px; text-decoration: none; transition: background 0.2s;">Unlock Now</a>
</div>
