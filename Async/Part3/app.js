$(function () {
  const pokeApiEndpoint = "https://pokeapi.co/api/v2";

  // Function to fetch and return the Pokémon list
  async function fetchAllPokemon() {
    const response = await $.getJSON(`${pokeApiEndpoint}/pokemon?limit=1000`);
    return response.results;
  }

  // Function to pick random Pokémon URLs
  function selectRandomPokemon(pokemonList, count = 3) {
    const selectedUrls = [];
    const availablePokemon = [...pokemonList]; // Clone array to avoid mutation
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availablePokemon.length);
      selectedUrls.push(availablePokemon.splice(randomIndex, 1)[0].url);
    }
    return selectedUrls;
  }

  // Fetch details for Pokémon from the given URLs
  async function fetchPokemonDetails(pokemonUrls) {
    return Promise.all(pokemonUrls.map((url) => $.getJSON(url)));
  }

  // Fetch species data for Pokémon to get descriptions
  async function fetchSpeciesData(pokemonDetails) {
    return Promise.all(
      pokemonDetails.map((pokemon) => $.getJSON(pokemon.species.url))
    );
  }

  // Generate the Pokémon card HTML
  function createPokemonCardHtml(name, imgSrc, description) {
    return `
      <div class="pokemon-card">
        <img src="${imgSrc}" alt="${name}" />
        <h3>${name}</h3>
        <p>${description}</p>
      </div>
    `;
  }

  // Main function to fetch, process, and display Pokémon
  async function displayRandomPokemon() {
    $("#pokemon-container").empty();

    const allPokemon = await fetchAllPokemon();
    const randomPokemonUrls = selectRandomPokemon(allPokemon);

    const pokemonDetails = await fetchPokemonDetails(randomPokemonUrls);
    const speciesDetails = await fetchSpeciesData(pokemonDetails);

    speciesDetails.forEach((species, index) => {
      const descriptionObj = species.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );
      const description = descriptionObj
        ? descriptionObj.flavor_text
        : "No description available.";
      const name = pokemonDetails[index].name;
      const imgSrc = pokemonDetails[index].sprites.front_default;

      const cardHtml = createPokemonCardHtml(name, imgSrc, description);
      $("#pokemon-container").append(cardHtml);
    });
  }

  // Attach the event listener to the button
  $("#get-pokemon").on("click", displayRandomPokemon);
});
