$(function () {
  const apiBaseUrl = "https://deckofcardsapi.com/api/deck";

  // Function to fetch and log the first card
  async function logFirstCard() {
    const response = await $.getJSON(`${apiBaseUrl}/new/draw/`);
    const { suit, value } = response.cards[0];
    console.log(`First card: ${value.toLowerCase()} of ${suit.toLowerCase()}`);
    return response.deck_id;
  }

  // Function to fetch and log the second card
  async function logSecondCard(deckID) {
    const response = await $.getJSON(`${apiBaseUrl}/${deckID}/draw/`);
    const { suit, value } = response.cards[0];
    console.log(`Second card: ${value.toLowerCase()} of ${suit.toLowerCase()}`);
    return response.cards[0];
  }

  // Function to draw and log two cards
  async function drawTwoCards() {
    const deckID = await logFirstCard();
    await logSecondCard(deckID);
  }

  // Initialize card drawing on button click
  async function setupDrawing() {
    const deckResponse = await $.getJSON(`${apiBaseUrl}/new/shuffle/`);
    const deckID = deckResponse.deck_id;
    const $drawButton = $("#draw-card");

    $drawButton.on("click", async () => {
      const response = await $.getJSON(`${apiBaseUrl}/${deckID}/draw/`);
      const cardImage = response.cards[0].image;

      // Add the card to the center of the screen with slight stacking
      const angle = Math.random() * 10 - 5;
      const offsetX = Math.random() * 10 - 5;
      const offsetY = Math.random() * 10 - 5;

      $("body").append(
        $("<img>", {
          src: cardImage,
          css: {
            transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) rotate(${angle}deg)`,
          },
        })
      );

      // Disable the button when the deck is empty
      if (response.remaining === 0) {
        $drawButton.text("No more cards!").prop("disabled", true);
      }
    });
  }

  // Initialize the application
  drawTwoCards();
  setupDrawing();
});
