const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("loginMessage");

    try {
const response = await fetch("https://reservation-backend-cnxc.onrender.com/admin/login", {   
             method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            loginMessage.textContent = data.message;
            return;
        }

        localStorage.setItem("adminToken", data.token);

        window.location.href = "admin.html";

    } catch (error) {
        loginMessage.textContent = "Σφάλμα σύνδεσης.";
    }
});