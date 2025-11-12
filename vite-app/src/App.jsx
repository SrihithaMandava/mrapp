import { useState } from 'react'
import './App.css'

function App() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [name, setName] = useState('')
  const [bookings, setBookings] = useState([])

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ]

  const handleBooking = (e) => {
    e.preventDefault()
    
    if (!name || !selectedDate || !selectedSlot) {
      alert('Please fill all fields')
      return
    }

    const isSlotTaken = bookings.some(
      booking => booking.date === selectedDate && booking.slot === selectedSlot
    )

    if (isSlotTaken) {
      alert('This slot is already booked. Please choose another.')
      return
    }

    const newBooking = {
      id: Date.now(),
      name,
      date: selectedDate,
      slot: selectedSlot
    }

    setBookings([...bookings, newBooking])
    setName('')
    setSelectedDate('')
    setSelectedSlot('')
    alert('Booking confirmed!')
  }

  const deleteBooking = (id) => {
    setBookings(bookings.filter(booking => booking.id !== id))
  }

  const isSlotBooked = (date, slot) => {
    return bookings.some(booking => booking.date === date && booking.slot === slot)
  }

  return (
    <div className="app">
      <h1>Slot Booking System</h1>
      
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
                <option 
                  key={slot} 
                  value={slot}
                  disabled={selectedDate && isSlotBooked(selectedDate, slot)}
                >
                  {slot} {selectedDate && isSlotBooked(selectedDate, slot) ? '(Booked)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="book-btn">Book Slot</button>
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

export default App
