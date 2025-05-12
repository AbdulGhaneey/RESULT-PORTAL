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
    container.innerHTML = '';
    
    if (wards.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted py-4">
                <i class="fas fa-users-slash fa-2x mb-3"></i>
                <p>No wards added yet. Use the form above to link your wards.</p>
            </div>
        `;
        return;
    }

    wards.forEach((ward, index) => {
        const wardCard = `
            <div class="col-md-6">
                <div class="ward-card">
                    <h5><i class="fas fa-user-graduate"></i> ${ward.name}</h5>
                    <p class="text-muted">Class: ${ward.class}</p>
                    <div class="ward-actions d-flex justify-content-between">
                        <a href="results.html?studentId=${ward.id}" 
                           class="btn btn-sm btn-primary">
                           <i class="fas fa-eye"></i> View Results
                        </a>
                        <button onclick="removeWard(${index})" 
                                class="btn btn-sm btn-danger">
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