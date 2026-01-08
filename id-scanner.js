const idScanner = {
  scannedData: null,
  cameraStream: null,
  currentTab: "camera",

  startCamera: function () {
    const video = document.getElementById("videoElement")
    const placeholder = document.getElementById("cameraPlaceholder")

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported on this device")
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        this.cameraStream = stream
        video.srcObject = stream
        video.style.display = "block"
        placeholder.style.display = "none"
        document.getElementById("captureBtn").style.display = "inline-block"
        document.getElementById("stopBtn").style.display = "inline-block"
      })
      .catch((err) => {
        alert("Unable to access camera: " + err.message)
      })
  },

  capturePhoto: function () {
    const video = document.getElementById("videoElement")
    if (!video.srcObject) {
      alert("Camera not active")
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0)

    this.simulateOCRExtraction()
    this.displayScannedData()
  },

  stopCamera: function () {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop())
      this.cameraStream = null
    }
    const video = document.getElementById("videoElement")
    const placeholder = document.getElementById("cameraPlaceholder")
    video.style.display = "none"
    placeholder.style.display = "flex"
    document.getElementById("captureBtn").style.display = "none"
    document.getElementById("stopBtn").style.display = "none"
  },

  handleImageUpload: function (file) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        this.simulateOCRExtraction()
        this.displayScannedData()
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  },

  simulateOCRExtraction: function () {
    this.scannedData = {
      licenseNumber:
        "D" +
        Math.floor(Math.random() * 100000)
          .toString()
          .padStart(5, "0"),
      name: "Sample License Holder",
      expiryDate: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      licenseClass: "non-professional",
    }
  },

  // manual entry removed; keep placeholder method to avoid runtime errors
  getManualData: () => {
    return null
  },

  displayScannedData: function () {
    if (!this.scannedData) return

    document.getElementById("displayLicense").textContent = this.scannedData.licenseNumber
    document.getElementById("displayScannedName").textContent = this.scannedData.name
    document.getElementById("displayScannedExpiry").textContent = this.scannedData.expiryDate
    document.getElementById("displayScannedClass").textContent = this.scannedData.licenseClass

    document.getElementById("scannedDataBox").style.display = "block"
    this.validateLicense()
  },

  validateLicense: function () {
    if (!this.scannedData) return

    const expiryDate = new Date(this.scannedData.expiryDate)
    const today = new Date()
    const isValid = expiryDate > today

    const validationMsg = document.getElementById("validationMsg")
    if (isValid) {
      validationMsg.className = "validation-message valid"
      validationMsg.textContent = "✓ ID is valid"
    } else {
      validationMsg.className = "validation-message invalid"
      validationMsg.textContent = "✗ ID has expired"
    }
  },

  verifyID: function () {
    if (!this.scannedData) {
      alert("No ID data to verify")
      return false
    }
    // Ensure only National ID is accepted
    const rawType = (this.scannedData.licenseClass || this.scannedData.class || this.scannedData.idType || "").toString().toLowerCase()
    const normalized = rawType.replace(/[_\s]/g, '-')
    if (!normalized.includes('national')) {
      alert('Only National ID documents are accepted for verification.')
      return false
    }

    const expiryDate = new Date(this.scannedData.expiryDate)
    const today = new Date()

    if (expiryDate <= today) {
      alert("ID has expired")
      return false
    }

    if (window.backend) {
      window.backend.verifiedIDs = window.backend.verifiedIDs || []
      window.backend.verifiedIDs.push({
        ...this.scannedData,
        verificationTime: new Date(),
      })
    }

    return true
  },

  getScannedData: function () {
    return this.scannedData
  },
}

window.idScanner = idScanner
