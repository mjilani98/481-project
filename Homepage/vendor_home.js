// Simulated menu items
let menuItems = [
    { id: 1, name: "Pepperoni Pizza", price: 12.99, available: true },
    { id: 2, name: "Veggie Pizza", price: 11.49, available: false },
    { id: 3, name: "BBQ Chicken Pizza", price: 14.25, available: true }
];

// Load menu on page start
window.onload = function () {
    loadMenu();
};

// RENDER MENU LIST
function loadMenu() {
    const menuList = document.getElementById("menuList");
    menuList.innerHTML = "";

    menuItems.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("menu-item");

        li.innerHTML = `
            <span>${item.name} - $${item.price.toFixed(2)}</span>
            <button 
                class="toggle-btn ${item.available ? 'available' : 'unavailable'}"
                onclick="toggleAvailability(${item.id})"
            >
                ${item.available ? "Available" : "Unavailable"}
            </button>
        `;

        menuList.appendChild(li);
    });
}

// TOGGLE AVAILABILITY
function toggleAvailability(id) {
    const item = menuItems.find(i => i.id === id);
    item.available = !item.available;
    loadMenu();
}

// PAGE ACTIONS
// Go to Orders page (already working)
function goToOrders() {
    window.location.href = "burgers.html";
}

// Go to Menu Management page
function goToMenu() {
    window.location.href = "menu.html";
}

// Go to Account Settings page
function goToAccount() {
    window.location.href = "account.html";
}

// LOGOUT FUNCTION
function logout() {
    // Clear stored session (if any)
    localStorage.removeItem("loggedIn");

    // Redirect to login page
    window.location.href = "login.html";
}
