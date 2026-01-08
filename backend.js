const backend = {
  vehicles: [
    { id: 1, make: "Honda", model: "Civic", plate: "HC-001", price: 50, available: true, image: "🚗", origin: "brandnew" },
    { id: 2, make: "Toyota", model: "Camry", plate: "TC-002", price: 60, available: true, image: "🚙", origin: "pawn" },
    { id: 3, make: "Ford", model: "Explorer", plate: "FE-003", price: 80, available: false, image: "🚕", origin: "pawn" },
    { id: 4, make: "BMW", model: "3 Series", plate: "BM-004", price: 100, available: true, image: "🏎️", origin: "brandnew" },
    { id: 5, make: "Mercedes", model: "C-Class", plate: "MC-005", price: 120, available: true, image: "✨", origin: "brandnew" },
  ],

  bookings: [
    {
      id: "BK001",
      vehicleId: 1,
      clientName: "John Doe",
      renter: "John Doe",
      pickupDate: "2025-01-15",
      returnDate: "2025-01-20",
      cost: 300,
      status: "confirmed",
      driverId: null,
      paymentMethod: null,
      paymentRef: null,
      paidAmount: 0,
      paymentDate: null,
      createdAt: "2025-01-10T08:00:00.000Z",
    },
  ],

  users: [
    { id: 1, name: "John Doe", email: "john@example.com", role: "client", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin", status: "active" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "staff", status: "active" },
    { id: 4, name: "Sarah Davis", email: "sarah@example.com", role: "driver", status: "active" },
  ],

  pricing: [
    { id: 1, vehicleType: "Economy", dailyRate: 50, weeklyRate: 300, monthlyRate: 1000 },
    { id: 2, vehicleType: "Premium", dailyRate: 100, weeklyRate: 600, monthlyRate: 2000 },
  ],

  drivers: [
    { id: 1, name: "Sarah Davis", license: "DL-001", status: "available", assignedBookings: [] },
    { id: 2, name: "Tom Wilson", license: "DL-002", status: "on-duty", assignedBookings: ["BK001"] },
  ],

  verifiedIDs: [],
  paymentTransactions: [],
  cancellationRequests: [],

  getVehicles: function () {
    return this.vehicles
  },

  getAvailableVehicles: function () {
    return this.vehicles.filter((v) => v.available)
  },

  getVehicle: function (id) {
    return this.vehicles.find((v) => v.id === id)
  },

  addVehicle: function (make, model, plate, price) {
    const vehicle = {
      id: this.vehicles.length + 1,
      make: make,
      model: model,
      plate: plate,
      price: price,
      available: true,
      image: "🚗",
    }
    this.vehicles.push(vehicle)
    return vehicle
  },

  deleteVehicle: function (id) {
    const index = this.vehicles.findIndex((v) => v.id === id)
    if (index > -1) {
      this.vehicles.splice(index, 1)
      return true
    }
    return false
  },

  getBookings: function () {
    return this.bookings
  },

  // Payment recording helper
  recordPaymentTransaction: function (bookingId, method, amount, ref) {
    const tx = {
      id: 'TX' + String(this.paymentTransactions.length + 1).padStart(4, '0'),
      bookingId: bookingId,
      method: method,
      amount: amount,
      reference: ref || null,
      date: new Date().toISOString(),
    }
    this.paymentTransactions.push(tx)
    // mark booking as paid where applicable
    const booking = this.bookings.find((b) => b.id === bookingId)
    if (booking) {
      booking.paidAmount = (booking.paidAmount || 0) + Number(amount)
      booking.paymentDate = tx.date
      booking.paymentRef = ref || tx.id
      booking.paymentMethod = method
      if (booking.paidAmount >= booking.cost) booking.status = 'confirmed'
    }
    return tx
  },

  createBooking: function (vehicleId, clientName, pickupDate, returnDate, driverId = null) {
    const vehicle = this.getVehicle(vehicleId)
    if (!vehicle) return null

    const numDays = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))
    const cost = vehicle.price * Math.max(numDays, 1)

    const booking = {
      id: "BK" + String(this.bookings.length + 1).padStart(3, "0"),
      vehicleId: Number.parseInt(vehicleId),
      clientName: clientName,
      renter: clientName,
      pickupDate: pickupDate,
      returnDate: returnDate,
      status: "pending",
      driverId: driverId,
      cost: cost,
      paymentMethod: null,
      paymentRef: null,
      paidAmount: 0,
      paymentDate: null,
      createdAt: new Date().toISOString(),
    }
    this.bookings.push(booking)
    return booking
  },

  // Return bookings whose pickupDate falls within [startISO, endISO]
  getBookingsInRange: function (startISO, endISO) {
    const start = new Date(startISO)
    const end = new Date(endISO)
    return this.bookings.filter((b) => {
      const p = new Date(b.pickupDate)
      return p >= start && p <= end
    })
  },

  // Return booking history for a vehicle with renter info
  getVehicleHistory: function (vehicleId) {
    const vid = Number(vehicleId)
    const vehicle = this.getVehicle(vid)
    const history = this.bookings
      .filter((b) => Number(b.vehicleId) === vid)
      .map((b) => ({ id: b.id, renter: b.renter || b.clientName, pickupDate: b.pickupDate, returnDate: b.returnDate, status: b.status }))
      .sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate))
    return { vehicle: vehicle, history: history }
  },

  // Cancellation workflow
  requestCancellation: function (bookingId, userId, reason) {
    const booking = this.bookings.find((b) => b.id === bookingId)
    if (!booking) return null
    const req = {
      id: 'CR' + String(this.cancellationRequests.length + 1).padStart(4, '0'),
      bookingId: bookingId,
      requestedBy: userId || null,
      reason: reason || '',
      status: 'pending',
      requestedAt: new Date().toISOString(),
      resolvedAt: null,
      resolvedBy: null,
    }
    this.cancellationRequests.push(req)
    return req
  },

  approveCancellation: function (cancellationRequestId, approverId) {
    const req = this.cancellationRequests.find((r) => r.id === cancellationRequestId)
    if (!req) return false
    req.status = 'approved'
    req.resolvedAt = new Date().toISOString()
    req.resolvedBy = approverId || null
    // mark booking cancelled
    const booking = this.bookings.find((b) => b.id === req.bookingId)
    if (booking) booking.status = 'cancelled'
    return true
  },

  denyCancellation: function (cancellationRequestId, approverId) {
    const req = this.cancellationRequests.find((r) => r.id === cancellationRequestId)
    if (!req) return false
    req.status = 'denied'
    req.resolvedAt = new Date().toISOString()
    req.resolvedBy = approverId || null
    return true
  },

  getCancellationRequests: function (status) {
    if (!status) return this.cancellationRequests
    return this.cancellationRequests.filter((r) => r.status === status)
  },

  cancelBooking: function (bookingId) {
    const booking = this.bookings.find((b) => b.id === bookingId)
    if (booking) {
      booking.status = "cancelled"
      return true
    }
    return false
  },

  getUsers: function () {
    return this.users
  },

  getUsersByRole: function (role) {
    return this.users.filter((u) => u.role === role)
  },

  addUser: function (name, email, role) {
    const user = {
      id: this.users.length + 1,
      name: name,
      email: email,
      role: role,
      status: "active",
    }
    this.users.push(user)
    return user
  },

  deleteUser: function (id) {
    const index = this.users.findIndex((u) => u.id === id)
    if (index > -1) {
      this.users.splice(index, 1)
      return true
    }
    return false
  },

  getDrivers: function () {
    return this.drivers
  },

  assignDriver: function (bookingId, driverId) {
    const booking = this.bookings.find((b) => b.id === bookingId)
    const driver = this.drivers.find((d) => d.id === driverId)
    if (booking && driver) {
      booking.driverId = driverId
      driver.assignedBookings.push(bookingId)
      driver.status = "on-duty"
      return true
    }
    return false
  },

  getPricing: function () {
    return this.pricing
  },

  updatePricing: function (id, dailyRate, weeklyRate, monthlyRate) {
    const pricing = this.pricing.find((p) => p.id === id)
    if (pricing) {
      pricing.dailyRate = dailyRate
      pricing.weeklyRate = weeklyRate
      pricing.monthlyRate = monthlyRate
      return true
    }
    return false
  },

  // ID upload and verification record helpers
  uploadIDForUser: function (userIdentifier, imageData) {
    const rec = {
      id: 'VID' + String(this.verifiedIDs.length + 1).padStart(4, '0'),
      owner: userIdentifier || null,
      imageData: imageData || null,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      verifiedAt: null,
      verifier: null,
      notes: null,
    }
    this.verifiedIDs.push(rec)
    return rec
  },

  setIDVerificationStatus: function (verifiedId, status, verifier, notes) {
    const rec = this.verifiedIDs.find((r) => r.id === verifiedId || r.owner === verifiedId)
    if (!rec) return false
    rec.status = status
    rec.verifier = verifier || null
    rec.notes = notes || null
    rec.verifiedAt = status === 'verified' ? new Date().toISOString() : rec.verifiedAt
    return true
  },

  getVerifiedIDsForUser: function (userIdentifier) {
    return this.verifiedIDs.filter((r) => r.owner === userIdentifier)
  },

  // Update or create a profile for a user (persist in users[] for this simulated backend)
  updateUserProfile: function (userIdentifier, profile) {
    if (!userIdentifier) return false
    const u = this.users.find((x) => x.email === userIdentifier || x.name === userIdentifier || String(x.id) === String(userIdentifier))
    if (u) {
      u.profile = Object.assign({}, u.profile || {}, profile)
      return u
    }
    // if not found, create a lightweight user record
    const newUser = {
      id: this.users.length + 1,
      name: profile.displayName || userIdentifier,
      email: profile.email || userIdentifier,
      role: 'client',
      status: 'active',
      profile: profile,
    }
    this.users.push(newUser)
    return newUser
  },
}

window.backend = backend
