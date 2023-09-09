// brewery.js
const breweryBaseUrl = 'https://api.openbrewerydb.org';

let breweryCurrentPage = 1;
const breweryItemsPerPage = 3;
let breweries = [];

async function fetchBreweriesByCity(city, page = 1) {
    const breweryList = document.getElementById('breweryList');
    const prevBreweryButton = document.getElementById('prevBreweryButton');
    const nextBreweryButton = document.getElementById('nextBreweryButton');

    try {
        const response = await fetch(`${breweryBaseUrl}/breweries?by_city=${city}&per_page=50&page=${page}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        breweries = data;

        breweryList.innerHTML = '';
        prevBreweryButton.style.display = 'none';
        nextBreweryButton.style.display = 'none';

        if (breweries.length > 0) {
            renderBreweries(breweryCurrentPage);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderBreweries(page) {
    const breweryList = document.getElementById('breweryList');
    const breweryPagination = document.getElementById('breweryPagination');

    const startIndex = (page - 1) * breweryItemsPerPage;
    const endIndex = startIndex + breweryItemsPerPage;

    breweryList.innerHTML = '';

    for (let i = startIndex; i < endIndex && i < breweries.length; i++) {
        const brewery = breweries[i];
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <h3>${brewery.name}</h3>
            <p>Type: ${brewery.brewery_type}</p>
            <p>Address: ${brewery.street}, ${brewery.city}, ${brewery.state}, ${brewery.postal_code}</p>
            <p>Website: <a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a></p>
            <p>Phone: ${brewery.phone}</p>
        `;
        breweryList.appendChild(li);
    }

  
    const totalPages = Math.ceil(breweries.length / breweryItemsPerPage);
    const prevBreweryButton = document.getElementById('prevBreweryButton');
    const nextBreweryButton = document.getElementById('nextBreweryButton');

    if (page > 1) {
        prevBreweryButton.style.display = 'block';
    } else {
        prevBreweryButton.style.display = 'none';
    }

    if (endIndex < breweries.length) {
        nextBreweryButton.style.display = 'block';
    } else {
        nextBreweryButton.style.display = 'none';
    }

    // Add event listeners for pagination
    prevBreweryButton.addEventListener('click', () => {
        if (breweryCurrentPage > 1) {
            breweryCurrentPage--;
            renderBreweries(breweryCurrentPage);
        }
    });

    nextBreweryButton.addEventListener('click', () => {
        if (breweryCurrentPage < totalPages) {
            breweryCurrentPage++;
            renderBreweries(breweryCurrentPage);
        }
    });
}


const urlParams = new URLSearchParams(window.location.search);
const selectedCity = urlParams.get('city');
if (selectedCity) {
    fetchBreweriesByCity(selectedCity);
}
