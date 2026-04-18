import { NextRequest, NextResponse } from 'next/server'

export interface LookupResult {
  valid: boolean
  number: string
  international: string
  national: string
  country_code: string
  country_name: string
  location: string
  carrier: string
  line_type: string
  source: 'abstractapi' | 'local'
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('number')?.trim()
  if (!raw) return NextResponse.json({ error: 'Missing number parameter' }, { status: 400 })

  const apiKey = process.env.ABSTRACTAPI_KEY

  if (apiKey) {
    try {
      const encoded = encodeURIComponent(raw.replace(/\s/g, ''))
      const res = await fetch(
        `https://phonevalidation.abstractapi.com/v1/?api_key=${apiKey}&phone=${encoded}`,
        { next: { revalidate: 3600 } }
      )
      if (res.ok) {
        const data = await res.json()
        const result: LookupResult = {
          valid: data.valid ?? false,
          number: data.phone ?? raw,
          international: data.format?.international ?? raw,
          national: data.format?.local ?? raw,
          country_code: data.country?.code ?? '',
          country_name: data.country?.name ?? '',
          location: data.location ?? '',
          carrier: data.carrier ?? '',
          line_type: data.type ?? '',
          source: 'abstractapi',
        }
        return NextResponse.json(result)
      }
    } catch {
      // fall through to local
    }
  }

  // Local fallback: libphonenumber-js (runs server-side)
  try {
    const { parsePhoneNumber, isValidPhoneNumber } = await import('libphonenumber-js')
    const cleaned = raw.startsWith('+') ? raw : `+${raw.replace(/\D/g, '')}`
    const parsed = parsePhoneNumber(cleaned)
    const valid = isValidPhoneNumber(cleaned)
    const result: LookupResult = {
      valid,
      number: cleaned,
      international: parsed.formatInternational(),
      national: parsed.formatNational(),
      country_code: parsed.country ?? '',
      country_name: '',
      location: '',
      carrier: '',
      line_type: '',
      source: 'local',
    }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: 'Could not parse number. Make sure to include country code (e.g. +44 7700 900000).' },
      { status: 422 }
    )
  }
}
