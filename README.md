# ts-bridge-basics
Basic typescript types and code common to contract bridge logic

Basic TypeScript types and classes dealing with Contract Bridge concepts.

Basic types related to cards and seats:

- Seats and Deck. Objects for accessing the standard positions in bridge, and the deck
     of cards.

  - Basic related classes: Seat, Suit, Rank, Card. There are are only a fixed number of these objects  - four seats, four suits, thirteen ranks, and 52 cards.

  - Seats.north, Seats.east, Seats.south, Seats.west are the four seats. Seats.all is an array of the four seats starting
with north in clockwise order.

  - Deck.suits.spades, Deck.suits.hearts, Deck.suits.diamonds, Deck.suits.clubs are the four suits. Deck.suits.all is
an array in that order.

  - Deck.ranks.ace, ..., Deck.ranks.two are the ranks. Deck.ranks.all are the ranks from ace to two.

  - Deck.cards.all


Intermeddate concepts:

- Holding: A set of ranks of an unspecified suit. You might say "My hearts were Ace, king, jack, five, and two." "Ake, king, jack, five and two" is the holding. Holdings are often the basis of evaluation functions.

- Hand: 13 distinct cards.

- Deal: A division of all 52 two cards to hands, one per seat.


TODO: Contracts, auctions, and play records, partial hands and partial deals (diagrams.)

The was originally started for my Impossible Bridge Book project, but I wanted to re-use as much as possible for my contract-bridge-xml project, as well, so I moved these classes, types, and constants to their own repository.