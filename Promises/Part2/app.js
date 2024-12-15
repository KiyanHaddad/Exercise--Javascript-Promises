$(function () {
  const apiEndpoint = 'https://deckofcardsapi.com/api/deck'; // Base API URL
  let activeDeck = null; // Deck ID to track the current deck
  const $drawButton = $('#draw-button'); // Button element
  const $cardContainer = $('#card-area'); // Container for displayed cards

  // Define styles for card positioning and rotation
  const cardOffsets = {
    randomX: () => Math.random() * 6 - 3, // Subtle X-offset
    randomY: () => Math.random() * 6 - 3, // Subtle Y-offset
    randomAngle: () => Math.random() * 10 - 5, // Subtle rotation angle
  };

  // Fetch and log a single card using promises
  function fetchSingleCard() {
    return new Promise((resolve, reject) => {
      $.getJSON(`${apiEndpoint}/new/draw/`)
        .then((response) => {
          const singleCard = response.cards[0];
          const { suit, value } = singleCard;
          console.log(`Card fetched: ${value.toLowerCase()} of ${suit.toLowerCase()}`);
          resolve();
        })
        .catch(reject);
    });
  }

  // Fetch and log two cards in sequence
  function fetchTwoSequentialCards() {
    return new Promise((resolve, reject) => {
      let firstCard; // Moved declaration to the top for clarity
      $.getJSON(`${apiEndpoint}/new/draw/`)
        .then((response) => {
          firstCard = response.cards[0];
          const deckReference = response.deck_id; // Renamed variable for clarity
          return $.getJSON(`${apiEndpoint}/${deckReference}/draw/`);
        })
        .then((secondResponse) => {
          const secondCard = secondResponse.cards[0];
          [firstCard, secondCard].forEach((card) => {
            console.log(`Logged card: ${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`);
          });
          resolve();
        })
        .catch(reject);
    });
  }

  // Initialize the deck and set up the button
  function setupDeck() {
    return new Promise((resolve, reject) => {
      $.getJSON(`${apiEndpoint}/new/shuffle/`)
        .then((response) => {
          activeDeck = response.deck_id;
          $drawButton.show();
          resolve();
        })
        .catch(reject);

      $drawButton.on('click', drawAndShowCard);
    });
  }

  // Draw a card and display it
  function drawAndShowCard() {
    return new Promise((resolve, reject) => {
      $.getJSON(`${apiEndpoint}/${activeDeck}/draw/`)
        .then((response) => {
          const { image } = response.cards[0]; // Extract image property
          const angle = cardOffsets.randomAngle();
          const xDisplacement = cardOffsets.randomX();
          const yDisplacement = cardOffsets.randomY();

          $cardContainer.append(
            $('<img>', {
              src: image,
              css: {
                transform: `translate(${xDisplacement}px, ${yDisplacement}px) rotate(${angle}deg)`,
              },
            })
          );

          if (response.remaining === 0) {
            $drawButton.text('Deck Empty').prop('disabled', true);
          }
          resolve();
        })
        .catch(reject);
    });
  }

  // Execute all features in order
  fetchSingleCard()
    .then(() => fetchTwoSequentialCards())
    .then(() => setupDeck())
    .catch((error) => console.error('Error occurred:', error));
});
