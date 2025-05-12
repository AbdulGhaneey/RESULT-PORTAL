document.addEventListener("DOMContentLoaded", () => {
    // Update total amount when quantity changes
    document.getElementById("quantity")?.addEventListener("input", function() {
        const quantity = parseInt(this.value) || 0;
        const amount = quantity * 1000; // ₦1000 per card
        document.getElementById("amount").value = `₦${amount.toLocaleString()}`;
    });

    // Mock payment processing
    document.getElementById("paymentForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const quantity = parseInt(document.getElementById("quantity").value);
        const payButton = document.getElementById("payButton");

        // Validation
        if (quantity < 1 || quantity > 5) {
            showToast("Quantity must be 1-5 cards", "error");
            return;
        }

        // Mock loading state
        payButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Processing...`;
        payButton.disabled = true;

        // Simulate API call to payment gateway
        setTimeout(() => {
            // Generate mock scratch card PINs
            const pins = Array.from({ length: quantity }, () => 
                generatePIN()
            );

            // Store purchased pins (mock database)
            const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
            transactions.push({ 
                date: new Date().toISOString(), 
                pins: pins,
                amount: quantity * 1000
            });
            localStorage.setItem("transactions", JSON.stringify(transactions));

            // Redirect to confirmation page
            window.location.href = `payment-success.html?pins=${encodeURIComponent(pins.join(","))}`;
        }, 2000);
    });
});

function generatePIN() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pin = "";
    for (let i = 0; i < 12; i++) {
        pin += chars[Math.floor(Math.random() * chars.length)];
        if (i === 3 || i === 7) pin += "-"; // Format: XXXX-XXXX-XXXX
    }
    return pin;
}