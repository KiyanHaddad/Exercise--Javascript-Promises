const apiBaseURL = "http://numbersapi.com"; // API base URL
const myFavoriteNumber = 5; // Single favorite number
const favoriteNumbersArray = [1, 2, 3]; // Array of favorite numbers

// Fetch multiple facts about the same number and display them on the page
Promise.all(
  Array.from({ length: 4 }, () => $.getJSON(`${apiBaseURL}/${myFavoriteNumber}?json`))
).then((factList) => {
  factList.forEach((factItem) => {
    $("body").append(`<p>${factItem.text}</p>`);
  });
});


// Fetch and log a fact about a single favorite number
$.getJSON(`${apiBaseURL}/${myFavoriteNumber}?json`).then((factData) => {
  console.log(`Fact about ${myFavoriteNumber}: ${factData.text}`);
});

// Fetch and log facts about multiple favorite numbers
$.getJSON(`${apiBaseURL}/${favoriteNumbersArray}?json`).then((factsData) => {
  console.log("Facts about favorite numbers:");
  for (const num in factsData) {
    console.log(`${num}: ${factsData[num]}`);
  }
});

