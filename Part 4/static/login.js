//check login status from backend session
fetch('/api/check-login')
    .then(res => res.json())
    .then(data => {
        if (data.logged_in) {
            window.location.href = "./admin/items-manager";
        }
    });

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const pass = document.getElementById("password").value.trim();
        const password = toHex(pass); //convert to hex

        loginForm.reset(); //clear form

        login(email, password);
    });

    async function login(email, password) {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.redirected) {
            window.location.href = response.url;
        } else {
            const result = await response.json();
            alert(result.error || "Login failed");
        }
    }

    // Simple string to hex
    function toHex(str) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += str.charCodeAt(i).toString(16);
        }
        return result;
    }
});