const searchInput = document.getElementById('searchInput');
  const btnSearch = document.getElementById('btnSearch');
  const btnReset = document.getElementById('btnReset');
  const resultsArea = document.getElementById('resultsArea');
 
  btnSearch.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      resultsArea.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Please enter a keyword to search.</p>';
      return;
    }

    fetch('./travel_recommendation_api.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        let matchedItems = [];

        // Match categories
        if (query === 'beach' || query === 'beaches') {
          matchedItems = data.beaches || [];
        } else if (query === 'temple' || query === 'temples') {
          matchedItems = data.temples || [];
        } else if (query === 'country' || query === 'countries') {
          (data.countries || []).forEach(country => {
            if (country.cities) {
              matchedItems.push(...country.cities);
            }
          });
        } else {
          // Direct name search
          (data.countries || []).forEach(country => {
            if (country.name.toLowerCase() === query) {
              matchedItems.push(...country.cities);
            }
          });
        }

        // Call the render function to build the grid
        renderRecommendations(matchedItems);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        resultsArea.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #dc2626;">Error retrieving recommendations.</p>';
      });
  });

   function renderRecommendations(items) {
    resultsArea.innerHTML = '';

    if (!items || items.length === 0) {
      resultsArea.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No recommendations found for "<strong>${searchInput.value.trim()}</strong>". Try "beach", "temple", or "country".</p>`;
      return;
    }

    // Displays the first 2 results side-by-side in the row
    const displayItems = items.slice(0, 2);

    displayItems.forEach(item => {
      const card = document.createElement('article');
      card.className = 'recommendation-card';

      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" class="card-img" onerror="this.src='https://placehold.co/600x400?text=Image+Not+Found'" />
        <div class="card-body">
          <div>
            <h2 class="card-title">${item.name}</h2>
            <p class="card-desc">${item.description}</p>
          </div>
          <button type="button" class="btn-visit">Visit</button>
        </div>
      `;

      resultsArea.appendChild(card);
    });
  }

   btnReset.addEventListener('click', () => {
    searchInput.value = '';
    resultsArea.innerHTML = '';
    searchInput.focus();
  });