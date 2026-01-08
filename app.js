function showPage(pageId) {
  const contentArea = document.getElementById("contentArea")
  const pages = contentArea.querySelectorAll(".content-page")

  pages.forEach((page) => page.classList.remove("active"))

  const targetPage = document.getElementById(pageId)
  if (targetPage) {
    targetPage.classList.add("active")
    const heading = targetPage.querySelector("h2")
    if (heading) {
      document.getElementById("pageTitle").textContent = heading.textContent
    }
  }

  updateActiveNav(pageId)
}

function updateActiveNav(pageId) {
  const navButtons = document.querySelectorAll(".nav-button")
  navButtons.forEach((btn) => btn.classList.remove("active"))

  const activeBtn = Array.from(navButtons).find((btn) => {
    const onclick = btn.getAttribute("onclick")
    return onclick && onclick.includes(`'${pageId}'`)
  })

  if (activeBtn) {
    activeBtn.classList.add("active")
  }
}

function openGCashPaymentModal(bookingId, amount) {
  document.getElementById("gcashBookingId").textContent = bookingId
  document.getElementById("gcashAmount").textContent = amount.toFixed(2)
  document.getElementById("paymentSuccess").style.display = "none"
  document.getElementById("gcashPhone").value = ""
  document.getElementById("gcashPin").value = ""
  document.getElementById("gcashModal").classList.add("active")
}

function closeGCashModal() {
  document.getElementById("gcashModal").classList.remove("active")
}

function processGCashPayment() {
  const phone = document.getElementById("gcashPhone").value
  const pin = document.getElementById("gcashPin").value
  const bookingId = document.getElementById("gcashBookingId").textContent
  const amount = Number.parseFloat(document.getElementById("gcashAmount").textContent)

  if (!phone || !pin) {
    alert("Please fill in all payment details")
    return
  }

  if (pin.length !== 4) {
    alert("PIN must be 4 digits")
    return
  }

  const result = window.payments.processPayment("gcash", bookingId, amount, {
    phone: phone,
    pin: pin,
  })

  if (result.success) {
    document.getElementById("paymentSuccess").style.display = "block"
    document.getElementById("gcashRef").textContent = result.transactionRef

    setTimeout(() => {
      closeGCashModal()
      alert("Payment successful! Booking confirmed.")
    }, 1500)
  } else {
    alert("Payment failed: " + result.message)
  }
}

function openIDScannerModal() {
  document.getElementById("idScannerModal").classList.add("active")
}

function closeIDScannerModal() {
  document.getElementById("idScannerModal").classList.remove("active")
  stopCameraScanning()
}

function switchIDTab(tabName) {
  const tabs = document.querySelectorAll(".scanner-content")
  tabs.forEach((tab) => tab.classList.remove("active"))

  const buttons = document.querySelectorAll(".tab-button")
  buttons.forEach((btn) => btn.classList.remove("active"))

  const targetTab = document.getElementById(tabName + "Tab")
  if (targetTab) {
    targetTab.classList.add("active")
  }

  const activeBtn = Array.from(buttons).find((btn) => {
    const onclick = btn.getAttribute("onclick")
    return onclick && onclick.includes(`'${tabName}'`)
  })

  if (activeBtn) {
    activeBtn.classList.add("active")
  }
}

function startCameraScanning() {
  const video = document.getElementById("videoElement")
  const placeholder = document.getElementById("cameraPlaceholder")

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      video.srcObject = stream
      video.style.display = "block"
      placeholder.style.display = "none"
      document.querySelector("#startBtn") ? (document.querySelector("#startBtn").style.display = "none") : ""
      document.getElementById("captureBtn").style.display = "inline-block"
      document.getElementById("stopBtn").style.display = "inline-block"
    })
    .catch((err) => {
      alert("Unable to access camera: " + err.message)
    })
}

function captureIDPhoto() {
  const video = document.getElementById("videoElement")
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  context.drawImage(video, 0, 0)

  const imageData = canvas.toDataURL("image/png")
  processScannedIDImage(imageData)
}

function stopCameraScanning() {
  const video = document.getElementById("videoElement")
  if (video.srcObject) {
    video.srcObject.getTracks().forEach((track) => track.stop())
  }
  video.style.display = "none"
  document.getElementById("cameraPlaceholder").style.display = "flex"
  document.getElementById("captureBtn").style.display = "none"
  document.getElementById("stopBtn").style.display = "none"
}

function processIDImage(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    // For uploads, only set the preview and store the raw image data.
    // Do NOT run extraction/display here; extraction happens on Verify.
    const imageData = e.target.result
    const imgEl = document.getElementById('displayIDImage')
    if (imgEl) {
      imgEl.src = imageData
      imgEl.style.display = 'block'
    }
    window.scannedIDData = window.scannedIDData || {}
    window.scannedIDData.imageData = imageData
    // ensure scanned data box is visible (preview only)
    document.getElementById('scannedDataBox').style.display = 'block'
  }
  reader.readAsDataURL(file)
}

// Extract fields from image using Tesseract.js (async). Falls back to simulated extraction when Tesseract isn't available.
async function extractFieldsFromImage(imageData) {
  // Preprocess image to improve barcode/OCR reliability
  async function preprocessImage(dataUrl, opts = {}) {
    const { maxWidth = 1400, maxHeight = 1400, contrast = 1.15, brightness = 0, threshold = null, grayscale = true } = opts
    return new Promise((resolve, reject) => {
      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          // calculate size
          let w = img.naturalWidth
          let h = img.naturalHeight
          const ratio = Math.min(1, Math.min(maxWidth / w, maxHeight / h))
          w = Math.round(w * ratio)
          h = Math.round(h * ratio)

          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, w, h)

          if (!grayscale && contrast === 1 && brightness === 0 && threshold == null) {
            return resolve(canvas.toDataURL('image/png'))
          }

          try {
            const imgData = ctx.getImageData(0, 0, w, h)
            const data = imgData.data
            // contrast formula adjustment
            const c = contrast
            const b = brightness
            for (let i = 0; i < data.length; i += 4) {
              let r = data[i]
              let g = data[i + 1]
              let bcol = data[i + 2]
              // convert to grayscale if requested
              let v = grayscale ? Math.round(0.299 * r + 0.587 * g + 0.114 * bcol) : null
              if (grayscale) {
                // apply contrast and brightness on grayscale
                v = Math.round((v - 128) * c + 128 + b)
                if (threshold != null) {
                  v = v >= threshold ? 255 : 0
                }
                data[i] = data[i + 1] = data[i + 2] = Math.max(0, Math.min(255, v))
              } else {
                // color path: adjust each channel
                r = Math.round((r - 128) * c + 128 + b)
                g = Math.round((g - 128) * c + 128 + b)
                bcol = Math.round((bcol - 128) * c + 128 + b)
                data[i] = Math.max(0, Math.min(255, r))
                data[i + 1] = Math.max(0, Math.min(255, g))
                data[i + 2] = Math.max(0, Math.min(255, bcol))
              }
            }
            ctx.putImageData(imgData, 0, 0)
            resolve(canvas.toDataURL('image/png'))
          } catch (err) {
            // if manipulation fails, return original resized image
            resolve(canvas.toDataURL('image/png'))
          }
        }
        img.onerror = (e) => reject(new Error('Image load failed'))
        img.src = dataUrl
      } catch (err) {
        reject(err)
      }
    })
  }

  // Run a preprocessing step before barcode/OCR
  try {
    const validationMsg = document.getElementById('validationMsg')
    if (validationMsg) {
      validationMsg.textContent = 'Preprocessing image...'
      validationMsg.className = 'validation-message'
    }
    const preprocessed = await preprocessImage(imageData, { maxWidth: 1600, contrast: 1.2, grayscale: true, threshold: null })
    // prefer the preprocessed image for barcode/OCR
    imageData = preprocessed || imageData
    if (validationMsg) {
      validationMsg.textContent = 'Preprocessing complete'
      validationMsg.className = 'validation-message'
    }
  } catch (err) {
    console.warn('Preprocessing failed', err)
  }

  // Decode QR / PDF417 barcode using ZXing
  async function decodeBarcodeFromImage(dataUrl) {
    return new Promise((resolve) => {
      try {
        const img = new Image()
        img.onload = async () => {
          try {
            const reader = new ZXing.BrowserMultiFormatReader()
            const result = await reader.decodeFromImageElement(img)
            if (result) resolve({ text: result.text, format: result.format })
            else resolve(null)
          } catch (err) {
            resolve(null)
          }
        }
        img.onerror = () => resolve(null)
        img.src = dataUrl
      } catch (err) {
        resolve(null)
      }
    })
  }
  // Try barcode decode first (QR / PDF417) using ZXing if available
  if (window.ZXing && typeof ZXing.BrowserMultiFormatReader === 'function') {
    try {
      const barcode = await decodeBarcodeFromImage(imageData)
      if (barcode && barcode.text) {
        // if format is PDF_417 or QR_CODE, treat as machine-readable ID
        const fmt = (barcode.format || '').toString().toUpperCase()
        if (fmt.includes('PDF') || fmt.includes('QR')) {
          // quick detection for National ID keywords in barcode payload
          const payload = (barcode.text || '').toString()
          if (/philippine|pambansang|philid|digital national|ddn|philip/i.test(payload)) {
            // prefer barcode data for id number if numeric token present
            const tokenMatch = payload.match(/[A-Z0-9]{4,20}/i)
            const idnum = tokenMatch ? tokenMatch[0] : ('ID' + Math.floor(Math.random() * 100000))
            return {
              licenseNumber: idnum,
              name: '',
              expiry: '',
              class: 'national-id',
              imageData: imageData,
              detection: { method: 'barcode', matchedField: 'licenseNumber', matchedText: idnum, payload: payload }
            }
          } else {
            // barcode present but doesn't match national id keywords — mark as other
            return {
              licenseNumber: '',
              name: '',
              expiry: '',
              class: 'other-barcode',
              imageData: imageData,
              detection: { method: 'barcode', matchedField: 'none', matchedText: '', payload: payload }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Barcode decode error', e)
    }
  }
  // If Tesseract is available, run OCR
  if (window.Tesseract && typeof Tesseract.recognize === 'function') {
    const validationMsg = document.getElementById('validationMsg')
    try {
      validationMsg.textContent = 'Detecting text (OCR)...'
      validationMsg.className = 'validation-message'
      const workerOptions = {}
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100)
            validationMsg.textContent = `Detecting text (OCR): ${pct}%`
          }
        },
      })
      const text = (result && result.data && result.data.text) ? result.data.text : ''

      // Simple heuristics to extract fields
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
      let name = ''
      let idNumber = ''
      let dob = ''
      let idType = ''

      const joined = lines.join(' | ')
      if (/pambansang|philippine|republic of the philippines|philippine identification|digital national id/i.test(joined)) {
        idType = 'national-id'
      }

      // Find DOB-like patterns (e.g., JUNE 21, 2003 or 21/06/2003)
      const dobRegex = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s\.,-]*\d{1,2}[\s\.,-]*\d{4})\b/i
      const dobMatch = text.match(dobRegex)
      if (dobMatch) dob = dobMatch[0]

      // Try to find an ID-like token (alphanumeric, often uppercase)
      const idRegex = /\b([A-Z]{2,}[0-9]{2,}|[A-Z0-9]{5,12})\b/g
      const idMatches = text.match(idRegex)
      if (idMatches && idMatches.length) {
        // choose the longest reasonable token
        idNumber = idMatches.sort((a,b)=>b.length-a.length)[0]
      }

      // Guess name: find a line with multiple capitalized words
      for (const line of lines) {
        if (/^[A-Z\s\.,'-]{6,40}$/.test(line) && line.split(' ').length >= 2) {
          name = line
          break
        }
      }

      // Fallbacks
      if (!idNumber) idNumber = 'ID' + Math.floor(Math.random() * 100000)
      if (!name) name = lines.find(l => l.length > 3) || 'Extracted Name'
      if (!dob) dob = '2028-12-31'
      if (!idType) {
        // if we see words like 'digital national' in lowercase, mark as national
        if (/digital national|national id|philid|philippine id/i.test(joined)) idType = 'national-id'
      }

      validationMsg.textContent = 'OCR complete'
      validationMsg.className = 'validation-message'

      // determine which field most strongly matched (prefer idNumber)
      let matchedField = ''
      let matchedText = ''
      if (idNumber && idNumber !== '') {
        matchedField = 'licenseNumber'
        matchedText = idNumber
      } else if (name && name.length > 3) {
        matchedField = 'name'
        matchedText = name
      } else if (dob) {
        matchedField = 'expiry'
        matchedText = dob
      }

      return {
        licenseNumber: idNumber,
        name: name,
        expiry: dob,
        class: idType || 'national-id',
        imageData: imageData,
        detection: { method: 'ocr', matchedField: matchedField || 'none', matchedText: matchedText || '', rawText: text }
      }
    } catch (err) {
      console.error('OCR error', err)
      // fall through to simulated extraction
    }
  }

  // Fallback simulated extraction
  return {
    licenseNumber: 'ID' + Math.floor(Math.random() * 100000),
    name: 'Extracted Name',
    expiry: '2028-12-31',
    class: 'national-id',
    imageData: imageData,
    detection: { method: 'fallback', matchedField: 'licenseNumber', matchedText: '' }
  }
}

function processScannedIDImage(imageData) {
  // Simulate OCR data extraction
  const licenseData = {
    licenseNumber: "D" + Math.floor(Math.random() * 100000),
    name: "John Sample",
    expiry: "2025-12-31",
    class: "non-professional",
  }

  // Attach the raw image data so we can show a preview
  licenseData.imageData = imageData

  displayScannedIDData(licenseData)
}

function displayScannedIDData(data) {
  document.getElementById("displayLicense").textContent = data.licenseNumber
  document.getElementById("displayScannedName").textContent = data.name
  document.getElementById("displayScannedExpiry").textContent = data.expiry
  document.getElementById("displayScannedClass").textContent = data.class

  // Show image preview if available
  const imgEl = document.getElementById("displayIDImage")
  if (data.imageData) {
    imgEl.src = data.imageData
    imgEl.style.display = "block"
  } else {
    imgEl.style.display = "none"
  }

  const expiryDate = new Date(data.expiry)
  const today = new Date()
  const isValid = expiryDate > today

  const validationMsg = document.getElementById("validationMsg")
  if (isValid) {
    validationMsg.textContent = "✓ ID is valid"
    validationMsg.className = "validation-message valid"
  } else {
    validationMsg.textContent = "✗ ID has expired"
    validationMsg.className = "validation-message invalid"
  }

  document.getElementById("scannedDataBox").style.display = "block"
  window.scannedIDData = data
}

// Open upload tab and immediately open file picker
function openUploadTabAndClick() {
  switchIDTab('upload')
  const input = document.getElementById('idFileInput')
  if (input) input.click()
}

// Lightweight deterministic authenticity check (simulated)
function checkAuthenticity(seed) {
  if (!seed) return false
  let sum = 0
  const len = Math.min(seed.length, 1000)
  for (let i = 0; i < len; i++) sum += seed.charCodeAt(i)
  // mark as authentic unless hash modulo 7 equals 0 (simulated fake)
  return sum % 7 !== 0
}

// Normalize and detect ID type from scanned data
function getIDType(data) {
  if (!data) return ''
  const raw = (data.class || data.licenseClass || data.idType || data.type || '').toString().toLowerCase()
  // normalize common separators
  return raw.replace(/[_\s]/g, '-').replace(/[^a-z0-9-]/g, '')
}

// Run authenticity verification and reveal Confirm button only when authentic
async function verifyIDAuthenticity() {
  if (!window.scannedIDData) {
    alert('No scanned ID available. Please upload or capture an image first.')
    return
  }
  // If we don't yet have extracted fields (upload flow), perform OCR extraction now
  if (!window.scannedIDData.licenseNumber && window.scannedIDData.imageData) {
    const validationMsg = document.getElementById('validationMsg')
    validationMsg.textContent = 'Running OCR — please wait...'
    validationMsg.className = 'validation-message'
    try {
      const extracted = await extractFieldsFromImage(window.scannedIDData.imageData)
      // merge extracted fields into scannedIDData and display them
      window.scannedIDData = Object.assign({}, window.scannedIDData, extracted)
      displayScannedIDData(window.scannedIDData)
    } catch (err) {
      alert('OCR failed: ' + (err && err.message ? err.message : err))
      return
    }
  }
  // For uploads, require explicit confirmation that the document is a National ID
  const confirmCheckbox = document.getElementById('confirmNationalCheckbox')
  if (confirmCheckbox && !confirmCheckbox.checked) {
    alert('Please confirm the uploaded document is a National ID. Other ID types are not allowed.')
    return
  }
  // enforce National ID only (detected type AND user confirmation)
  const idType = getIDType(window.scannedIDData)
  const validationMsg = document.getElementById('validationMsg')
  const confirmBtn = document.getElementById('confirmIDBtn')
  if (!idType.includes('national')) {
    validationMsg.textContent = '✗ Only National ID documents are accepted (detected: ' + (idType||'unknown') + ')'
    validationMsg.className = 'validation-message invalid'
    if (confirmBtn) confirmBtn.style.display = 'none'
    window.scannedIDData.authentic = false
    return
  }

  const seed = window.scannedIDData.imageData || window.scannedIDData.licenseNumber || ''
  const isAuthentic = checkAuthenticity(seed)
  window.scannedIDData.authentic = isAuthentic

  if (isAuthentic) {
    validationMsg.textContent = '✓ ID appears authentic'
    validationMsg.className = 'validation-message valid'
    if (confirmBtn) confirmBtn.style.display = 'inline-block'
    // Show a custom confirmation modal so operator can review before saving
    try {
      openIDConfirmModal(window.scannedIDData)
    } catch (e) {
      // fallback to native confirm if custom modal fails
      try {
        const proceed = confirm('System detected an authentic National ID. Confirm and save now?')
        if (proceed) confirmID()
      } catch (err) {
        // ignore
      }
    }
  } else {
    validationMsg.textContent = '✗ ID appears fake — verification failed'
    validationMsg.className = 'validation-message invalid'
    if (confirmBtn) confirmBtn.style.display = 'none'
  }
}

// Final confirmation action (called after authenticity check passes)
function confirmID() {
  if (!window.scannedIDData) {
    alert('No scanned ID to confirm')
    return
  }
  // enforce National ID only at confirmation as well
  const idType = getIDType(window.scannedIDData)
  if (!idType.includes('national')) {
    alert('Only National ID documents can be confirmed.')
    return
  }
  if (!window.scannedIDData.authentic) {
    alert('ID not authenticated. Cannot confirm.')
    return
  }

  // Store in backend simulation if available
  if (window.backend) {
    try {
      // prefer backend helper to attach owner and status
      if (typeof window.backend.uploadIDForUser === 'function') {
        const owner = (window.auth && window.auth.currentUser) ? window.auth.currentUser : null
        const rec = window.backend.uploadIDForUser(owner, window.scannedIDData.imageData)
        // attach extracted fields and detection meta
        rec.licenseNumber = window.scannedIDData.licenseNumber || ''
        rec.name = window.scannedIDData.name || ''
        rec.expiry = window.scannedIDData.expiry || ''
        rec.class = window.scannedIDData.class || ''
        rec.detection = window.scannedIDData.detection || null
        rec.status = 'verified'
        rec.verifier = (window.auth && window.auth.currentUser) ? window.auth.currentUser : 'system'
        rec.verifiedAt = new Date().toISOString()
      } else {
        window.backend.verifiedIDs = window.backend.verifiedIDs || []
        window.backend.verifiedIDs.push({ owner: (window.auth && window.auth.currentUser) ? window.auth.currentUser : null, ...window.scannedIDData, verificationTime: new Date(), status: 'verified' })
      }
    } catch (e) {
      // fallback: push raw
      window.backend.verifiedIDs = window.backend.verifiedIDs || []
      window.backend.verifiedIDs.push({ owner: (window.auth && window.auth.currentUser) ? window.auth.currentUser : null, ...window.scannedIDData, verificationTime: new Date(), status: 'verified' })
    }
  }
  alert('ID confirmed and saved.')
  // Close any open confirm modal and the scanner modal
  try { closeIDConfirmModal() } catch (e) {}
  closeIDScannerModal()
}

// Open the custom confirmation modal and populate fields
function openIDConfirmModal(data) {
  if (!data) return
  const modal = document.getElementById('idConfirmModal')
  if (!modal) return
  const img = document.getElementById('confirmImagePreview')
  const idNum = document.getElementById('confirmIDNumber')
  const nameEl = document.getElementById('confirmName')
  const expiry = document.getElementById('confirmExpiry')
  const cls = document.getElementById('confirmClass')
  const detectInfoEl = document.getElementById('confirmDetectionInfo')

  if (img && data.imageData) img.src = data.imageData
  if (idNum) idNum.textContent = data.licenseNumber || ''
  if (nameEl) nameEl.textContent = data.name || ''
  if (expiry) expiry.textContent = data.expiry || ''
  if (cls) cls.textContent = data.class || getIDType(data) || ''

  // clear any previous highlights
  ;[idNum, nameEl, expiry, cls].forEach(el => {
    if (!el) return
    el.classList.remove('highlight-field')
    const parent = el.parentElement
    if (parent) parent.classList.remove('highlight-field')
  })

  // show detection info and highlight matched field
  const det = (data.detection || {})
  if (detectInfoEl) {
    if (det && det.method) {
      const method = det.method.toUpperCase()
      const matched = det.matchedField || 'none'
      const matchedText = det.matchedText || ''
      let badge = ''
      try {
        badge = '<span class="detection-badge">' + method + '</span>'
      } catch (e) {
        badge = ''
      }
      detectInfoEl.innerHTML = 'Detected by: <strong>' + method + '</strong>' + (badge ? badge : '') + (matchedText ? (' — Matched: ' + matchedText) : '')
    } else {
      detectInfoEl.textContent = ''
    }
  }

  // highlight the element that matched
  try {
    const map = { licenseNumber: idNum, name: nameEl, expiry: expiry, class: cls }
    if (det && det.matchedField && det.matchedField !== 'none' && map[det.matchedField]) {
      const el = map[det.matchedField]
      const parent = el.parentElement
      if (parent) parent.classList.add('highlight-field')
      else el.classList.add('highlight-field')
    }
  } catch (e) {}

  modal.classList.add('active')
}

function closeIDConfirmModal() {
  const modal = document.getElementById('idConfirmModal')
  if (!modal) return
  modal.classList.remove('active')
}
