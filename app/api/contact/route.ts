import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      )
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      console.error('WEB3FORMS_ACCESS_KEY is not configured')
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Debug: Log that we have the key (first 10 chars only for security)
    console.log('Using access key:', accessKey.substring(0, 10) + '...')

    // Prepare Web3Forms payload
    const payload = {
      access_key: accessKey,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      subject: 'Portfolio Contact Form Submission',
      from_name: name.trim(),
    }

    console.log('Submitting to Web3Forms with payload:', { ...payload, access_key: '***' })

    // Submit to Web3Forms
    // Note: Adding browser-like headers to avoid Cloudflare challenges
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://portfolio-y867.vercel.app',
        'Referer': 'https://portfolio-y867.vercel.app/',
      },
      body: JSON.stringify(payload),
    })

    console.log('Web3Forms response status:', response.status)
    console.log('Web3Forms response headers:', Object.fromEntries(response.headers.entries()))

    // Check content type before parsing JSON
    const contentType = response.headers.get('content-type')
    let data

    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      // If not JSON, get text to see what we received
      const text = await response.text()
      console.error('Web3Forms returned non-JSON response:', text.substring(0, 500))
      return NextResponse.json(
        { success: false, message: 'Invalid response from form service' },
        { status: 500 }
      )
    }

    if (response.ok && data.success) {
      return NextResponse.json(
        { success: true, message: 'Message sent successfully!' },
        { status: 200 }
      )
    } else {
      console.error('Web3Forms error:', data)
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to send message' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

