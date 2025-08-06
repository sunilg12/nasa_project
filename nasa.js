const currentImageContainer = document.getElementById("current-image-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchHistory = document.getElementById("search-history");

const API_KEY = "DEMO_KEY"; // Replace with your actual NASA API key

function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  fetchImageOfTheDay(currentDate);
}

function fetchImageOfTheDay(date) {
  fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data || data.error || !data.url) {
        currentImageContainer.innerHTML = `
          <div style="background:black; color:white; padding: 20px; border-radius: 10px;">
            <h2 style="color:red;">No Data Available</h2>
            <p>Please select a valid past date.</p>
          </div>
        `;
        return;
      }

      displayImage(data);
      saveSearch(date);
      addSearchToHistory();
    })
    .catch((error) => {
      console.error("Error fetching NASA data:", error);
      currentImageContainer.innerHTML = `<p style="color:red;">Failed to fetch data. Try again later.</p>`;
    });
}

function displayImage(data) {
  currentImageContainer.innerHTML = `
    <h1>${data.title || "No Title Available"}</h1>
    <p>${data.explanation || "No Description Available"}</p>
    ${
      data.media_type === "image"
        ? `<a href="${data.hdurl || data.url}" target="_blank">
             <img src="${data.url}" alt="NASA APOD Image" style="max-width: 100%; border-radius: 8px;" />
           </a>`
        : `<iframe src="${data.url}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`
    }
  `;
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

function addSearchToHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searchHistory.innerHTML = "<h2>Search History</h2>";

  searches.forEach((date) => {
    const button = document.createElement("button");
    button.textContent = date;
    button.style.margin = "5px";
    button.style.padding = "5px 10px";
    button.style.cursor = "pointer";
    button.addEventListener("click", () => {
      fetchImageOfTheDay(date);
    });
    searchHistory.appendChild(button);
  });
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedDate = searchInput.value;

  if (!selectedDate) {
    alert("Please select a date.");
    return;
  }

  fetchImageOfTheDay(selectedDate);
});

getCurrentImageOfTheDay();
