function login() {
    let u = document.getElementById("user").value;
    let p = document.getElementById("pass").value;

    if (u.trim() === "" || p.trim() === "") {
        document.getElementById("error").innerText = "Enter username & password.";
        return;
    }
    localStorage.setItem("loggedIn", "yes");
    window.location.href = "vendor_home.html";
}
if (!window.location.href.includes("login.html")) {
    if (localStorage.getItem("loggedIn") !== "yes") {
        window.location.href = "login.html";
    }
}
