const clientDashboard = {
  navItems: [
    { label: "Dashboard", id: "clientDashboard" },
    { label: "Profile", id: "profile" },
    { label: "Browse Vehicles", id: "browseVehicles" },
    { label: "Make Reservation", id: "makeBooking" },
    { label: "View Bookings", id: "viewBookings" },
    { label: "Verify ID", id: "verifyID" },
    { label: "Rental History", id: "viewRentals" },
    { label: "Make Payment", id: "makePayment" },
  ],

  init: function () {
    this.renderNavMenu()
    this.renderDashboard()
  },

  renderNavMenu: function () {
    const navMenu = document.getElementById("navMenu")
    navMenu.innerHTML = this.navItems
      .map((item) => `<li><button onclick="showPage('${item.id}')" class="nav-button">${item.label}</button></li>`)
      .join("")
  },

  renderDashboard: function () {
    const contentArea = document.getElementById("contentArea")
    contentArea.innerHTML = `
      <div id="clientDashboard" class="content-page active">
        <div class="dashboard-grid">
          <div class="quick-card" onclick="showPage('browseVehicles')">
            <div class="card-icon">🚗</div>
            <h3>Browse Vehicles</h3>
            <p>View available vehicles for rental</p>
          </div>
          <div class="quick-card" onclick="showPage('makeBooking')">
            <div class="card-icon">📅</div>
            <h3>Make Reservation</h3>
            <p>Reserve or book a vehicle</p>
          </div>
          <div class="quick-card" onclick="showPage('viewBookings')">
            <div class="card-icon">📋</div>
            <h3>View Bookings</h3>
            <p>Check your booking status</p>
          </div>
          <div class="quick-card" onclick="showPage('verifyID')">
            <div class="card-icon">📄</div>
            <h3>Verify ID</h3>
            <p>Upload identification documents</p>
          </div>
          <div class="quick-card" onclick="showPage('viewRentals')">
            <div class="card-icon">📱</div>
            <h3>Rental History</h3>
            <p>Check your rental history</p>
          </div>
          <div class="quick-card" onclick="showPage('makePayment')">
            <div class="card-icon">💳</div>
            <h3>Make Payment</h3>
            <p>Process payment for bookings</p>
          </div>
        </div>
      </div>

      <div id="browseVehicles" class="content-page">
        <div class="page-header">
          <h2>Browse Vehicles</h2>
          <button onclick="showPage('clientDashboard')" class="back-button">← Back</button>
        </div>
        <div class="vehicles-grid" id="vehiclesGrid"></div>
      </div>

      <div id="makeBooking" class="content-page">
        <div class="page-header">
          <h2>Make Reservation</h2>
          <button onclick="showPage('clientDashboard')" class="back-button">← Back</button>
        </div>
        <form id="bookingForm" onsubmit="handleBooking(event)" class="form-section">
          <div class="form-row">
            <div class="form-input-group">
              <label for="bookingVehicle" class="form-label">Vehicle</label>
              <select id="bookingVehicle" class="form-input" required>
                <option>Select a vehicle</option>
              </select>
            </div>
            <div class="form-input-group">
              <label for="pickupDate" class="form-label">Pick-up Date</label>
              <input type="date" id="pickupDate" class="form-input" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-input-group">
              <label for="returnDate" class="form-label">Return Date</label>
              <input type="date" id="returnDate" class="form-input" required>
            </div>
            <div class="form-input-group">
              <label for="rentalDays" class="form-label">Rental Days</label>
              <input type="number" id="rentalDays" class="form-input" value="1" min="1" required>
            </div>
          </div>
          <div class="form-input-group form-row full">
            <label for="specialRequests" class="form-label">Special Requests</label>
            <textarea id="specialRequests" class="form-input" placeholder="Any special requirements..."></textarea>
          </div>
          <button type="submit" class="submit-button">Confirm Booking</button>
        </form>
      </div>

      <div id="viewBookings" class="content-page">
        <div class="page-header">
          <h2>Your Bookings</h2>
          <button onclick="showPage('clientDashboard')" class="back-button">← Back</button>
        </div>
        <div class="bookings-grid" id="bookingsList"></div>
      </div>

      <div id="verifyID" class="content-page">
        <div class="page-header">
          <h2>Verify ID</h2>
          <button onclick="showPage('clientDashboard')" class="back-button">← Back</button>
        </div>
        <button onclick="openIDScannerModal()" class="submit-button">Scan ID with Scanner</button>
        <div style="margin-top:14px;">
          <h3>Your ID Uploads</h3>
          <div id="idVerificationStatus" style="margin-top:8px;"></div>
        </div>
      </div>

      <div id="profile" class="content-page">
        <div class="page-header">
          <h2>Profile</h2>
          <button onclick="showPage('clientDashboard')" class="back-button">← Back</button>
        </div>
        <div class="user-profile-section">
          <div class="profile-header">
            <div style="display:flex; gap:16px; align-items:center;">
              <div style="position:relative;">
                <div id="profileAvatar" class="profile-avatar" style="width:120px; height:120px; border-radius:999px; overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:40px;">
                  <img id="profileImagePreview" src="" alt="Profile photo" style="width:120px; height:120px; object-fit:cover; display:block;" />
                </div>
                <input type="file" id="profilePicInput" accept="image/*" style="display:none;" onchange="clientDashboard.handleProfilePicChange(event)" />
                <button class="btn-secondary" style="position:absolute; right:-8px; bottom:-8px;" onclick="document.getElementById('profilePicInput').click()">Edit</button>
              </div>
              <div class="profile-info" style="flex:1">
                <h3 id="profileDisplayName">-</h3>
                <p id="profileTagline" style="font-size:13px; color:#666; margin:6px 0">-</p>
                <div style="display:flex; gap:10px; align-items:center; margin-top:8px;">
                  <div id="verifiedBadge" class="detection-badge" style="display:none">Verified</div>
                  <div id="membershipBadge" class="origin-badge" style="background:#7b61ff; padding:6px 10px; font-size:12px;">Member</div>
                </div>
              </div>
            </div>
            <div style="margin-left:auto;">
              <button id="editProfileBtn" class="btn-primary" onclick="clientDashboard.toggleEditProfile(true)">Edit Profile</button>
            </div>
          </div>

          <div id="profileBody" style="display:grid; grid-template-columns: 1fr 1fr; gap:18px; margin-top:18px;">
            <div>
              <div style="padding:16px; border-radius:8px; border:1px solid var(--border-gray); background:var(--white); margin-bottom:14px;">
                <h3 style="margin-top:0">About</h3>
                <div id="aboutView">
                  <p><strong>Name:</strong> <span id="profileFullName">-</span></p>
                  <p><strong>Email:</strong> <span id="profileEmail">-</span></p>
                  <p><strong>Phone:</strong> <span id="profilePhone">-</span></p>
                  <p id="profileBio" style="margin-top:8px; color:#666">-</p>
                </div>
                <div id="aboutEdit" style="display:none; margin-top:8px;">
                  <div class="form-input-group"><label class="form-label">Display Name</label><input id="editDisplayName" class="form-input" /></div>
                  <div class="form-input-group"><label class="form-label">Tagline</label><input id="editTagline" class="form-input" /></div>
                  <div class="form-input-group"><label class="form-label">Bio</label><textarea id="editBio" class="form-input"></textarea></div>
                  <div class="form-input-group"><label class="form-label">Location</label><input id="editLocation" class="form-input" /></div>
                  <div style="display:flex; gap:8px; justify-content:flex-end;"><button class="btn-secondary" onclick="clientDashboard.toggleEditProfile(false)">Cancel</button><button class="btn-primary" onclick="clientDashboard.saveProfile()">Save</button></div>
                </div>
              </div>

              <div style="padding:16px; border-radius:8px; border:1px solid var(--border-gray); background:var(--white);">
                <h3 style="margin-top:0">Achievements</h3>
                <div id="profileAchievements" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;"></div>
              </div>
            </div>

            <div>
              <div style="padding:16px; border-radius:8px; border:1px solid var(--border-gray); background:var(--white); margin-bottom:14px;">
                <h3 style="margin-top:0">Activity Timeline</h3>
                <div id="profileTimeline" style="margin-top:8px; max-height:360px; overflow:auto;"></div>
              </div>

              <div style="padding:16px; border-radius:8px; border:1px solid var(--border-gray); background:var(--white);">
                <h3 style="margin-top:0">Payment & Booking Summary</h3>
                <div id="profileSummary" style="margin-top:8px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="viewRentals" class="content-page">
        <div class="page-header">
          <h2>Rental History</h2>
          <button onclick="showPage('clientDashboard')" class="back-button">← Back</button>
        </div>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
          <label for="rentalFilter" style="font-weight:600;">Filter:</label>
          <select id="rentalFilter" onchange="clientDashboard.loadRentals()" class="form-input" style="max-width:220px;">
            <option value="all">All</option>
            <option value="last7">Past 7 days</option>
            <option value="last30">Past 30 days</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Renter</th>
              <th>Booking ID</th>
              <th>Vehicle</th>
              <th>Pick-up Date</th>
              <th>Return Date</th>
              <th>Cost</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="rentalsBody"></tbody>
        </table>
      </div>

      <div id="vehicleDetails" class="content-page" style="display:none;">
        <div class="page-header">
          <h2>Vehicle Details</h2>
          <button onclick="showPage('browseVehicles')" class="back-button">← Back</button>
        </div>
        <div id="vehicleDetailsContent"></div>
      </div>

      <div id="makePayment" class="content-page">
        <div class="page-header">
          <h2>Make Payment</h2>
          <button onclick="showPage('clientDashboard')" class="back-button">← Back</button>
        </div>
        <form id="paymentForm" onsubmit="handlePayment(event)" class="form-section">
          <div class="form-input-group">
            <label for="paymentBookingId" class="form-label">Booking ID</label>
            <input type="text" id="paymentBookingId" class="form-input" placeholder="Enter booking ID" required>
          </div>
          <div class="form-input-group">
            <label for="paymentAmount" class="form-label">Amount</label>
            <input type="number" id="paymentAmount" class="form-input" step="0.01" placeholder="Amount to pay" required>
          </div>
          <div class="form-input-group">
            <label for="paymentMethod" class="form-label">Payment Method</label>
            <select id="paymentMethod" class="form-input" required>
              <option value="gcash">GCash</option>
              <option value="credit-card">Credit Card</option>
              <option value="debit-card">Debit Card</option>
            </select>
          </div>
          <button type="submit" class="submit-button">Process Payment</button>
        </form>
      </div>
    `
    this.loadVehicles()
    this.loadBookings()
    this.loadRentals()
    this.loadVerifiedIDs()
    this.loadProfile()
  },

  loadVehicles: () => {
    const vehiclesGrid = document.getElementById("vehiclesGrid")
    const vehicles = window.backend.getAvailableVehicles()

    vehiclesGrid.innerHTML = vehicles
      .map(
        (vehicle) => `
        <div class="vehicle-card">
          <div class="vehicle-image">${vehicle.image}</div>
          <div class="vehicle-info">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
              <h3 style="margin:0">${vehicle.make} ${vehicle.model}</h3>
              <div class="origin-badge">${(vehicle.origin || 'unknown').toUpperCase()}</div>
            </div>
            <div class="vehicle-price">$${vehicle.price}/day</div>
            <div class="vehicle-details">
              <p>License: ${vehicle.plate}</p>
              <p>Status: ${vehicle.available ? "Available" : "Unavailable"}</p>
            </div>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button class="book-button" onclick="showPage('makeBooking')">Book Now</button>
              <button class="book-button" onclick="clientDashboard.showVehicleDetails(${vehicle.id})">View Details</button>
            </div>
          </div>
        </div>
      `,
      )
      .join("")

    const bookingVehicle = document.getElementById("bookingVehicle")
    if (bookingVehicle) {
      bookingVehicle.innerHTML =
        "<option>Select a vehicle</option>" +
        window.backend
          .getAvailableVehicles()
          .map((v) => `<option value="${v.id}">${v.make} ${v.model} - $${v.price}/day</option>`)
          .join("")
    }
  },

  loadBookings: () => {
    const bookingsList = document.getElementById("bookingsList")
    const bookings = window.backend.getBookings()
    const pendingReqs = (window.backend.getCancellationRequests) ? window.backend.getCancellationRequests('pending') : []
    const pendingMap = {}
    pendingReqs.forEach(r => { if (r && r.bookingId) pendingMap[r.bookingId] = r })

    bookingsList.innerHTML = bookings
      .map((booking) => {
        const vehicle = window.backend.getVehicle(booking.vehicleId)
        return `
        <div class="booking-card">
          <div class="booking-header">
            <h3>Booking #${booking.id}</h3>
            <span class="status-badge ${booking.status}">${booking.status.toUpperCase()}</span>
          </div>
          <p><strong>Vehicle:</strong> ${vehicle.make} ${vehicle.model}</p>
          <p><strong>Dates:</strong> ${booking.pickupDate} to ${booking.returnDate}</p>
          <p><strong>Total Cost:</strong> $${booking.cost || "TBD"}</p>
          ${booking.status !== "cancelled" ? `<button class="cancel-booking-button" onclick="handleCancelBooking('${booking.id}')">Cancel Booking</button>` : ""}
          ${pendingMap[booking.id] ? `<div style="margin-top:8px; color:#b26900; font-size:13px;">Cancellation request: <strong>Pending</strong></div>` : ''}
        </div>
      `
      })
      .join("")
  },

  loadRentals: (filter) => {
    const rentalsBody = document.getElementById("rentalsBody")
    if (!rentalsBody) return
    const sel = filter || (document.getElementById('rentalFilter') ? document.getElementById('rentalFilter').value : 'all')
    let bookings = window.backend.getBookings()

    // compute date range
    if (sel && sel !== 'all') {
      const now = new Date()
      let start = new Date(0)
      if (sel === 'last7') {
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      } else if (sel === 'last30') {
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      } else if (sel === 'thisMonth') {
        start = new Date(now.getFullYear(), now.getMonth(), 1)
      }
      const startISO = start.toISOString().split('T')[0]
      const endISO = now.toISOString().split('T')[0]
      // try backend helper if present
      if (window.backend.getBookingsInRange) bookings = window.backend.getBookingsInRange(startISO, endISO)
      else bookings = bookings.filter(b => new Date(b.pickupDate) >= new Date(startISO) && new Date(b.pickupDate) <= new Date(endISO))
    }

    rentalsBody.innerHTML = bookings
      .map((booking) => {
        const vehicle = window.backend.getVehicle(booking.vehicleId) || { make: '?', model: '?' }
        return `
        <tr>
          <td>${booking.renter || booking.clientName || 'Unknown'}</td>
          <td>${booking.id}</td>
          <td>${vehicle.make} ${vehicle.model}</td>
          <td>${booking.pickupDate}</td>
          <td>${booking.returnDate}</td>
          <td>$${booking.cost || "N/A"}</td>
          <td><span class="status-badge ${booking.status}">${booking.status.toUpperCase()}</span></td>
        </tr>
      `
      })
      .join("")
  },

  loadVerifiedIDs: () => {
    const container = document.getElementById('idVerificationStatus')
    if (!container) return
    const user = (window.auth && window.auth.currentUser) ? window.auth.currentUser : null
    const records = window.backend.getVerifiedIDsForUser ? window.backend.getVerifiedIDsForUser(user) : []
    if (!records || !records.length) {
      container.innerHTML = '<div style="color:#666">No ID uploads yet.</div>'
      return
    }
    container.innerHTML = records.map(r => `
      <div style="padding:8px; border:1px solid var(--border-gray); border-radius:6px; margin-bottom:8px;">
        <div><strong>ID:</strong> ${r.id || ''} <span style="float:right;">Status: <strong>${r.status || 'pending'}</strong></span></div>
        <div style="margin-top:6px;"><strong>Uploaded:</strong> ${r.uploadedAt ? new Date(r.uploadedAt).toLocaleString() : '-'}</div>
        <div style="margin-top:6px;"><strong>Matched:</strong> ${r.licenseNumber || r.name || '-'}</div>
      </div>
    `).join('')
  },

  loadProfile: () => {
    const nameEl = document.getElementById('profileFullName')
    const phoneEl = document.getElementById('profilePhone')
    const addrEl = document.getElementById('profileAddress')
    const dlEl = document.getElementById('profileDL')
    const bookingsEl = document.getElementById('profileBookingHistory')
    const paymentsEl = document.getElementById('profilePaymentHistory')

    const user = (window.auth && window.auth.currentUser) ? window.auth.currentUser : null
    if (nameEl) nameEl.textContent = user || 'Guest'
    if (phoneEl) phoneEl.textContent = '-' 
    if (addrEl) addrEl.textContent = '-' 
    // load profile pic from localStorage if available
    try {
      const imgEl = document.getElementById('profileImagePreview')
      const key = user ? ('profilePic:' + user) : null
      const dataUrl = key ? localStorage.getItem(key) : null
      if (imgEl && dataUrl) {
        imgEl.src = dataUrl
      } else if (imgEl) {
        imgEl.src = ''
      }
    } catch (e) {}

    // Booking history for user
    const allBookings = window.backend.getBookings()
    const userBookings = allBookings.filter(b => (b.renter || b.clientName) === user)
    if (!bookingsEl) return
    if (!userBookings.length) {
      bookingsEl.innerHTML = '<div style="color:#666">No bookings yet.</div>'
    } else {
      bookingsEl.innerHTML = userBookings.map(b => {
        const v = window.backend.getVehicle(b.vehicleId) || { make: '?', model: '?' }
        return `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-gray);"><div><strong>${v.make} ${v.model}</strong><div style="font-size:13px;color:#666">${b.pickupDate} → ${b.returnDate}</div></div><div style="text-align:right">${b.status === 'confirmed' ? '<span class="status-badge confirmed">CONFIRMED</span>' : '<span class="status-badge pending">'+(b.status||'PENDING')+'</span>'}<div style="font-weight:700; margin-top:6px">$${b.cost || 'N/A'}</div></div></div>`
      }).join('')
    }

    // Payment history for user (aggregate txs for user's bookings)
    const txs = window.backend.paymentTransactions || []
    const userBookingIds = userBookings.map(b => b.id)
    const userTxs = txs.filter(t => userBookingIds.includes(t.bookingId))
    if (!paymentsEl) return
    if (!userTxs.length) {
      paymentsEl.innerHTML = '<div style="color:#666">No payments yet.</div>'
    } else {
      paymentsEl.innerHTML = userTxs.map(t => `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-gray);"><div><div style="font-weight:700">${t.method.toUpperCase()}</div><div style="font-size:13px;color:#666">${new Date(t.date).toLocaleString()}</div></div><div style="text-align:right">₱${t.amount}<div style="font-size:12px;color:#666">Ref: ${t.reference || t.id}</div></div></div>`).join('')
    }
  },

  handleProfilePicChange: (event) => {
    const file = event.target.files && event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      const user = (window.auth && window.auth.currentUser) ? window.auth.currentUser : null
      try {
        if (user) localStorage.setItem('profilePic:' + user, dataUrl)
      } catch (err) {
        console.warn('Unable to save profile pic', err)
      }
      const imgEl = document.getElementById('profileImagePreview')
      if (imgEl) imgEl.src = dataUrl
    }
    reader.readAsDataURL(file)
  },

  // Show vehicle details and rental history for a vehicle
  showVehicleDetails: (vehicleId) => {
    const page = document.getElementById('vehicleDetails')
    const container = document.getElementById('vehicleDetailsContent')
    if (!page || !container) return
    // try backend helper
    let data = null
    if (window.backend.getVehicleHistory) data = window.backend.getVehicleHistory(vehicleId)
    else {
      const vehicle = window.backend.getVehicle(vehicleId)
      const history = window.backend.getBookings().filter(b => Number(b.vehicleId) === Number(vehicleId)).map(b => ({ id: b.id, renter: b.renter || b.clientName, pickupDate: b.pickupDate, returnDate: b.returnDate, status: b.status }))
      data = { vehicle: vehicle, history: history }
    }

    const v = data.vehicle || { make: '?', model: '?', plate: '', origin: '' }
    container.innerHTML = `
      <div style="display:flex; gap:18px;">
        <div style="flex:0 0 160px;"><div style="font-size:48px">${v.image || ''}</div><div style="margin-top:8px;"><strong>${v.make} ${v.model}</strong></div><div>Plate: ${v.plate}</div><div>Origin: ${v.origin || 'unknown'}</div></div>
        <div style="flex:1 1 auto;">
          <h3>Rental History</h3>
          <div id="vehicleHistoryList">
            ${data.history && data.history.length ? data.history.map(h => (`<div style="padding:8px; border-bottom:1px solid var(--border-gray);"><strong>${h.id}</strong> — ${h.renter} — ${h.pickupDate} to ${h.returnDate} — <em>${h.status}</em></div>`)).join('') : '<div style="color:#666">No rental history for this vehicle.</div>'}
          </div>
        </div>
      </div>
    `

    // show vehicle details page and hide others
    showPage('vehicleDetails')
  },
}

function showPage(pageId) {
  const contentPages = document.querySelectorAll(".content-page")
  contentPages.forEach((page) => {
    page.style.display = page.id === pageId ? "block" : "none"
  })
}

function handleBooking(event) {
  event.preventDefault()
  const vehicleId = document.getElementById("bookingVehicle").value
  const pickupDate = document.getElementById("pickupDate").value
  const returnDate = document.getElementById("returnDate").value

  if (vehicleId && pickupDate && returnDate) {
    const booking = window.backend.createBooking(vehicleId, window.auth.currentUser, pickupDate, returnDate)
    alert("Booking created successfully! Booking ID: " + booking.id)
    document.getElementById("bookingForm").reset()
    clientDashboard.loadBookings()
    clientDashboard.loadRentals()
    showPage("viewBookings")
  }
}

function handleCancelBooking(bookingId) {
  const reason = prompt('Please enter a reason for cancellation (optional):', '')
  if (reason === null) return // user cancelled prompt
  const req = window.backend.requestCancellation ? window.backend.requestCancellation(bookingId, window.auth && window.auth.currentUser ? window.auth.currentUser : null, reason) : null
  if (req) {
    alert('Cancellation request submitted and is pending review.')
  } else {
    // fallback to immediate cancel if backend doesn't support requests
    if (confirm('Submit failed — cancel immediately instead?')) {
      window.backend.cancelBooking(bookingId)
      alert('Booking cancelled successfully!')
    }
  }
  clientDashboard.loadBookings()
}

function handlePayment(event) {
  event.preventDefault()
  const bookingId = document.getElementById("paymentBookingId").value
  const amount = document.getElementById("paymentAmount").value
  const method = document.getElementById("paymentMethod").value

  if (method === "gcash") {
    openGCashPaymentModal(bookingId, amount)
  } else {
    alert("Payment of $" + amount + " processed successfully!")
    document.getElementById("paymentForm").reset()
  }
}

function openGCashPaymentModal(bookingId, amount) {
  alert("Open GCash Payment Modal for Booking ID: " + bookingId + " and Amount: $" + amount)
}

window.clientDashboard = clientDashboard
