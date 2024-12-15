$(function () {
  const pokeAPI = 'https://pokeapi.co/api/v2';
  const $pokeButton = $('#catch-pokemon');
  const $pokeDisplay = $('#pokemon-area');

  // Fetch Pokémon data for logging
  function fetchAndLogPokemonData(limit = 1000) {
    $.getJSON(`${pokeAPI}/pokemon/?limit=${limit}`, function (response) {
      console.log('Fetched Pokémon:', response.results);
    });
  }

  // Fetch and display a single Pokémon's details
  function fetchRandomPokemonDetails(limit = 1000) {
    $.getJSON(`${pokeAPI}/pokemon/?limit=${limit}`, function (response) {
      const randomIndex = Math.floor(Math.random() * response.results.length);
      const randomPokemonURL = response.results[randomIndex].url;

      $.getJSON(randomPokemonURL, function (pokemonData) {
        const { name, sprites } = pokemonData;
        console.log(`Fetched Pokémon: ${name}`, sprites.front_default);
      });
    });
  }

  // Initialize Pokémon button functionality
  function setupCatchButton() {
    $pokeButton.on('click', function () {
      $pokeDisplay.empty();
      $.getJSON(`${pokeAPI}/pokemon/?limit=1000`, function (data) {
        const randomUrls = [];
        for (let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const url = data.results.splice(randomIndex, 1)[0].url;
          randomUrls.push(url);
        }
        displayPokemonCards(randomUrls);
      });
    });
  }

  // Generate and display Pokémon cards
  function displayPokemonCards(pokemonUrls) {
    pokemonUrls.forEach((url) => {
      $.getJSON(url, function (pokemonData) {
        const { name, sprites } = pokemonData;
        const imgSrc = sprites.front_default;

        $.getJSON(pokemonData.species.url, function (speciesData) {
          const descriptionEntry = speciesData.flavor_text_entries.find(
            (entry) => entry.language.name === 'en'
          );
          const description = descriptionEntry
            ? descriptionEntry.flavor_text
            : 'No description available.';
          const cardHTML = createPokemonCard(name, imgSrc, description);
          $pokeDisplay.append(cardHTML);
        });
      });
    });
  }

  // Create a Pokémon card element
  function createPokemonCard(name, imgSrc, description) {
    return `
      <div class="card">
        <h1>${name}</h1>
        <img src="${imgSrc}" alt="${name}" />
        <p>${description}</p>
      </div>
    `;
  }

  // Run initial functions
  fetchAndLogPokemonData();
  fetchRandomPokemonDetails();
  setupCatchButton();
});
