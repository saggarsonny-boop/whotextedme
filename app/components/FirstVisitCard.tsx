'use client'
import { useEffect, useState } from 'react'

const KEY = 'hive_welcomed_whotextedme'

export default function FirstVisitCard() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true)
  }, [])

  if (!visible) return null

  const dismiss = () => {
    localStorage.setItem(KEY, '1')
    setVisible(false)
  }

  return (
    <div onClick={dismiss} style={{ position:'fixed',inset:0,zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center',padding:'24px',pointerEvents:'auto' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'rgba(17,24,39,0.97)',border:'1px solid rgba(251,191,36,0.3)',borderRadius:'16px',padding:'20px 24px',maxWidth:'420px',width:'100%',display:'flex',flexDirection:'column',gap:'12px' }}>
        <p style={{ margin:0,fontSize:'16px',color:'#f9fafb',lineHeight:'1.5' }}>
          Find the carrier and location behind any phone number. Free. Try it →
        </p>
        <button onClick={dismiss} style={{ alignSelf:'flex-end',background:'rgba(251,191,36,0.15)',border:'1px solid rgba(251,191,36,0.4)',borderRadius:'100px',padding:'8px 20px',color:'#fbbf24',fontSize:'13px',fontFamily:'inherit',cursor:'pointer' }}>
          Got it
        </button>
      </div>
    </div>
  )
}



<!-- Stripe Checkout Block -->
<div id="stripe-checkout-cta" style="margin: 2rem auto; padding: 2rem; border-radius: 12px; background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.2); text-align: center; font-family: sans-serif; max-width: 600px;">
    <h3 style="margin-top: 0; color: #fff;">Activate Premium License</h3>
    <p style="color: #9ca3af; font-size: 0.95rem; margin-bottom: 1.5rem;">Get instant access to all advanced capabilities and integration features.</p>
    <a href="https://buy.stripe.com/6oU00lb2L6F37bIazv0RG0J" target="_blank" style="display: inline-block; padding: 0.8rem 2rem; background: #3b82f6; color: #fff; font-weight: bold; border-radius: 8px; text-decoration: none; transition: background 0.2s;">Unlock Now</a>
</div>
