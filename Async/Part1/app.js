const mainNumber = 5; // The primary number for facts
const apiURL = "http://numbersapi.com"; // Base API endpoint

// Fetch and display multiple facts about the main number
async function getRepeatedFacts() {
  try {
    const promises = Array.from({ length: 4 }, () =>
      $.getJSON(`${apiURL}/${mainNumber}?json`)
    );
    const responses = await Promise.all(promises);
    responses.forEach((response, index) => {
      displayFact(`Repeated Fact ${index + 1}: ${response.text}`);
    });
  } catch (err) {
    console.error("Error fetching repeated facts:", err);
    displayFact("Error: Unable to fetch repeated facts.");
  }
}
// Utility function to display facts on the page
function displayFact(fact) {
  $("body").append(`<div class="fact">${fact}</div>`);
}

// Fetch and log a single fact about the main number
async function getSingleFact() {
  try {
    const response = await $.getJSON(`${apiURL}/${mainNumber}?json`);
    console.log("Single Fact:", response);
    displayFact(`Single Fact: ${response.text}`);
  } catch (err) {
    console.error("Error fetching single fact:", err);
    displayFact("Error: Unable to fetch single fact.");
  }
}
getSingleFact();

// Fetch and log facts for a group of numbers
const numbersGroup = [1, 2, 3]; // Array of numbers to fetch facts for
async function getGroupFacts() {
  try {
    const response = await $.getJSON(`${apiURL}/${numbersGroup}?json`);
    console.log("Group Facts:", response);
    for (const [number, fact] of Object.entries(response)) {
      displayFact(`Fact about ${number}: ${fact}`);
    }
  } catch (err) {
    console.error("Error fetching group facts:", err);
    displayFact("Error: Unable to fetch group facts.");
  }
}
getGroupFacts();
getRepeatedFacts();
