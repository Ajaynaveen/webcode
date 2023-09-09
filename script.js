const baseUrl = 'https://api.openbrewerydb.org';

let currentPage = 1;
const itemsPerPage = 10;
let cities = [];

async function fetchCities() {
    const cityList = document.getElementById('cityList');
    const searchInput = document.getElementById('searchInput');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    try {
        const response = await fetch(`${baseUrl}/breweries?per_page=50&page=1`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        cities = Array.from(new Set(data.map(brewery => brewery.city))).filter(Boolean);

        cityList.innerHTML = '';
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';

        if (cities.length > 0) {
            renderCities(currentPage);
        }

        // Add event listener for search input
        searchInput.addEventListener('input', () => {
            const searchText = searchInput.value.trim().toLowerCase();
            const filteredCities = cities.filter(city => city.toLowerCase().includes(searchText));
            currentPage = 1; // Reset to the first page when searching
            renderCities(currentPage, filteredCities);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderCities(page, cityArray = cities) {
    const cityList = document.getElementById('cityList');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    cityList.innerHTML = '';

    for (let i = startIndex; i < endIndex && i < cityArray.length; i++) {
        const city = cityArray[i];
        const li = document.createElement('li');
        li.innerHTML = `<a href="brewery.html?city=${city}">${city}</a>`;
        cityList.appendChild(li);
    }

    if (page > 1) {
        prevButton.style.display = 'block';
    } else {
        prevButton.style.display = 'none';
    }

    if (endIndex < cityArray.length) {
        nextButton.style.display = 'block';
    } else {
        nextButton.style.display = 'none';
    }
}

document.getElementById('prevButton').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderCities(currentPage);
    }
});

document.getElementById('nextButton').addEventListener('click', () => {
    const totalPages = Math.ceil(cities.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderCities(currentPage);
    }
});

// Initial fetch for cities
fetchCities();
