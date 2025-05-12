// Mock database (replace with real backend later)
let parents = JSON.parse(localStorage.getItem('parents')) || [];
let sessions = JSON.parse(localStorage.getItem('sessions')) || [];

// Password hashing (mock - use bcrypt in real backend)
function hashPassword(password) {
    return btoa(password); // Not secure! For demo only
}

// Signup
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = hashPassword(document.getElementById('password').value);

    if (parents.some(parent => parent.email === email)) {
        alert('Email already exists!');
        return;
    }

    parents.push({ email, password });
    localStorage.setItem('parents', JSON.stringify(parents));
    alert('Signup successful! Please login.');
    window.location.href = 'login.html';
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = hashPassword(document.getElementById('password').value);

    const parent = parents.find(p => p.email === email && p.password === password);
    if (!parent) {
        alert('Invalid email or password!');
        return;
    }

    // Create session (mock JWT)
    const sessionToken = Math.random().toString(36).substr(2);
    sessions.push({ email, token: sessionToken });
    localStorage.setItem('sessions', JSON.stringify(sessions));
    localStorage.setItem('currentParent', email); // For dashboard

    window.location.href = 'dashboard.html';
});

// auth.js (Signup/Login)
import { sanitizeInput } from './utils.js';

const email = sanitizeInput(document.getElementById('email').value);
const password = sanitizeInput(document.getElementById('password').value);

// auth.js
import { validatePINFormat } from './utils.js';

document.getElementById('addWardForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const pin = document.getElementById('wardPin').value;

  if (!validatePINFormat(pin)) {
    showToast('Invalid PIN format. Use: ABCD-1234-EF56', 'error');
    return;
  }
  
  // ... rest of add-ward logic
});

// auth.js
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes

function checkAttempts() {
  const attempts = JSON.parse(localStorage.getItem('loginAttempts')) || [];
  const recentAttempts = attempts.filter(time => Date.now() - time < LOCKOUT_TIME);
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    const remainingTime = Math.ceil((LOCKOUT_TIME - (Date.now() - recentAttempts[0])) / 60000);
    showToast(`Too many attempts. Try again in ${remainingTime} minutes.`, 'error');
    return false;
  }
  return true;
}

function logAttempt() {
  const attempts = JSON.parse(localStorage.getItem('loginAttempts')) || [];
  attempts.push(Date.now());
  localStorage.setItem('loginAttempts', JSON.stringify(attempts));
}

// auth.js
let inactivityTimer;

function resetSessionTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(logout, 15 * 60 * 1000); // 15 minutes
}

// Track user activity
document.addEventListener('mousemove', resetSessionTimer);
document.addEventListener('keypress', resetSessionTimer);
resetSessionTimer(); // Initialize

// auth.js (After successful login)
const sessionToken = generateSecureToken(); // Mock for now
localStorage.setItem('sessionToken', sessionToken);