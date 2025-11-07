import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/getProfile'

export async function GET() {
  try {
    const { profile } = getProfile()
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error loading profile:', error)
    return NextResponse.json(
      { error: 'Failed to load profile' },
      { status: 500 }
    )
  }
}

