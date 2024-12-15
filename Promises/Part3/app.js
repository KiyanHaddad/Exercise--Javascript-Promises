$(function () {
  const pokeAPI = 'https://pokeapi.co/api/v2';
  const $catchButton = $('#catch-pokemon');
  const $pokemonDisplay = $('#pokemon-area');

  // Fetch and log the list of Pokémon using a Promise
  function fetchPokemonList(limit = 1000) {
    return new Promise((resolve, reject) => {
      $.getJSON(`${pokeAPI}/pokemon/?limit=${limit}`)
        .then((response) => {
          console.log('Fetched Pokémon:', response.results);
          resolve(response.results);
        })
        .catch((error) => {
          console.error('Error fetching Pokémon list:', error);
          reject(error);
        });
    });
  }

  // Fetch details for a random Pokémon
  function fetchRandomPokemonDetails(limit = 1000) {
    return new Promise((resolve, reject) => {
      fetchPokemonList(limit)
        .then((pokemonList) => {
          const randomIndex = Math.floor(Math.random() * pokemonList.length);
          return $.getJSON(pokemonList[randomIndex].url);
        })
        .then((pokemon) => {
          console.log(`Fetched Pokémon: ${pokemon.name}`, pokemon.sprites.front_default);
          resolve(pokemon);
        })
        .catch((error) => {
          console.error('Error fetching random Pokémon:', error);
          reject(error);
        });
    });
  }

  // Fetch and display multiple Pokémon
  function displayMultiplePokemon(count = 3) {
    return new Promise((resolve, reject) => {
      fetchPokemonList()
        .then((pokemonList) => {
          const randomUrls = [];
          for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * pokemonList.length);
            randomUrls.push(pokemonList.splice(randomIndex, 1)[0].url);
          }

          const fetchPromises = randomUrls.map((url) => $.getJSON(url));
          return Promise.all(fetchPromises);
        })
        .then((pokemonDetails) => {
          $pokemonDisplay.empty();
          pokemonDetails.forEach((pokemon) => {
            const cardHTML = createPokemonCard(pokemon);
            $pokemonDisplay.append(cardHTML);
          });
          resolve();
        })
        .catch((error) => {
          console.error('Error displaying Pokémon:', error);
          reject(error);
        });
    });
  }

  // Create a Pokémon card
  function createPokemonCard(pokemon) {
    const description = 'This is a fantastic Pokémon ready to battle!'; // Placeholder
    return `
      <div class="card">
        <h1>${pokemon.name}</h1>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <p>${description}</p>
      </div>
    `;
  }

  // Initialize the button functionality
  function setupCatchButton() {
    $catchButton.on('click', () => {
      displayMultiplePokemon(3).then(() => {
        console.log('Pokémon displayed successfully!');
      });
    });
  }

  // Initialize the app
  fetchPokemonList()
    .then(() => fetchRandomPokemonDetails())
    .then(() => setupCatchButton())
    .catch((error) => {
      console.error('Initialization error:', error);
    });
});
