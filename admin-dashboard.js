const adminDashboard = {
  navItems: [
    { label: "Dashboard", id: "adminDashboard" },
    { label: "Manage Vehicles", id: "manageInventory" },
    { label: "Manage Users", id: "manageUsers" },
    { label: "Pricing & Billing", id: "managePricing" },
    { label: "Oversee Reservations", id: "overseeReservations" },
    { label: "Generate Reports", id: "generateReports" },
    { label: "Vehicle Histories", id: "viewVehicleHistory" },
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
      <div id="adminDashboard" class="content-page active">
        <div class="dashboard-grid">
          <div class="quick-card" onclick="showPage('manageInventory')">
            <div class="card-icon">🚗</div>
            <h3>Manage Vehicles</h3>
            <p>Add, update, or remove vehicles</p>
          </div>
          <div class="quick-card" onclick="showPage('manageUsers')">
            <div class="card-icon">👥</div>
            <h3>Manage Users</h3>
            <p>User account management</p>
          </div>
          <div class="quick-card" onclick="showPage('managePricing')">
            <div class="card-icon">💰</div>
            <h3>Pricing & Billing</h3>
            <p>Set rates and billing</p>
          </div>
          <div class="quick-card" onclick="showPage('overseeReservations')">
            <div class="card-icon">📅</div>
            <h3>Oversee Reservations</h3>
            <p>Monitor all bookings</p>
          </div>
          <div class="quick-card" onclick="showPage('generateReports')">
            <div class="card-icon">📊</div>
            <h3>Generate Reports</h3>
            <p>Create system reports</p>
          </div>
          <div class="quick-card" onclick="showPage('viewVehicleHistory')">
            <div class="card-icon">📜</div>
            <h3>Vehicle Histories</h3>
            <p>Comprehensive vehicle data</p>
          </div>
        </div>
      </div>

      <div id="manageInventory" class="content-page">
        <div class="page-header">
          <h2>Manage Vehicle Inventory</h2>
          <button onclick="showPage('adminDashboard')" class="back-button">← Back</button>
        </div>
        <form id="inventoryForm" onsubmit="handleAddVehicle(event)" class="form-section">
          <div class="form-row">
            <div class="form-input-group">
              <label for="vehicleMake" class="form-label">Vehicle Make</label>
              <input type="text" id="vehicleMake" class="form-input" placeholder="e.g., Honda" required>
            </div>
            <div class="form-input-group">
              <label for="vehicleModel" class="form-label">Model</label>
              <input type="text" id="vehicleModel" class="form-input" placeholder="e.g., Civic" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-input-group">
              <label for="vehiclePlate" class="form-label">License Plate</label>
              <input type="text" id="vehiclePlate" class="form-input" placeholder="ABC-123" required>
            </div>
            <div class="form-input-group">
              <label for="vehiclePrice" class="form-label">Daily Rate</label>
              <input type="number" id="vehiclePrice" class="form-input" step="0.01" placeholder="$50" required>
            </div>
          </div>
          <button type="submit" class="submit-button">Add Vehicle</button>
        </form>
        <div id="inventoryList"></div>
      </div>

      <div id="manageUsers" class="content-page">
        <div class="page-header">
          <h2>Manage Users</h2>
          <button onclick="showPage('adminDashboard')" class="back-button">← Back</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="usersBody"></tbody>
        </table>
      </div>

      <div id="managePricing" class="content-page">
        <div class="page-header">
          <h2>Manage Pricing & Billing</h2>
          <button onclick="showPage('adminDashboard')" class="back-button">← Back</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Vehicle Type</th>
              <th>Daily Rate</th>
              <th>Weekly Rate</th>
              <th>Monthly Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="pricingBody"></tbody>
        </table>
      </div>

      <div id="overseeReservations" class="content-page">
        <div class="page-header">
          <h2>Oversee All Reservations</h2>
          <button onclick="showPage('adminDashboard')" class="back-button">← Back</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Client</th>
              <th>Vehicle</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="reservationsBody"></tbody>
        </table>
      </div>

      <div id="generateReports" class="content-page">
        <div class="page-header">
          <h2>Generate Reports</h2>
          <button onclick="showPage('adminDashboard')" class="back-button">← Back</button>
        </div>
        <div class="dashboard-grid">
          <div class="quick-card" onclick="generateVehicleReport()">
            <div class="card-icon">🚗</div>
            <h3>Vehicle Report</h3>
            <p>Generate vehicle statistics</p>
          </div>
          <div class="quick-card" onclick="generateRevenueReport()">
            <div class="card-icon">💰</div>
            <h3>Revenue Report</h3>
            <p>Financial summary</p>
          </div>
          <div class="quick-card" onclick="generateBookingReport()">
            <div class="card-icon">📅</div>
            <h3>Booking Report</h3>
            <p>Booking statistics</p>
          </div>
        </div>
      </div>

      <div id="viewVehicleHistory" class="content-page">
        <div class="page-header">
          <h2>Comprehensive Vehicle Histories</h2>
          <button onclick="showPage('adminDashboard')" class="back-button">← Back</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Make & Model</th>
              <th>License Plate</th>
              <th>Status</th>
              <th>Total Bookings</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody id="vehicleHistoryBody"></tbody>
        </table>
      </div>
    `
    this.loadData()
  },

  loadData: function () {
    this.loadInventory()
    this.loadUsers()
    this.loadPricing()
    this.loadReservations()
    this.loadVehicleHistory()
  },

  loadInventory: () => {
    const inventoryList = document.getElementById("inventoryList")
    const vehicles = window.backend.getVehicles()

    inventoryList.innerHTML = vehicles
      .map(
        (vehicle) => `
        <div class="booking-card">
          <div class="booking-header">
            <h3>${vehicle.make} ${vehicle.model}</h3>
            <span class="status-badge ${vehicle.available ? "confirmed" : "pending"}">
              ${vehicle.available ? "Available" : "In Use"}
            </span>
          </div>
          <p><strong>License:</strong> ${vehicle.plate}</p>
          <p><strong>Daily Rate:</strong> $${vehicle.price}</p>
          <div class="action-buttons">
            <button class="edit-btn" onclick="editVehicle(${vehicle.id})">Edit</button>
            <button class="delete-btn" onclick="deleteVehicle(${vehicle.id})">Delete</button>
          </div>
        </div>
      `,
      )
      .join("")
  },

  loadUsers: () => {
    const usersBody = document.getElementById("usersBody")
    const users = window.backend.getUsers()

    usersBody.innerHTML = users
      .map(
        (user) => `
        <tr>
          <td>U${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
          <td><span class="status-badge confirmed">${user.status}</span></td>
          <td>
            <div class="action-buttons">
              <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
              <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </div>
          </td>
        </tr>
      `,
      )
      .join("")
  },

  loadPricing: () => {
    const pricingBody = document.getElementById("pricingBody")
    const pricing = window.backend.getPricing()

    pricingBody.innerHTML = pricing
      .map(
        (price) => `
        <tr>
          <td>${price.vehicleType}</td>
          <td>$${price.dailyRate}</td>
          <td>$${price.weeklyRate}</td>
          <td>$${price.monthlyRate}</td>
          <td>
            <button class="edit-btn" onclick="editPricing(${price.id})">Edit</button>
          </td>
        </tr>
      `,
      )
      .join("")
  },

  loadReservations: () => {
    const reservationsBody = document.getElementById("reservationsBody")
    const bookings = window.backend.getBookings()

    reservationsBody.innerHTML = bookings
      .map((booking) => {
        const vehicle = window.backend.getVehicle(booking.vehicleId)
        return `
        <tr>
          <td>${booking.id}</td>
          <td>${booking.clientName}</td>
          <td>${vehicle.make} ${vehicle.model}</td>
          <td>${booking.pickupDate} to ${booking.returnDate}</td>
          <td><span class="status-badge ${booking.status}">${booking.status.toUpperCase()}</span></td>
          <td>$${booking.cost || "TBD"}</td>
          <td>
            <button class="view-btn" onclick="viewBookingDetails('${booking.id}')">View</button>
          </td>
        </tr>
      `
      })
      .join("")
  },

  loadVehicleHistory: () => {
    const vehicleHistoryBody = document.getElementById("vehicleHistoryBody")
    const vehicles = window.backend.getVehicles()

    vehicleHistoryBody.innerHTML = vehicles
      .map((vehicle) => {
        const vehicleBookings = window.backend.getBookings().filter((b) => b.vehicleId === vehicle.id)
        return `
        <tr>
          <td>V${vehicle.id}</td>
          <td>${vehicle.make} ${vehicle.model}</td>
          <td>${vehicle.plate}</td>
          <td>${vehicle.available ? "Available" : "In Use"}</td>
          <td>${vehicleBookings.length}</td>
          <td>$${vehicleBookings.reduce((sum, b) => sum + (b.cost || 0), 0)}</td>
        </tr>
      `
      })
      .join("")
  },
}

function handleAddVehicle(event) {
  event.preventDefault()
  const make = document.getElementById("vehicleMake").value
  const model = document.getElementById("vehicleModel").value
  const plate = document.getElementById("vehiclePlate").value
  const price = document.getElementById("vehiclePrice").value

  if (make && model && plate && price) {
    window.backend.addVehicle(make, model, plate, Number.parseFloat(price))
    alert("Vehicle added successfully!")
    document.getElementById("inventoryForm").reset()
    adminDashboard.loadInventory()
  }
}

function editVehicle(vehicleId) {
  alert("Edit functionality for vehicle " + vehicleId)
}

function deleteVehicle(vehicleId) {
  if (confirm("Are you sure you want to delete this vehicle?")) {
    window.backend.deleteVehicle(vehicleId)
    alert("Vehicle deleted successfully!")
    adminDashboard.loadInventory()
  }
}

function editUser(userId) {
  alert("Edit functionality for user " + userId)
}

function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    window.backend.deleteUser(userId)
    alert("User deleted successfully!")
    adminDashboard.loadUsers()
  }
}

function editPricing(pricingId) {
  alert("Edit functionality for pricing " + pricingId)
}

function viewBookingDetails(bookingId) {
  alert("Viewing details for booking: " + bookingId)
}

function generateVehicleReport() {
  alert("Generating Vehicle Report...")
}

function generateRevenueReport() {
  alert("Generating Revenue Report...")
}

function generateBookingReport() {
  alert("Generating Booking Report...")
}

window.adminDashboard = adminDashboard
