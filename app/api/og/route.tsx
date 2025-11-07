import { ImageResponse } from 'next/og'
import { getProfile } from '@/lib/getProfile'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const { profile } = getProfile()

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF8F3',
          color: '#111111',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#FFC857',
            }}
          >
            {profile.name}
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: '#6B7280',
              marginTop: '10px',
            }}
          >
            {profile.title}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

