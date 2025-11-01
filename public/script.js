// ✅ Fetch movies from backend and populate movie dropdown
async function loadMovies() {
  try {
    const response = await fetch("/movies");
    const movies = await response.json();

    const movieSelect = document.getElementById("movie");
    movieSelect.innerHTML = ""; // clear old options

    movies.forEach((movie) => {
      const option = document.createElement("option");
      option.value = movie.movie_id;
      option.textContent = `${movie.movie_name} (${movie.release_year})`;
      movieSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

// ✅ Load theatres (static list for now)
function loadTheatres() {
  const theatreSelect = document.getElementById("theatre");
  const theatres = ["PVR Cinemas", "INOX", "Cinepolis", "Wave Cinema"];
  theatreSelect.innerHTML = "";
  theatres.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    theatreSelect.appendChild(opt);
  });
}

// ✅ Load showtimes (static list)
function loadShowtimes() {
  const showtimeSelect = document.getElementById("showtime");
  const times = ["10:00 AM", "1:30 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
  showtimeSelect.innerHTML = "";
  times.forEach((time) => {
    const opt = document.createElement("option");
    opt.value = time;
    opt.textContent = time;
    showtimeSelect.appendChild(opt);
  });
}

// ✅ Handle booking submission
document.getElementById("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const movie = document.getElementById("movie").selectedOptions[0].text;
  const theatre = document.getElementById("theatre").value;
  const showtime = document.getElementById("showtime").value;
  const seats = document.getElementById("seats").value;

  // Show confirmation message
  const msg = document.getElementById("bookingMsg");
  msg.textContent = `🎟️ Successfully booked ${seats} seats for ${movie} at ${theatre}, ${showtime}!`;
  msg.style.color = "green";
  msg.style.fontWeight = "bold";

  // Add booking details to the My Bookings table
  const tableBody = document.querySelector("#showtimeTable tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${movie}</td>
    <td>${theatre}</td>
    <td>${seats}</td>
    <td>${showtime}</td>
  `;

  tableBody.appendChild(row);

  // Optionally clear the form
  document.getElementById("bookingForm").reset();
});

// ✅ Initialize page on load
window.onload = () => {
  loadMovies();
  loadTheatres();
  loadShowtimes();
};
