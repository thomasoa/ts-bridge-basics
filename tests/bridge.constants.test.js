"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../src/bridge/constants");
test("Ensure the sizes are right", function () {
    expect(constants_1.Seats.all.length).toBe(4);
    expect(constants_1.Deck.suits.all.length).toBe(4);
    expect(constants_1.Deck.ranks.all.length).toBe(13);
    expect(constants_1.Deck.cards.all.length).toBe(52);
});
test('cards.byName when card does not exist', function () {
    expect(function () { return constants_1.Deck.cards.byName('NA'); }).toThrow();
});
test("Ensure seat orders are in agreement", function () {
    constants_1.Seats.each(function (seat, index) {
        expect(seat.order).toBe(index);
    });
});
test("Ensure suit orders are in agreement", function () {
    constants_1.Deck.suits.each(function (suit, index) {
        expect(suit.order).toBe(index);
    });
});
test("Ensure rank orders agree with the linear order", function () {
    expect(constants_1.Deck.ranks.all[0]).toBe(constants_1.Deck.ranks.ace);
    constants_1.Deck.ranks.each(function (rank, index) {
        expect(rank.order).toBe(index);
    });
});
test("Ensure card orders agree with the linear order", function () {
    constants_1.Deck.cards.each(function (card, index) {
        expect(card.order).toBe(index);
    });
});
test("Deck.cards.byName lookup", function () {
    var spadeThree = constants_1.Deck.cards.byName('S3');
    expect(spadeThree.suit).toBe(constants_1.Deck.suits.spades);
    expect(spadeThree.rank).toBe(constants_1.Deck.ranks.three);
    var clubAce = constants_1.Deck.cards.byName('ca');
    expect(clubAce.suit).toBe(constants_1.Deck.suits.clubs);
    expect(clubAce.rank).toBe(constants_1.Deck.ranks.ace);
});
test('ranks.byName examples', function () {
    expect(constants_1.Deck.ranks.byName('A')).toBe(constants_1.Deck.ranks.ace);
    expect(constants_1.Deck.ranks.byName('a')).toBe(constants_1.Deck.ranks.ace);
    expect(constants_1.Deck.ranks.byName('K')).toBe(constants_1.Deck.ranks.king);
    expect(constants_1.Deck.ranks.byName('Q')).toBe(constants_1.Deck.ranks.queen);
    expect(constants_1.Deck.ranks.byName('J')).toBe(constants_1.Deck.ranks.jack);
    expect(constants_1.Deck.ranks.byName('T')).toBe(constants_1.Deck.ranks.ten);
    expect(constants_1.Deck.ranks.byName('10')).toBe(constants_1.Deck.ranks.ten);
    expect(constants_1.Deck.ranks.byName('9')).toBe(constants_1.Deck.ranks.nine);
    expect(constants_1.Deck.ranks.byName('8')).toBe(constants_1.Deck.ranks.eight);
    expect(constants_1.Deck.ranks.byName('7')).toBe(constants_1.Deck.ranks.seven);
    expect(constants_1.Deck.ranks.byName('6')).toBe(constants_1.Deck.ranks.six);
    expect(constants_1.Deck.ranks.byName('5')).toBe(constants_1.Deck.ranks.five);
    expect(constants_1.Deck.ranks.byName('4')).toBe(constants_1.Deck.ranks.four);
    expect(constants_1.Deck.ranks.byName('3')).toBe(constants_1.Deck.ranks.three);
    expect(constants_1.Deck.ranks.byName('2')).toBe(constants_1.Deck.ranks.two);
    expect(function () { return constants_1.Deck.ranks.byName('X'); }).toThrow();
    expect(function () { return constants_1.Deck.ranks.byName('1'); }).toThrow();
    expect(function () { return constants_1.Deck.ranks.byName('A '); }).toThrow();
    expect(function () { return constants_1.Deck.ranks.byName(' A'); }).toThrow();
});
test('ranks.parse examples', function () {
    var ranks = constants_1.Deck.ranks;
    expect(constants_1.Deck.ranks.parse('AJT2')).toEqual([ranks.ace, ranks.jack, ranks.ten, ranks.two]);
    expect(constants_1.Deck.ranks.parse('A J  10 2 ')).toEqual([ranks.ace, ranks.jack, ranks.ten, ranks.two]);
    expect(constants_1.Deck.ranks.parse('')).toEqual([]);
    expect(constants_1.Deck.ranks.parse('-')).toEqual([]);
    expect(function () { return constants_1.Deck.ranks.parse('AA'); }).toThrow();
    expect(function () { return constants_1.Deck.ranks.parse('KA'); }).toThrow();
    expect(function () { return constants_1.Deck.ranks.parse('AKQJFred'); }).toThrow();
    expect(function () { return constants_1.Deck.ranks.parse('T10'); }).toThrow();
    expect(function () { return constants_1.Deck.ranks.parse('AJ12'); }).toThrow();
    expect(function () { return constants_1.Deck.ranks.parse('AJ 1 02'); }).toThrow();
    expect(function () { return constants_1.Deck.ranks.parse('--'); }).toThrow();
});
test('Deck.card() method', function () {
    var ranks = constants_1.Deck.ranks;
    var suits = constants_1.Deck.suits;
    expect(constants_1.Deck.card(suits.clubs, ranks.ten).short).toBe('C10');
    expect(constants_1.Deck.card(suits.spades, ranks.two).short).toBe('S2');
});
test('Rank.of()', function () {
    expect(constants_1.Deck.ranks.ace.of(constants_1.Deck.suits.spades)).toBe(constants_1.Deck.cards.byName('SA'));
});
test('Objects should be frozen', function () {
    expect(function () { constants_1.Seats.all = []; }).toThrow();
    expect(function () { constants_1.Seats.north = { name: 'foo', letter: 'f', order: 999 }; }).toThrow();
    expect(function () { constants_1.Seats.north.order = 10; }).toThrow();
});
test('Ranks from bits', function () {
    var ranks = constants_1.Deck.ranks;
    expect(ranks.fromBits(ranks.ace.bit | ranks.jack.bit | ranks.ten.bit)).toEqual([ranks.ace, ranks.jack, ranks.ten]);
});
constants_1.Deck.ranks.each(function (rank) {
    test('Ranks for bits for rank ' + rank.name, function () {
        expect(constants_1.Deck.ranks.fromBits(rank.bit)).toEqual([rank]);
    });
});
test('lookupCardsByName', function () {
    var dt = constants_1.Deck.card(constants_1.Deck.suits.diamonds, constants_1.Deck.ranks.ten);
    expect(constants_1.Deck.cards.byNames('10D', '10d', '10d', '10D', 'dt', 'TD')).toEqual([dt, dt, dt, dt, dt, dt]);
});
