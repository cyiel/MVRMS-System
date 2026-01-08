const driverDashboard = {
  navItems: [
    { label: "Dashboard", id: "driverDashboard" },
    { label: "Assigned Bookings", id: "viewAssignedBookings" },
    { label: "Check In/Out", id: "checkInOut" },
    { label: "Update Profile", id: "updateProfile" },
    { label: "Report Issues", id: "reportIssues" },
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
      <div id="driverDashboard" class="content-page active">
        <div class="dashboard-grid">
          <div class="quick-card" onclick="showPage('viewAssignedBookings')">
            <div class="card-icon">📅</div>
            <h3>Assigned Bookings</h3>
            <p>View your assigned bookings</p>
          </div>
          <div class="quick-card" onclick="showPage('checkInOut')">
            <div class="card-icon">✓</div>
            <h3>Check In/Out</h3>
            <p>Check vehicle in and out</p>
          </div>
          <div class="quick-card" onclick="showPage('updateProfile')">
            <div class="card-icon">👤</div>
            <h3>Update Profile</h3>
            <p>Manage your profile</p>
          </div>
          <div class="quick-card" onclick="showPage('reportIssues')">
            <div class="card-icon">⚠️</div>
            <h3>Report Issues</h3>
            <p>Report vehicle issues</p>
          </div>
        </div>
      </div>

      <div id="viewAssignedBookings" class="content-page">
        <div class="page-header">
          <h2>Your Assigned Bookings</h2>
          <button onclick="showPage('driverDashboard')" class="back-button">← Back</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Client</th>
              <th>Vehicle</th>
              <th>Pick-up Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="driverBookingsBody"></tbody>
        </table>
      </div>

      <div id="checkInOut" class="content-page">
        <div class="page-header">
          <h2>Check Vehicle In/Out</h2>
          <button onclick="showPage('driverDashboard')" class="back-button">← Back</button>
        </div>
        <form id="checkInOutForm" onsubmit="handleCheckInOut(event)" class="form-section">
          <div class="form-input-group">
            <label for="checkBookingId" class="form-label">Booking ID</label>
            <input type="text" id="checkBookingId" class="form-input" placeholder="Enter booking ID" required>
          </div>
          <div class="form-input-group">
            <label for="odometerReading" class="form-label">Odometer Reading</label>
            <input type="number" id="odometerReading" class="form-input" placeholder="Enter current mileage" required>
          </div>
          <div class="form-input-group">
            <label for="vehicleCondition" class="form-label">Vehicle Condition</label>
            <select id="vehicleCondition" class="form-input" required>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Poor</option>
            </select>
          </div>
          <div class="form-input-group">
            <label for="checkType" class="form-label">Check Type</label>
            <select id="checkType" class="form-input" required>
              <option>Check Out</option>
              <option>Check In</option>
            </select>
          </div>
          <button type="submit" class="submit-button">Submit</button>
        </form>
      </div>

      <div id="updateProfile" class="content-page">
        <div class="page-header">
          <h2>Update Your Profile</h2>
          <button onclick="showPage('driverDashboard')" class="back-button">← Back</button>
        </div>
        <form id="profileForm" onsubmit="handleUpdateProfile(event)" class="form-section">
          <div class="form-row">
            <div class="form-input-group">
              <label for="driverName" class="form-label">Full Name</label>
              <input type="text" id="driverName" class="form-input" placeholder="Your name" required>
            </div>
            <div class="form-input-group">
              <label for="driverEmail" class="form-label">Email</label>
              <input type="email" id="driverEmail" class="form-input" placeholder="Your email" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-input-group">
              <label for="driverLicense" class="form-label">Driver License</label>
              <input type="text" id="driverLicense" class="form-input" placeholder="License number" required>
            </div>
            <div class="form-input-group">
              <label for="driverPhone" class="form-label">Phone Number</label>
              <input type="tel" id="driverPhone" class="form-input" placeholder="Your phone" required>
            </div>
          </div>
          <button type="submit" class="submit-button">Update Profile</button>
        </form>
      </div>

      <div id="reportIssues" class="content-page">
        <div class="page-header">
          <h2>Report Vehicle Issues</h2>
          <button onclick="showPage('driverDashboard')" class="back-button">← Back</button>
        </div>
        <form id="issueForm" onsubmit="handleReportIssue(event)" class="form-section">
          <div class="form-input-group">
            <label for="issueBookingId" class="form-label">Booking ID</label>
            <input type="text" id="issueBookingId" class="form-input" placeholder="Enter booking ID" required>
          </div>
          <div class="form-input-group form-row full">
            <label for="issueDescription" class="form-label">Issue Description</label>
            <textarea id="issueDescription" class="form-input" placeholder="Describe the issue..." required></textarea>
          </div>
          <div class="form-input-group">
            <label for="issuePriority" class="form-label">Issue Priority</label>
            <select id="issuePriority" class="form-input" required>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          <button type="submit" class="submit-button">Report Issue</button>
        </form>
      </div>
    `
    this.loadData()
  },

  loadData: () => {
    const driverBookingsBody = document.getElementById("driverBookingsBody")
    const drivers = window.backend.getDrivers()
    const currentDriver = drivers[0]

    const assignedBookingIds = currentDriver.assignedBookings
    const driverBookings = window.backend.getBookings().filter((b) => assignedBookingIds.includes(b.id))

    driverBookingsBody.innerHTML = driverBookings
      .map((booking) => {
        const vehicle = window.backend.getVehicle(booking.vehicleId)
        return `
        <tr>
          <td>${booking.id}</td>
          <td>${booking.clientName}</td>
          <td>${vehicle.make} ${vehicle.model}</td>
          <td>${booking.pickupDate}</td>
          <td>${booking.returnDate}</td>
          <td><span class="status-badge ${booking.status}">${booking.status.toUpperCase()}</span></td>
        </tr>
      `
      })
      .join("")
  },
}

function handleCheckInOut(event) {
  event.preventDefault()
  const checkType = document.getElementById("checkType").value
  alert(`Vehicle ${checkType} recorded successfully!`)
  event.target.reset()
}

function handleUpdateProfile(event) {
  event.preventDefault()
  alert("Profile updated successfully!")
  event.target.reset()
}

function handleReportIssue(event) {
  event.preventDefault()
  alert("Issue reported successfully!")
  event.target.reset()
}

window.driverDashboard = driverDashboard
