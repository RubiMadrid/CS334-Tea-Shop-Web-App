// Logout user if active session found
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("logout-btn").addEventListener("click", function(event) {
        if (localStorage.getItem("sessionID")) {
            localStorage.clear()
            window.location.href = "../index.html"
        }
    });
});