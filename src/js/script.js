

function checkLogin() {
  if (!sessionStorage.getItem("bitcraveAdmin")) {
    window.location.href = "login.html";
  }
}

function logout() {
  sessionStorage.removeItem("bitcraveAdmin");
  window.location.href = "login.html";
}

function applyDarkMode(selectors = []) {
  if (localStorage.getItem("bitcrave-theme") === "dark") {
    document.body.classList.add("dark-mode");
    selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => el.classList.add("dark-mode")));
  }

  const toggle = document.getElementById("darkModeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => el.classList.toggle("dark-mode")));
      const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
      localStorage.setItem("bitcrave-theme", mode);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyDarkMode([".card", ".table", ".form-control"]);
});


function registerUser(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find(u => u.email === email)) {
    alert("Email already registered!");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registration successful!");
  window.location.href = "index.html";
}

function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Login successful!");
    window.location.href = "reservation.html";
  } else {
    alert("Invalid credentials!");
  }
}

function checkLogin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("Please login first!");
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

function makeReservation(e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const date = document.getElementById('resDate').value;
  const time = document.getElementById('resTime').value;
  const people = document.getElementById('resPeople').value;
  const note = document.getElementById('resNote').value;

  const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
  reservations.push({ user: user.email, date, time, people, note, status: "Pending" });
  localStorage.setItem("reservations", JSON.stringify(reservations));

  alert("Reservation placed!");
  window.location.href = "status.html";
}

function showMyBookings() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
  const myRes = reservations.filter(r => r.user === user.email);
  const container = document.getElementById("bookingList");
  container.innerHTML = myRes.length
    ? myRes.map(r => `<div><strong>${r.date} at ${r.time}</strong> for ${r.people} people – Status: ${r.status}</div><hr>`).join('')
    : "No bookings found.";
}
