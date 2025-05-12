// utils.js
export const sanitizeInput = (input) => {
  return input
    .replace(/</g, "&lt;") // Block HTML tags
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

// utils.js
export const validatePINFormat = (pin) => {
  // Format: XXXX-XXXX-XXXX (uppercase letters/numbers)
  const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return regex.test(pin);
};

// utils.js
export const handleError = (error) => {
  console.error(error); // Log for debugging
  showToast('An error occurred. Please try again.', 'error');
};

// utils.js
export const logError = (error) => {
  const errors = JSON.parse(localStorage.getItem('errorLogs')) || [];
  errors.push({ timestamp: Date.now(), error: error.message });
  localStorage.setItem('errorLogs', JSON.stringify(errors));
};