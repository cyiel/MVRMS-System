const auth = {
  currentUser: null,
  currentRole: null,
  isLoggedIn: false,

  login: function (username, password, role) {
    if (username && password && role) {
      this.currentUser = username
      this.currentRole = role
      this.isLoggedIn = true
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          username: username,
          role: role,
          loginTime: new Date().toISOString(),
        }),
      )
      return true
    }
    return false
  },

  signup: (fullName, email, phone, password) => {
    if (fullName && email && phone && password) {
      const newUser = {
        fullName: fullName,
        email: email,
        phone: phone,
        password: password,
        registeredDate: new Date().toISOString(),
      }

      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

      // Check if email already exists
      if (users.some((user) => user.email === email)) {
        return { success: false, message: "Email already registered" }
      }

      users.push(newUser)
      localStorage.setItem("registeredUsers", JSON.stringify(users))

      return { success: true, message: "Account created successfully" }
    }
    return { success: false, message: "Please fill in all fields" }
  },

  logout: function () {
    this.currentUser = null
    this.currentRole = null
    this.isLoggedIn = false
    sessionStorage.removeItem("user")
  },

  getCurrentUser: function () {
    const user = sessionStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      this.currentUser = userData.username
      this.currentRole = userData.role
      this.isLoggedIn = true
      return userData
    }
    return null
  },

  checkAuth: function () {
    return this.isLoggedIn || this.getCurrentUser() !== null
  },
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  const signupForm = document.getElementById("signupForm")
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
  }

  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }

  // Check if user is already logged in
  const currentUser = auth.getCurrentUser()
  if (currentUser) {
    showDashboard()
  }
})

function handleLogin(event) {
  event.preventDefault()
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const role = document.getElementById("role").value

  if (!username || !password || !role) {
    alert("Please fill in all fields")
    return
  }

  if (auth.login(username, password, role)) {
    document.getElementById("loginForm").reset()
    showDashboard()
  } else {
    alert("Login failed. Please try again.")
  }
}

function handleSignup(event) {
  event.preventDefault()

  const fullName = document.getElementById("fullName").value.trim()
  const email = document.getElementById("signupEmail").value.trim()
  const phone = document.getElementById("phoneNumber").value.trim()
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const idAgreement = document.getElementById("idAgreement").checked
  const termsAgreement = document.getElementById("termsAgreement").checked

  // Validation
  if (!fullName || !email || !phone || !password || !confirmPassword) {
    alert("Please fill in all fields")
    return
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters long")
    return
  }

  if (!/\d/.test(password)) {
    alert("Password must contain at least 1 number")
    return
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match")
    return
  }

  if (!idAgreement || !termsAgreement) {
    alert("Please agree to both terms and ID verification requirement")
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address")
    return
  }

  const result = auth.signup(fullName, email, phone, password)

  if (result.success) {
    alert("Account created successfully! Please log in with your email.")
    document.getElementById("signupForm").reset()
    switchToLogin()
  } else {
    alert(result.message)
  }
}

function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    auth.logout()
    // ensure only login page is active
    setActivePage('loginPage')
    document.getElementById("contentArea").innerHTML = ""
    switchToLogin()
  }
}

// Ensure only one top-level `.page` has the `active` class.
function setActivePage(pageId) {
  const pages = document.querySelectorAll('.page')
  pages.forEach(p => p.classList.remove('active'))
  const target = document.getElementById(pageId)
  if (target) target.classList.add('active')
}

function switchToSignup() {
  const loginSection = document.getElementById("loginSection")
  const signupSection = document.getElementById("signupSection")

  if (loginSection && signupSection) {
    loginSection.classList.remove("active")
    signupSection.classList.add("active")
  }
}

function switchToLogin() {
  const loginSection = document.getElementById("loginSection")
  const signupSection = document.getElementById("signupSection")

  if (loginSection && signupSection) {
    signupSection.classList.remove("active")
    loginSection.classList.add("active")
  }
}

function showDashboard() {
  // ensure only dashboard is active
  setActivePage('dashboardPage')

  const userRoleDisplay = document.getElementById("userRoleDisplay")
  const currentUserDisplay = document.getElementById("currentUserDisplay")

  userRoleDisplay.textContent = auth.currentRole.toUpperCase()
  currentUserDisplay.textContent = auth.currentUser

  // Initialize the appropriate dashboard
  switch (auth.currentRole) {
    case "client":
      if (window.clientDashboard) {
        window.clientDashboard.init()
      }
      break
    case "admin":
      if (window.adminDashboard) {
        window.adminDashboard.init()
      }
      break
    case "staff":
      if (window.staffDashboard) {
        window.staffDashboard.init()
      }
      break
    case "driver":
      if (window.driverDashboard) {
        window.driverDashboard.init()
      }
      break
  }
}

// Page-level navigation helpers for homepage nav
function goToLoginPage() {
  // switch to login page (single active top page)
  setActivePage('loginPage')
  const loginSection = document.getElementById('loginSection')
  const signupSection = document.getElementById('signupSection')
  if (loginSection && signupSection) {
    loginSection.classList.add('active')
    signupSection.classList.remove('active')
  }
}

function goToSignupPage() {
  // switch to signup view inside login page
  setActivePage('loginPage')
  const loginSection = document.getElementById('loginSection')
  const signupSection = document.getElementById('signupSection')
  if (loginSection && signupSection) {
    loginSection.classList.remove('active')
    signupSection.classList.add('active')
  }
}

function showHome() {
  setActivePage('homePage')
}

function showAbout() {
  alert('Motor Vehicle Rental — About Us (placeholder)')
}
