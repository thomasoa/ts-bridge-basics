"use strict";
/**
 * A set of constant describing things related to bridge deals.
 *
 * Types: Seat, Rank, Suit,
 * Class: Card
 * Global: Deck, Seats
 *
 *     Seats.all : Seat[] - Array of all seat objects
 *     Seats.each         - alias for Seats.all.forEach
 *     Seats.map          - alias for Seats.all.map
 *
 *     Deck.suits.all : Suit[] - Array of all suits
 *     Deck.suits.each, Deck.suits.map
 *                             - aliases
 *
 *     Deck.ranks.all: Rank[] - Array of all ranks
 *     Deck.ranks.each, Deck.ranks.map
 *                            - aliases
 *
 *     Deck.cards.all: Card[] - All 52 different card values
 *     Deck.cards.each, Deck.cards.map
 *
 *     Deck.card(suit:Suit, rank:Rank):Card - returns the card
 *
 *     Deck.cardByName(name:string):Card - Expects suit first, then rank: 'ST' or 'd10'
 *
 *     Seats.nprth, Seats.east, Seats.south, Seats.west
 *     Deck.Ranks.ace, ..., Deck.Ranks.two
 *     Deck.Suits.spades, ..., Deck.Suits.clubs
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.Rank = exports.Seats = exports.Deck = void 0;
var maps_1 = require("../generic/maps");
function f(obj) {
    Object.freeze(obj);
    return obj;
}
var North = { name: "north", letter: "N", order: 0 };
var East = { name: "east", letter: "E", order: 1 };
var South = { name: "south", letter: "S", order: 2 };
var West = { name: "west", letter: "W", order: 3 };
var AllSeats = [North, East, South, West];
AllSeats.forEach(Object.freeze);
Object.freeze(AllSeats);
var SeatNameMap = new maps_1.UpcaseMap();
AllSeats.forEach(function (seat) {
    SeatNameMap.set(seat.name, seat);
    SeatNameMap.set(seat.letter, seat);
});
var Seats = {
    north: North,
    east: East,
    south: South,
    west: West,
    all: AllSeats,
    each: AllSeats.forEach.bind(AllSeats),
    map: AllSeats.map.bind(AllSeats),
    byText: SeatNameMap.get.bind(SeatNameMap)
};
exports.Seats = Seats;
Object.freeze(Seats);
var Rank = /** @class */ (function () {
    function Rank(brief, order, letter) {
        if (letter === void 0) { letter = undefined; }
        this.brief = brief;
        this.order = order;
        this.bit = 1 << (12 - order);
        this.letter = letter || brief;
        this.summand = order;
        Object.freeze(this);
    }
    return Rank;
}());
exports.Rank = Rank;
var Spades = f({ name: 'spades', singular: 'spade', letter: 'S', symbol: '\U+2660', order: 0, summand: 0 });
var Hearts = f({ name: 'hearts', singular: 'heart', letter: 'H', symbol: '\U+2665', order: 1, summand: 13 * 1 });
var Diamonds = f({ name: 'diamonds', singular: 'diamond', letter: 'D', symbol: '\U+2666', order: 2, summand: 13 * 2 });
var Clubs = f({ name: 'clubs', singular: 'club', letter: 'C', symbol: '\U+2663', order: 3, summand: 13 * 3 });
var AllSuits = [Spades, Hearts, Diamonds, Clubs];
Object.freeze(AllSuits);
var SuitNameMap = new maps_1.UpcaseMap();
AllSuits.forEach(function (suit) {
    SuitNameMap.set(suit.name, suit);
    SuitNameMap.set(suit.letter, suit);
    SuitNameMap.set(suit.singular, suit);
});
var Suits = {
    spades: Spades,
    hearts: Hearts,
    diamonds: Diamonds,
    clubs: Clubs,
    all: AllSuits,
    each: AllSuits.forEach.bind(AllSuits),
    map: AllSuits.map.bind(AllSuits),
    byText: SuitNameMap.get.bind(SuitNameMap)
};
Suits.each(Object.freeze);
Object.freeze(Suits);
var Card = /** @class */ (function () {
    function Card(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.short = suit.letter + rank.brief;
        this.order = rank.order + 13 * suit.order;
        Object.freeze(this);
    }
    return Card;
}());
exports.Card = Card;
var Ace = new Rank('A', 0);
var King = new Rank('K', 1);
var Queen = new Rank('Q', 2);
var Jack = new Rank('J', 3);
var Ten = new Rank('10', 4, 'T');
var Nine = new Rank('9', 5);
var Eight = new Rank('8', 6);
var Seven = new Rank('7', 7);
var Six = new Rank('6', 8);
var Five = new Rank('5', 9);
var Four = new Rank('4', 10);
var Three = new Rank('3', 11);
var Two = new Rank('2', 12);
var AllRanks = f([Ace, King, Queen, Jack, Ten, Nine, Eight, Seven, Six, Five, Four, Three, Two]);
function ranksFromBits(bits) {
    var ranks = new Array();
    AllRanks.forEach(function (rank) {
        if (rank.bit & bits) {
            ranks.push(rank);
        }
    });
    return ranks;
}
var RankParser = /** @class */ (function () {
    function RankParser(text, rank) {
        this.letter = text.slice(0, 1);
        this.full = text;
        this.rank = rank;
    }
    Object.defineProperty(RankParser.prototype, "length", {
        get: function () { return this.full.length; },
        enumerable: false,
        configurable: true
    });
    RankParser.prototype.apply = function (text) {
        if (text.slice(0, this.length) == this.full) {
            return { rank: this.rank, rest: text.slice(this.length) };
        }
        throw new Error('Invalid card rank ' + text);
    };
    return RankParser;
}());
function createRankParser() {
    var map = new maps_1.UpcaseMap();
    var add = function (parser) {
        map.set(parser.letter, parser);
    };
    AllRanks.forEach(function (rank) {
        add(new RankParser(rank.letter, rank));
        if (rank.brief != rank.letter) {
            add(new RankParser(rank.brief, rank));
        }
    });
    return function (text) {
        var parser = map.get(text.slice(0, 1));
        if (parser) {
            return parser.apply(text);
        }
        throw new Error('Invalid rank ' + text);
    };
}
var rankParser = createRankParser();
function rankByText(text) {
    text = text.toUpperCase();
    var result = rankParser(text);
    if (result.rest != "") {
        throw new Error('Invalid rank: ' + text);
    }
    return result.rank;
}
function ranksByText(text) {
    var ranks = new Array();
    if (text == '-') {
        return ranks;
    }
    var lastOrder = -1;
    var rest = text;
    while (rest != '') {
        var result = rankParser(rest);
        if (result.rank.order <= lastOrder) {
            throw new Error('Invalid rank order in ' + text);
        }
        ranks.push(result.rank);
        rest = result.rest.trimStart();
        lastOrder = result.rank.order;
    }
    return ranks;
}
var Ranks = f({
    ace: Ace,
    king: King,
    queen: Queen,
    jack: Jack,
    ten: Ten,
    nine: Nine,
    eight: Eight,
    seven: Seven,
    six: Six,
    five: Five,
    four: Four,
    three: Three,
    two: Two,
    all: AllRanks,
    each: AllRanks.forEach.bind(AllRanks),
    map: AllRanks.map.bind(AllRanks),
    fromBits: ranksFromBits,
    byName: rankByText,
    parse: ranksByText
});
function make_cards() {
    var cards = new Array(52);
    Ranks.each(function (rank) {
        Suits.each(function (suit) {
            var index = suit.summand + rank.summand;
            cards[index] = f(new Card(suit, rank));
        });
    });
    return f(cards);
}
var AllCards = make_cards();
var CardsByName = new maps_1.UpcaseMap();
AllCards.forEach(function (card) {
    var rank = card.rank;
    var suit = card.suit;
    var rankStrings = [rank.brief, rank.letter];
    rankStrings.forEach(function (rankStr) {
        CardsByName.set(suit.letter + rankStr, card);
        CardsByName.set(rankStr + suit.letter, card);
    });
});
function cardBySuitRank(suit, rank) {
    return AllCards[suit.summand + rank.summand];
}
Rank.prototype.of = function (suit) { return cardBySuitRank(suit, this); };
function lookupCardByName(name) {
    name = name.toUpperCase();
    var card = CardsByName.get(name);
    if (card) {
        return card;
    }
    throw Error('Invalid card name ' + name);
}
function lookupCardsByNames() {
    var names = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        names[_i] = arguments[_i];
    }
    return names.map(lookupCardByName);
}
var Cards = f({
    all: AllCards,
    each: AllCards.forEach.bind(AllCards),
    map: AllCards.map.bind(AllCards),
    byName: lookupCardByName,
    byNames: lookupCardsByNames
});
var Deck = {
    ranks: Ranks,
    suits: Suits,
    cards: Cards,
    card: cardBySuitRank,
    c: Cards.byName
};
exports.Deck = Deck;
Object.freeze(Deck);
