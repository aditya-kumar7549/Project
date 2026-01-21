const donationForm = document.getElementById("donationForm");
const donationList = document.getElementById("donationList");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const clearAllBtn = document.getElementById("clearAll");

// Impact counters
const totalDonationsEl = document.getElementById("totalDonations");
const availableDonationsEl = document.getElementById("availableDonations");
const collectedDonationsEl = document.getElementById("collectedDonations");

let donations = JSON.parse(localStorage.getItem("donations")) || [];

// Smooth scroll functions
function scrollToDonate() {
  document.getElementById("donate").scrollIntoView({ behavior: "smooth" });
}
function scrollToListings() {
  document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
}

// Update impact stats
function updateImpact() {
  totalDonationsEl.textContent = donations.length;
  availableDonationsEl.textContent = donations.filter(d => d.status === "Available").length;
  collectedDonationsEl.textContent = donations.filter(d => d.status === "Collected").length;
}

// Render donations
function renderDonations() {
  donationList.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase();
  const selectedStatus = filterStatus.value;

  const filtered = donations.filter(d => {
    const matchSearch =
      d.foodType.toLowerCase().includes(searchValue) ||
      d.location.toLowerCase().includes(searchValue);

    const matchStatus = selectedStatus === "All" || d.status === selectedStatus;

    return matchSearch && matchStatus;
  });

  if (filtered.length === 0) {
    donationList.innerHTML = "<p>No donation listings found 😢</p>";
    updateImpact();
    return;
  }

  filtered.forEach((donation, index) => {
    const div = document.createElement("div");
    div.className = "donation-card";

    div.innerHTML = `
      <div>
        <h3>🍱 ${donation.foodType}</h3>
        <p><b>Donor:</b> ${donation.donorName}</p>
        <p><b>Quantity:</b> ${donation.quantity} people</p>
        <p><b>Location:</b> ${donation.location}</p>
        <p><b>Contact:</b> ${donation.contact}</p>
        <p><b>Expiry:</b> ${donation.expiry}</p>

        <span class="badge ${donation.status === "Available" ? "available" : "collected"}">
          ${donation.status}
        </span>
      </div>

      <div class="card-actions">
        <button class="action-btn collect-btn" onclick="toggleCollected(${index})">
          ${donation.status === "Available" ? "Mark Collected" : "Mark Available"}
        </button>
        <button class="action-btn delete-btn" onclick="deleteDonation(${index})">
          Delete
        </button>
      </div>
    `;

    donationList.appendChild(div);
  });

  updateImpact();
}

// Add donation
donationForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const donorName = document.getElementById("donorName").value.trim();
  const foodType = document.getElementById("foodType").value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const location = document.getElementById("location").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const expiry = document.getElementById("expiry").value;

  const newDonation = {
    donorName,
    foodType,
    quantity,
    location,
    contact,
    expiry,
    status: "Available"
  };

  donations.push(newDonation);
  localStorage.setItem("donations", JSON.stringify(donations));

  donationForm.reset();
  renderDonations();
});

// Toggle status
function toggleCollected(index) {
  donations[index].status = donations[index].status === "Available" ? "Collected" : "Available";
  localStorage.setItem("donations", JSON.stringify(donations));
  renderDonations();
}

// Delete donation
function deleteDonation(index) {
  donations.splice(index, 1);
  localStorage.setItem("donations", JSON.stringify(donations));
  renderDonations();
}

// Clear all
clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all donation listings?")) {
    donations = [];
    localStorage.setItem("donations", JSON.stringify(donations));
    renderDonations();
  }
});

// Search & Filter
searchInput.addEventListener("input", renderDonations);
filterStatus.addEventListener("change", renderDonations);

// FAQ Toggle
document.querySelectorAll(".faq-q").forEach(btn => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    answer.style.display = answer.style.display === "block" ? "none" : "block";
  });
});

// Initial Render
renderDonations();
updateImpact();
