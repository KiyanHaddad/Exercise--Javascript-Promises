const favoriteNumber = 5;
const apiBaseURL = "http://numbersapi.com";

// 1. Fetch and log a single fact
function fetchAndLogSingleFact(number) {
  $.getJSON(`${apiBaseURL}/${number}?json`, (data) => {
    console.log(`Fact about ${number}: ${data.text}`);
  });
}

// 2. Fetch and log facts for multiple numbers
function fetchAndLogMultipleFacts(numbers) {
  $.getJSON(`${apiBaseURL}/${numbers}?json`, (data) => {
    console.log("Facts about multiple numbers:", data);
  });
}

// 3. Fetch and display multiple facts about a single number
function fetchAndDisplayFacts(number, count) {
  const $factsContainer = $("#facts-container");
  let fetchedFacts = [];

  function fetchNextFact(index) {
    if (index < count) {
      $.getJSON(`${apiBaseURL}/${number}?json`, (data) => {
        fetchedFacts.push(data.text);
        fetchNextFact(index + 1);
      });
    } else {
      // Append all facts to the container
      fetchedFacts.forEach((fact) => {
        $factsContainer.append(`<p>${fact}</p>`);
      });
    }
  }

  fetchNextFact(0); // Start fetching the facts
}

// Initialize the functionality
fetchAndLogSingleFact(favoriteNumber); // Logs a single fact for the favorite number
fetchAndLogMultipleFacts([1,2, 3]); // Logs facts for an array of favorite numbers
fetchAndDisplayFacts(favoriteNumber, 4); // Displays multiple facts for the favorite number
