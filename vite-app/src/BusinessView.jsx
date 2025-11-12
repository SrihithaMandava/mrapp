import { useState, useEffect } from 'react'
import './BusinessView.css'

// Helper functions for localStorage
const getBookings = () => {
  const bookings = localStorage.getItem('bookings')
  return bookings ? JSON.parse(bookings) : []
}

const saveBookings = (bookings) => {
  localStorage.setItem('bookings', JSON.stringify(bookings))
  window.dispatchEvent(new Event('bookingsUpdated'))
}

function BusinessView() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, today, upcoming
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadAllBookings()
    
    // Listen for booking updates
    const handleUpdate = () => loadAllBookings()
    window.addEventListener('bookingsUpdated', handleUpdate)
    return () => window.removeEventListener('bookingsUpdated', handleUpdate)
  }, [])

  const loadAllBookings = () => {
    setLoading(true)
    const allBookings = getBookings()
    // Sort by date
    allBookings.sort((a, b) => a.date.localeCompare(b.date))
    setBookings(allBookings)
    setLoading(false)
  }

  const updateBookingStatus = (id, newStatus) => {
    const allBookings = getBookings()
    const updatedBookings = allBookings.map(b => 
      b.id === id ? { ...b, status: newStatus } : b
    )
    saveBookings(updatedBookings)
    loadAllBookings()
  }

  const deleteBooking = (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return
    
    const allBookings = getBookings()
    const updatedBookings = allBookings.filter(b => b.id !== id)
    saveBookings(updatedBookings)
    loadAllBookings()
  }

  const getFilteredBookings = () => {
    let filtered = bookings

    // Apply date filter
    const today = new Date().toISOString().split('T')[0]
    if (filter === 'today') {
      filtered = filtered.filter(b => b.date === today)
    } else if (filter === 'upcoming') {
      filtered = filtered.filter(b => b.date >= today)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0]
    return {
      total: bookings.length,
      today: bookings.filter(b => b.date === today).length,
      upcoming: bookings.filter(b => b.date >= today).length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length
    }
  }

  const stats = getStats()
  const filteredBookings = getFilteredBookings()

  if (loading) {
    return <div className="app"><h1>Loading...</h1></div>
  }

  return (
    <div className="app business-view">
      <h1>Business Dashboard</h1>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Today</h3>
          <p className="stat-number">{stats.today}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming</h3>
          <p className="stat-number">{stats.upcoming}</p>
        </div>
        <div className="stat-card">
          <h3>Confirmed</h3>
          <p className="stat-number">{stats.confirmed}</p>
        </div>
      </div>

      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'today' ? 'active' : ''}
            onClick={() => setFilter('today')}
          >
            Today
          </button>
          <button 
            className={filter === 'upcoming' ? 'active' : ''}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
        </div>

        <button className="refresh-btn" onClick={loadAllBookings}>
          Refresh
        </button>
      </div>

      <div className="bookings-table">
        {filteredBookings.length === 0 ? (
          <p className="no-bookings">No bookings found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.name}</td>
                  <td>{booking.email}</td>
                  <td>{booking.date}</td>
                  <td>{booking.slot}</td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      onClick={() => deleteBooking(booking.id)}
                      className="delete-btn-small"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default BusinessView
