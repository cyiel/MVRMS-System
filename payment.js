// Simple client-side payment simulator
(function () {
  const payments = {
    processPayment: function (method, bookingId, amount, meta) {
      // basic validation
      if (!bookingId || !amount) return { success: false, message: 'Missing booking or amount' }
      try {
        const ref = (meta && meta.phone) ? 'GCASH-' + Date.now() : 'PAY-' + Date.now()
        const tx = window.backend.recordPaymentTransaction(bookingId, method, Number(amount), ref)
        return { success: true, transactionRef: tx.id || ref }
      } catch (e) {
        return { success: false, message: e && e.message ? e.message : 'Payment failed' }
      }
    },
  }

  window.payments = payments
})()
