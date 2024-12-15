$(function () {
  const apiBase = 'https://deckofcardsapi.com/api/deck'; // Centralized API base URL
  let currentDeck = null;
  const $button = $('#draw-button');
  const $display = $('#card-display');

  // Centralized variables for offsets and rotations
  const offsetSettings = {
    x: () => Math.random() * 6 - 3, // Subtle horizontal offset
    y: () => Math.random() * 6 - 3, // Subtle vertical offset
    angle: () => Math.random() * 10 - 5, // Subtle rotation angle
  };

  // Fetch and log a single card
  function fetchSingleCardLog() {
    $.getJSON(`${apiBase}/new/draw/`, function (data) {
      const { suit, value } = data.cards[0];
      console.log(`Fetched card: ${value.toLowerCase()} of ${suit.toLowerCase()}`);
    });
  }

  // Fetch and log two cards sequentially
  function fetchTwoCardsLog() {
    $.getJSON(`${apiBase}/new/draw/`, function (data) {
      const firstCard = data.cards[0];
      const deckReference = data.deck_id;

      $.getJSON(`${apiBase}/${deckReference}/draw/`, function (nextData) {
        const secondCard = nextData.cards[0];
        [firstCard, secondCard].forEach((card) => {
          console.log(`Card logged: ${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`);
        });
      });
    });
  }

  // Initialize the deck and setup the button
  function setupDeck() {
    $.getJSON(`${apiBase}/new/shuffle/`, function (response) {
      currentDeck = response.deck_id;
      $button.show();
    });

    // Attach button click event
    $button.on('click', handleDrawCard);
  }

  // Draw and display a card
  function handleDrawCard() {
    $.getJSON(`${apiBase}/${currentDeck}/draw/`, function (data) {
      const imageURL = data.cards[0].image;

      $display.append(
        $('<img>', {
          src: imageURL,
          css: {
            transform: `translate(${offsetSettings.x()}px, ${offsetSettings.y()}px) rotate(${offsetSettings.angle()}deg)`,
          },
        })
      );

      if (data.remaining === 0) {
        $button.text('No more cards!').prop('disabled', true);
      }
    });
  }

  // Execute all functions in sequence
  fetchTwoCardsLog();
  fetchSingleCardLog();
  setupDeck();
});
