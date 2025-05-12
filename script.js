// Mock data for demonstration (replace with real API calls later)
const mockResults = [
    { subject: "Mathematics", score: 85, grade: "A" },
    { subject: "English", score: 78, grade: "B+" },
    { subject: "Physics", score: 92, grade: "A+" },
];

// PIN Validation (Simple Example)
document.getElementById('pinForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const pin = document.getElementById('pin').value;
    
    // Basic validation (replace with actual backend check)
    if (pin.length === 12) {
        window.location.href = 'results.html';
    } else {
        alert('Invalid PIN. Please check and try again.');
    }
});

// Populate Results Table
document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('resultsTable');
    if (table) {
        mockResults.forEach(result => {
            const row = `
                <tr>
                    <td>${result.subject}</td>
                    <td>${result.score}</td>
                    <td>${result.grade}</td>
                </tr>
            `;
            table.innerHTML += row;
        });
    }
});

// Payment Button (Demo)
document.getElementById('payButton')?.addEventListener('click', () => {
    alert('Redirecting to payment gateway...'); // Replace with Paystack/Flutterwave integration
});

// PIN Validation with Loading Spinner
document.getElementById('pinForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const pin = document.getElementById('pin').value;
    const submitBtn = document.querySelector('#pinForm button');
    
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Validating...';
    submitBtn.disabled = true;

    // Simulate API call (replace with real validation)
    setTimeout(() => {
        if (pin.length === 12) {
            window.location.href = 'results.html';
        } else {
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger mt-3';
            errorDiv.textContent = 'Invalid PIN. Use the format: 12AB-34CD-56EF.';
            document.querySelector('.card-body').appendChild(errorDiv);
        }
        submitBtn.innerHTML = 'View Results';
        submitBtn.disabled = false;
    }, 1500);
});

// Real-Time PIN Format Check (e.g., "XXXX-XXXX-XXXX")
document.getElementById('pin')?.addEventListener('input', function(e) {
    const pin = e.target.value;
    const isValid = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(pin);
    e.target.style.borderColor = isValid ? '#ced4da' : '#dc3545'; // Red if invalid
});

// Parent Dashboard Functionality
// Ward Data Structure (would normally come from backend)
let wards = JSON.parse(localStorage.getItem('wards')) || [];

function renderWards() {
    const container = document.getElementById('wardsList');
    container.innerHTML = ''; // Clear existing content
    
    // Empty State: Show when no wards exist
    if (wards.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <img src="images/empty-state.svg" alt="No wards" class="mb-4" style="width: 150px; opacity: 0.7;">
                <h5 class="text-muted mb-3">No students linked to your account</h5>
                <p class="text-secondary">Use the form above to add your wards using their Student ID and Scratch Card PIN.</p>
            </div>
        `;
        return;
    }

    // Populate Wards List
    wards.forEach((ward, index) => {
        const wardCard = `
            <div class="col-md-6 mb-4">
                <div class="ward-card bg-white p-4 rounded shadow-sm">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <div>
                            <h5 class="mb-0"><i class="fas fa-user-graduate me-2"></i>${ward.name}</h5>
                            <small class="text-muted">Class: ${ward.class}</small>
                        </div>
                        <span class="badge bg-primary">${ward.status || 'Active'}</span>
                    </div>
                    <div class="ward-actions d-flex gap-2">
                        <a href="results.html?studentId=${ward.id}" 
                           class="btn btn-sm btn-outline-primary w-100">
                           <i class="fas fa-eye me-2"></i>View
                        </a>
                        <button onclick="removeWard(${index})" 
                                class="btn btn-sm btn-outline-danger">
                                <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += wardCard;
    });
}

// Add New Ward (Mock Implementation)
document.getElementById('addWardForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const pin = document.getElementById('wardPin').value;

    // Mock validation - replace with actual API call
    if (pin.length === 12) {
        // Mock ward data - replace with actual student lookup
        const newWard = {
            id: studentId,
            name: "Student " + (wards.length + 1),
            class: "SS" + Math.floor(Math.random() * 3 + 1)
        };
        
        wards.push(newWard);
        localStorage.setItem('wards', JSON.stringify(wards));
        renderWards();
        this.reset();
    } else {
        alert('Invalid PIN. Please check and try again.');
    }
});

// Remove Ward
function removeWard(index) {
    wards.splice(index, 1);
    localStorage.setItem('wards', JSON.stringify(wards));
    renderWards();
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('wardsList')) {
        renderWards();
    }
});

// Sanitize input (remove HTML tags/special characters)
function sanitizeInput(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Block HTML tags
}

// Usage in PIN validation:
document.getElementById('pinForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const rawPIN = document.getElementById('pin').value;
  const sanitizedPIN = sanitizeInput(rawPIN); // Sanitize first

  if (sanitizedPIN.length !== 12 || !/^[A-Z0-9-]+$/.test(sanitizedPIN)) {
    showError("Invalid PIN format. Use 12 alphanumeric characters.");
    return;
  }
  // ... proceed with validation
});

// Track failed attempts in localStorage
function trackFailedAttempt() {
  let attempts = localStorage.getItem('failedAttempts') || 0;
  attempts++;
  localStorage.setItem('failedAttempts', attempts);
  
  if (attempts >= 3) {
    const blockTime = Date.now() + 300000; // Block for 5 minutes
    localStorage.setItem('blockUntil', blockTime);
    showError("Too many attempts. Try again in 5 minutes.");
    disablePINForm();
  }
}

function disablePINForm() {
  document.getElementById('pin').disabled = true;
  setTimeout(() => {
    localStorage.removeItem('failedAttempts');
    document.getElementById('pin').disabled = false;
  }, 300000); // 5 minutes
}

// Check on page load
document.addEventListener('DOMContentLoaded', () => {
  const blockUntil = localStorage.getItem('blockUntil');
  if (blockUntil && Date.now() < blockUntil) {
    disablePINForm();
  }
});

// After successful PIN validation
localStorage.setItem('sessionToken', 'mock-secure-token'); // Insecure! Replace with real JWT later

let inactivityTimer;

function resetTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(logoutUser, 900000); // 15 minutes
}

function logoutUser() {
  localStorage.removeItem('sessionToken');
  window.location.href = 'index.html';
}

// Track user activity
document.addEventListener('mousemove', resetTimer);
document.addEventListener('keypress', resetTimer);

function showLoading() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

// Example usage in PIN validation:

// script.js
import { validatePINFormat } from './utils.js';

document.getElementById('pinForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const pin = document.getElementById('pin').value;

  if (!validatePINFormat(pin)) {
    showToast('Invalid PIN format. Use: ABCD-1234-EF56', 'error');
    return;
  }
  
  // ... rest of PIN validation logic
});

document.getElementById('pinForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  showLoading();
  // Simulate API call
  setTimeout(() => {
    hideLoading();
  }, 2000);
});

function showToast(message, type = 'error') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 5000);
}

// Usage:
showToast('Invalid PIN! Please try again.');

function validateEmail(input) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const errorDiv = document.getElementById('emailError');
  
  if (!emailRegex.test(input.value)) {
    input.classList.add('is-invalid');
    errorDiv.textContent = 'Please enter a valid email address.';
  } else {
    input.classList.remove('is-invalid');
    errorDiv.textContent = '';
  }
}