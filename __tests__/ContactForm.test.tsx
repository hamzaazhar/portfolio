import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { ContactForm } from '@/components/ContactForm'

describe('ContactForm', () => {

  it('renders form fields', () => {
    render(<ContactForm />)
    // @ts-expect-error - jest-dom matchers are available at runtime
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    // @ts-expect-error - jest-dom matchers are available at runtime
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    // @ts-expect-error - jest-dom matchers are available at runtime
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      // @ts-expect-error - jest-dom matchers are available at runtime
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument()
    })
  })
})

