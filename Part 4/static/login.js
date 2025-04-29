// Checks current logged in session
if (localStorage.getItem("sessionID")) {
    window.location.href = ".//admin/items-manager";
}

// Waits for DOM Content to load
document.addEventListener('DOMContentLoaded', function () {

    // List of admin users to be created
    const newDataArr = [
        { email: "RubiMadrid@enmu.edu", password: toHex("Temp2025!")},
        { email: "curbina@enmu.edu", password: toHex("Temp2025!")},
        { email: "NarrowPath20@enmu.edu", password: toHex("Temp2025!")},
        { email: "AyhamAbbad@enmu.edu", password: toHex("Temp2025!")},
        { email: "admin@enmu.edu", password: toHex("Temp2025!")},
        { email: "admin1@enmu.edu", password: toHex("Temp2025!")}
    ];

    // IndexdDB
    let db;
    const indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;
        
    // Opend IndexDB Connection
    const request = indexedDB.open("TeaShopDB", 2);

    // Error handler
    request.onerror = function (event) {
        alert("An error occurred with TeaShopDB");
        console.error(event);
    };

    // Success handler
    request.onsuccess = (event) => {
        // Get TeaShopDB
        db = event.target.result;

        // Add admin accounts to db
        addAdmins();

        // Handles form submit event
        document.getElementById("login-form").addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.getElementById("email").value.trim();
            const pass = document.getElementById("password").value.trim();
            
            // Reset login form
            document.getElementById("login-form").reset()

            // Login admin
            loginAdmin(email, pass);
        });
    };

    // Hanldes admin login
    // Param: Email Address
    // Param: Password
    function loginAdmin(email, pass) {
        const transaction = db.transaction("admins", "readonly");
        const store = transaction.objectStore("admins");
        const index = store.index("email");
    
        const getRequest = index.get(email);
    
        // On success - Stores new log in session
        getRequest.onsuccess = () => {
            const admin = getRequest.result;
    
            // Store: SessionID
            // Store: SessionName
            if (admin && admin.password === toHex(pass)) {
                let name = admin.email.split("@")[0]
                console.log("Login successful:", name);
                localStorage.setItem("sessionID", admin.id);
                localStorage.setItem("sessionName", name);
                window.location.href = "/admin/items-manager";
            } else {
                alert("Invalid email or password.");
                console.log("Login failed.");
            }
        };
    
        getRequest.onerror = () => {
            console.error("Error retrieving admin for login.");
            alert("Login error occurred.");
        };
    }
    
    // Adds default admins
    function addAdmins() {
        const transaction = db.transaction("admins", "readwrite");
        const store = transaction.objectStore("admins");
    
        const getAllRequest = store.getAll();
    
        getAllRequest.onsuccess = () => {
            if (getAllRequest.result.length === 0) {
                // Iterate list of admin
                // Adds admin to storage
                newDataArr.forEach(newData => {
                    const addRequest = store.add(newData);
    
                    addRequest.onsuccess = () => {
                        console.log("Admin added successfully:", newData.email);
                    };
    
                    addRequest.onerror = () => {
                        console.log("Error adding admin:", newData.email);
                    };
                });
    
                alert("Demo mode activated and admins added successfully!");
            } else {
                console.log("Admins already exist in the database.");
            }
        };
    
        getAllRequest.onerror = () => {
            console.error("Failed to check existing admins.");
        };
    }

    // toHex: Simple string encryption
    function toHex(str) {
        var result = '';
        for (var i=0; i<str.length; i++) {
          result += str.charCodeAt(i).toString(16);
        }
        return result;
      }
});
