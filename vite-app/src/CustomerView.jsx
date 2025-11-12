import { useState, useEffect } from 'react'
import './App.css'

// Helper functions for localStorage
const getBookings = () => {
  const bookings = localStorage.getItem('bookings')
  return bookings ? JSON.parse(bookings) : []
}

const saveBookings = (bookings) => {
  localStorage.setItem('bookings', JSON.stringify(bookings))
  // Dispatch event so BusinessView can update
  window.dispatchEvent(new Event('bookingsUpdated'))
}

function CustomerView() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ]

  useEffect(() => {
    loadUserBookings()
  }, [email])

  const loadUserBookings = () => {
    const allBookings = getBookings()
    if (email) {
      const userBookings = allBookings.filter(b => b.email === email)
      setBookings(userBookings)
    } else {
      setBookings([])
    }
  }

  const handleBooking = (e) => {
    e.preventDefault()
    
    if (!name || !email || !selectedDate || !selectedSlot) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    
    // Check if slot is already taken
    const allBookings = getBookings()
    const isSlotTaken = allBookings.some(
      b => b.date === selectedDate && b.slot === selectedSlot
    )
    
    if (isSlotTaken) {
      alert('This slot is already booked. Please choose another.')
      setLoading(false)
      return
    }

    // Create booking
    const newBooking = {
      id: Date.now().toString(),
      name,
      email,
      date: selectedDate,
      slot: selectedSlot,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    }

    const updatedBookings = [...allBookings, newBooking]
    saveBookings(updatedBookings)

    setName('')
    setSelectedDate('')
    setSelectedSlot('')
    alert('Booking confirmed!')
    loadUserBookings()
    setLoading(false)
  }

  const deleteBooking = (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    
    const allBookings = getBookings()
    const updatedBookings = allBookings.filter(b => b.id !== id)
    saveBookings(updatedBookings)
    loadUserBookings()
    alert('Booking cancelled successfully')
  }

  return (
    <div className="app">
      <h1>Book Your Appointment</h1>
      
      <div className="booking-container">
        <form onSubmit={handleBooking} className="booking-form">
          <h2>Book a Slot</h2>
          
          <div className="form-group">
            <label htmlFor="name-input">Name:</label>
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-input">Email:</label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date-input">Date:</label>
            <input
              id="date-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slot-select">Time Slot:</label>
            <select
              id="slot-select"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              required
            >
              <option value="">Select a time slot</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="book-btn" disabled={loading}>
            {loading ? 'Booking...' : 'Book Slot'}
          </button>
        </form>

        <div className="bookings-list">
          <h2>Your Bookings</h2>
          {bookings.length === 0 ? (
            <p className="no-bookings">No bookings yet</p>
          ) : (
            <div className="bookings">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-info">
                    <strong>{booking.name}</strong>
                    <p>{booking.date}</p>
                    <p>{booking.slot}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--spa-sage)' }}>
                      Status: {booking.status}
                    </p>
                  </div>
                  <button 
                    onClick={() => deleteBooking(booking.id)}
                    className="delete-btn"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerView
