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
function goToOrders() {
    alert("Redirecting to vendor orders page...");
}

function addMenuItem() {
    alert("Open add menu item form...");
}

function editProfile() {
    alert("Redirecting to vendor profile settings...");
}

function logout() {
    alert("Logging out...");
}
