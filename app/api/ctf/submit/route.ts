import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Flags are configured via environment variable to avoid spoilers in source.
// Provide JSON mapping of sha256(salt + flag) digests per challenge and flagId.
// Example (in .env.local):
// CTF_FLAGS_JSON={"1":{"user":"<sha256>","root":"<sha256>"},"2":{"user":"<sha256>"}}
// CTF_FLAGS_SALT=some_random_secret
function getConfiguredFlagDigests(): Record<string, Record<string, string>> {
  try {
    const raw = process.env.CTF_FLAGS_JSON || '{}'
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function digestFlag(flag: string, salt: string): string {
  return crypto.createHash('sha256').update(salt + flag).digest('hex')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { challengeId, flag, flagId = 'main' } = body || {}

    if (!challengeId || !flag) {
      return NextResponse.json({ ok: false, message: 'Missing challenge ID or flag' }, { status: 400 })
    }

    // Get configured digests
    const configured = getConfiguredFlagDigests()
    const challengeFlags = configured[String(challengeId)]
    if (!challengeFlags) {
      return NextResponse.json({ ok: false, message: 'Flag validation not configured for this challenge' }, { status: 400 })
    }

    const expectedDigest = challengeFlags[flagId]
    if (!expectedDigest) {
      return NextResponse.json({ ok: false, message: 'Flag validation not configured for this flag ID' }, { status: 400 })
    }

    // Validate by comparing salted digests
    const salt = process.env.CTF_FLAGS_SALT || ''
    const submitted = String(flag).trim()
    const isValidFlag = salt && digestFlag(submitted, salt) === expectedDigest

    if (isValidFlag) {
      return NextResponse.json({ 
        ok: true, 
        message: `Correct! ${flagId} flag accepted!`,
        flagId,
        points: flagId === 'user' ? 50 : 100 // Different points for different flags
      })
    } else {
      return NextResponse.json({ 
        ok: false, 
        message: `Incorrect ${flagId} flag. Try again!` 
      })
    }
  } catch (err) {
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 })
  }
}
