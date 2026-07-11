const API_URL = "https://reservation-backend-cnxc.onrender.com";
const token = localStorage.getItem("adminToken");

if (!token) {
    window.location.href = "admin-login.html";
}

const openBtn = document.getElementById("openAddReservation");
const closeBtn = document.getElementById("closeReservationModal");
const modal = document.getElementById("reservationModal");
const form = document.getElementById("adminReservationForm");
let allReservations = [];
let editingReservationId = null;
let currentFilter = "today";
let searchTerm = "";

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
});

openBtn.addEventListener("click", () => {
    modal.classList.add("open");
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const reservation = {
        firstName: document.getElementById("adminFirstName").value,
        lastName: document.getElementById("adminLastName").value,
        phone: document.getElementById("adminPhone").value,
        date: document.getElementById("adminDate").value,
        time: document.getElementById("adminTime").value,
        people: Number(document.getElementById("adminPeople").value)
    };

    try {
       const url = editingReservationId
    ? `${API_URL}/admin/reservations/${editingReservationId}`
    : `${API_URL}/reserve`

const method = editingReservationId ? "PUT" : "POST";

const response = await fetch(url, {
    method: method,
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(reservation)
});

        const data = await response.json();

        if (!response.ok) {
            document.getElementById("adminFormMessage").textContent = data.message;
            return;
        }

        document.getElementById("adminFormMessage").textContent = data.message;

        form.reset();
        modal.classList.remove("open");
loadReservations();

editingReservationId = null;

document.querySelector(".modal-box h2").textContent = "Νέα Κράτηση";
document.querySelector(".btn-save").textContent = "Αποθήκευση";

    } catch (error) {
        document.getElementById("adminFormMessage").textContent =
            "Σφάλμα σύνδεσης.";
    }
});

async function loadReservations() {
    const response = await fetch(`${API_URL}/admin/reservations`);
    const reservations = await response.json();

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const activeReservations = reservations.filter((reservation) => {
        return new Date(`${reservation.date}T00:00:00`) >= todayDate;
    });

    allReservations = reservations;

    const tbody = document.getElementById("reservationsBody");
    tbody.innerHTML = "";

    let filteredReservations = activeReservations;

    const today = new Date().toISOString().split("T")[0];

    if (currentFilter === "today") {
        filteredReservations = activeReservations.filter(
            reservation => reservation.date === today
        );
    }

    if (currentFilter === "pending") {
        filteredReservations = activeReservations.filter(
            reservation => reservation.status === "pending"
        );
    }

    if (currentFilter === "confirmed") {
        filteredReservations = activeReservations.filter(
            reservation => reservation.status === "confirmed"
        );
    }

    if (currentFilter === "cancelled") {
        filteredReservations = activeReservations.filter(
            reservation => reservation.status === "cancelled"
        );
    }

    if (currentFilter === "history") {
        filteredReservations = reservations.filter(
            reservation =>
                new Date(`${reservation.date}T00:00:00`) < todayDate
        );
    }

    if (searchTerm) {
        filteredReservations = filteredReservations.filter(r =>
            `${r.firstName} ${r.lastName}`
                .toLowerCase()
                .includes(searchTerm) ||
            String(r.phone).toLowerCase().includes(searchTerm)
        );
    }

    filteredReservations.forEach((reservation) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${reservation.firstName} ${reservation.lastName}</td>
            <td>${formatDate(reservation.date)}</td>
            <td>${reservation.time}</td>
            <td>${reservation.people}</td>
            <td>${reservation.phone}</td>
            <td>${getStatusBadge(reservation.status)}</td>

            <td>
                <div class="action-buttons">
                    ${reservation.status !== "confirmed" ? `
                        <button
                            class="action-btn confirm-btn"
                            onclick="confirmReservation('${reservation._id}')">
                            Επιβεβαίωση
                        </button>
                    ` : ""}

                    <button
                        class="action-btn edit-btn"
                        onclick="openEditReservation('${reservation._id}')">
                        Προσαρμογή
                    </button>

                    <button
                        class="action-btn cancel-btn"
                        onclick="cancelReservation('${reservation._id}')">
                        Ακύρωση
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });

    document.getElementById("totalReservations").textContent =
        activeReservations.length;

    document.getElementById("pendingReservations").textContent =
        activeReservations.filter(r => r.status === "pending").length;

    document.getElementById("confirmedReservations").textContent =
        activeReservations.filter(r => r.status === "confirmed").length;

    document.getElementById("cancelledReservations").textContent =
        activeReservations.filter(r => r.status === "cancelled").length;
}
loadReservations();
function getStatusBadge(status) {
    
    

    switch (status) {

        case "pending":
            return `<span class="status pending">Σε αναμονή</span>`;

        case "confirmed":
            return `<span class="status confirmed">Επιβεβαιωμένη</span>`;

        case "cancelled":
            return `<span class="status cancelled">Ακυρωμένη</span>`;

        default:
            return status;

    }

}


function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}
async function confirmReservation(id) {

    await fetch(
    `${API_URL}/admin/reservations/${id}/confirm`,
    {
        method: "PUT"
    }
);

    loadReservations();

}
async function cancelReservation(id) {
    const confirmCancel = confirm(
        "Είστε σίγουροι ότι θέλετε να ακυρώσετε αυτή την κράτηση;"
    );

    if (!confirmCancel) return;

   await fetch(
    `${API_URL}/admin/reservations/${id}/cancel`,
    {
        method: "PUT"
    }
);

    loadReservations();
}
   
function openEditReservation(id) {
    const reservation = allReservations.find(r => r._id === id);

    if (!reservation) return;

    editingReservationId = id;

    document.querySelector(".modal-box h2").textContent =
        "Προσαρμογή Κράτησης";

    document.querySelector(".btn-save").textContent =
        "Ενημέρωση";

    document.getElementById("adminFirstName").value = reservation.firstName;
    document.getElementById("adminLastName").value = reservation.lastName;
    document.getElementById("adminPhone").value = reservation.phone;
    document.getElementById("adminDate").value = reservation.date;
    document.getElementById("adminTime").value = reservation.time;
    document.getElementById("adminPeople").value = reservation.people;

    modal.classList.add("open");
}

document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        loadReservations();
    });
});
document.getElementById("searchInput").addEventListener("input", (e) => {
    searchTerm = e.target.value.toLowerCase();
    loadReservations();
});