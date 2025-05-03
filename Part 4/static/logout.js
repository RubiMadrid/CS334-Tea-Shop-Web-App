document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            fetch('/api/admin/logout', { method: 'POST' })
                .then(() => {
                    window.location.href = "/";
                })
                .catch(err => {
                    console.error("Logout failed:", err);
                    alert("Logout failed.");
                });
        });
    }
});
