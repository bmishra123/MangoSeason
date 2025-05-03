const scriptURL = "https://script.google.com/macros/s/AKfycbzLCNY1hkktc1rsZZUGkKnr4aNq9s0W64k2AiFPgYlH0DfsqIfkiTSqOabWYuCUfUpmRA/exec";
const totalSeats = 100;
const seatsContainer = document.getElementById("seats-container");
const form = document.getElementById("bookingForm");
let selectedSeats = [];

function renderSeats(bookedSeats = []) {
  seatsContainer.innerHTML = "";
  for (let i = 1; i <= totalSeats; i++) {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.textContent = i;
    if (bookedSeats.includes(i.toString())) {
      seat.classList.add("booked");
    } else {
      seat.addEventListener("click", () => {
        seat.classList.toggle("selected");
        const seatNum = i.toString();
        if (selectedSeats.includes(seatNum)) {
          selectedSeats = selectedSeats.filter(s => s !== seatNum);
        } else {
          selectedSeats.push(seatNum);
        }
      });
    }
    seatsContainer.appendChild(seat);
  }
}

fetch(scriptURL)
  .then(res => res.json())
  .then(data => renderSeats(data.bookedSeats || []))
  .catch(() => alert("Failed to load seat data."));

form.addEventListener("submit", e => {
  e.preventDefault();
  if (selectedSeats.length === 0) {
    alert("Please select at least one seat.");
    return;
  }

  const guestName = document.getElementById("guestName").value;
  const guestPhone = document.getElementById("guestPhone").value;
  const guestEmail = document.getElementById("guestEmail").value;

  const formData = new URLSearchParams();
  formData.append("guestName", guestName);
  formData.append("guestPhone", guestPhone);
  formData.append("guestEmail", guestEmail);
  formData.append("seats", selectedSeats.join(","));

  fetch(scriptURL, {
    method: "POST",
    body: formData,
  })
    .then(response => response.text())
    .then(result => {
      if (result === "Success") {
        alert("Booking successful!");
        window.location.reload();
      } else {
        alert("Booking failed.");
      }
    })
    .catch(() => alert("Error booking seats."));
});
