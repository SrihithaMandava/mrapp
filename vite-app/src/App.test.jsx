import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Slot Booking System', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the main heading', () => {
    expect(screen.getByText('Slot Booking System')).toBeInTheDocument()
  })

  it('renders the booking form', () => {
    expect(screen.getByText('Book a Slot')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    expect(screen.getByLabelText(/Date:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Time Slot:/i)).toBeInTheDocument()
  })

  it('shows "No bookings yet" message initially', () => {
    expect(screen.getByText('No bookings yet')).toBeInTheDocument()
  })

  it('allows user to fill out the booking form', async () => {
    const user = userEvent.setup()
    
    const nameInput = screen.getByPlaceholderText('Enter your name')
    const dateInput = screen.getByLabelText(/Date:/i)
    const slotSelect = screen.getByLabelText(/Time Slot:/i)

    await user.type(nameInput, 'John Doe')
    await user.type(dateInput, '2025-12-01')
    await user.selectOptions(slotSelect, '10:00 AM')

    expect(nameInput).toHaveValue('John Doe')
    expect(dateInput).toHaveValue('2025-12-01')
    expect(slotSelect).toHaveValue('10:00 AM')
  })

  it('creates a booking when form is submitted', async () => {
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText('Enter your name'), 'Jane Smith')
    await user.type(screen.getByLabelText(/Date:/i), '2025-12-15')
    await user.selectOptions(screen.getByLabelText(/Time Slot:/i), '02:00 PM')
    
    const bookButton = screen.getByRole('button', { name: /Book Slot/i })
    await user.click(bookButton)

    await waitFor(() => {
      const bookingCard = screen.getByText('Jane Smith').closest('.booking-card')
      expect(bookingCard).toBeInTheDocument()
      expect(bookingCard).toHaveTextContent('Jane Smith')
      expect(bookingCard).toHaveTextContent('2025-12-15')
      expect(bookingCard).toHaveTextContent('02:00 PM')
    })
  })

  it('clears form after successful booking', async () => {
    const user = userEvent.setup()
    
    const nameInput = screen.getByPlaceholderText('Enter your name')
    const dateInput = screen.getByLabelText(/Date:/i)
    const slotSelect = screen.getByLabelText(/Time Slot:/i)

    await user.type(nameInput, 'Test User')
    await user.type(dateInput, '2025-12-20')
    await user.selectOptions(slotSelect, '11:00 AM')
    
    await user.click(screen.getByRole('button', { name: /Book Slot/i }))

    await waitFor(() => {
      expect(nameInput).toHaveValue('')
      expect(dateInput).toHaveValue('')
      expect(slotSelect).toHaveValue('')
    })
  })

  it('allows canceling a booking', async () => {
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText('Enter your name'), 'Cancel Test')
    await user.type(screen.getByLabelText(/Date:/i), '2025-12-25')
    await user.selectOptions(screen.getByLabelText(/Time Slot:/i), '03:00 PM')
    await user.click(screen.getByRole('button', { name: /Book Slot/i }))

    await waitFor(() => {
      expect(screen.getByText('Cancel Test')).toBeInTheDocument()
    })

    const cancelButton = screen.getByRole('button', { name: /Cancel/i })
    await user.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByText('Cancel Test')).not.toBeInTheDocument()
      expect(screen.getByText('No bookings yet')).toBeInTheDocument()
    })
  })

  it('prevents double booking of the same slot', async () => {
    const user = userEvent.setup()
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    // First booking
    await user.type(screen.getByPlaceholderText('Enter your name'), 'User One')
    await user.type(screen.getByLabelText(/Date:/i), '2025-12-30')
    await user.selectOptions(screen.getByLabelText(/Time Slot:/i), '09:00 AM')
    await user.click(screen.getByRole('button', { name: /Book Slot/i }))

    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument()
    })

    // Try to book the same slot
    await user.type(screen.getByPlaceholderText('Enter your name'), 'User Two')
    await user.type(screen.getByLabelText(/Date:/i), '2025-12-30')
    
    const slotSelect = screen.getByLabelText(/Time Slot:/i)
    const option = Array.from(slotSelect.options).find(opt => opt.value === '09:00 AM')
    
    expect(option).toBeDisabled()
    
    alertMock.mockRestore()
  })

  it('displays all time slots in the dropdown', () => {
    const slotSelect = screen.getByLabelText(/Time Slot:/i)
    const expectedSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ]

    expectedSlots.forEach(slot => {
      expect(slotSelect).toContainHTML(slot)
    })
  })
})
