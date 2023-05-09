import { Deck, Rank } from "../src/bridge/constants"

test("Ensure the sizes are right", () => {
    expect(Deck.suits.all.length).toBe(4)
    expect(Deck.ranks.all.length).toBe(13)
    expect(Deck.cards.all.length).toBe(52)
})

test('cards.byName when card does not exist', () => {
    expect(() => Deck.cards.byName('NA')).toThrow()
})

test("Ensure suit orders are in agreement", () => {
    Deck.suits.each((suit, index) => {
        expect(suit.order).toBe(index)
    })
})

test("Ensure rank orders agree with the linear order", () => {
    expect(Deck.ranks.all[0]).toBe(Deck.ranks.ace)
    Deck.ranks.each((rank, index) => {
        expect(rank.order).toBe(index)
    })
})

test("Ensure card orders agree with the linear order", () => {
    Deck.cards.each((card, index) => {
        expect(card.order).toBe(index)
    })

})

test("Deck.cards.byName lookup", () => {
    const spadeThree = Deck.cards.byName('S3')
    expect(spadeThree.suit).toBe(Deck.suits.spades)
    expect(spadeThree.rank).toBe(Deck.ranks.three)

    const clubAce = Deck.cards.byName('ca')
    expect(clubAce.suit).toBe(Deck.suits.clubs)
    expect(clubAce.rank).toBe(Deck.ranks.ace)

})

test('ranks.byName examples',() => {
    expect(Deck.ranks.byName('A')).toBe(Deck.ranks.ace)
    expect(Deck.ranks.byName('a')).toBe(Deck.ranks.ace)
    expect(Deck.ranks.byName('K')).toBe(Deck.ranks.king)
    expect(Deck.ranks.byName('Q')).toBe(Deck.ranks.queen)
    expect(Deck.ranks.byName('J')).toBe(Deck.ranks.jack)
    expect(Deck.ranks.byName('T')).toBe(Deck.ranks.ten)
    expect(Deck.ranks.byName('10')).toBe(Deck.ranks.ten)
    expect(Deck.ranks.byName('9')).toBe(Deck.ranks.nine)
    expect(Deck.ranks.byName('8')).toBe(Deck.ranks.eight)
    expect(Deck.ranks.byName('7')).toBe(Deck.ranks.seven)
    expect(Deck.ranks.byName('6')).toBe(Deck.ranks.six)
    expect(Deck.ranks.byName('5')).toBe(Deck.ranks.five)
    expect(Deck.ranks.byName('4')).toBe(Deck.ranks.four)
    expect(Deck.ranks.byName('3')).toBe(Deck.ranks.three)
    expect(Deck.ranks.byName('2')).toBe(Deck.ranks.two)

    expect(() => Deck.ranks.byName('X')).toThrow()
    expect(() => Deck.ranks.byName('1')).toThrow()
    expect(() => Deck.ranks.byName('A ')).toThrow()
    expect(() => Deck.ranks.byName(' A')).toThrow()


})

test('ranks.parse examples', () => {
    const ranks = Deck.ranks
    expect(Deck.ranks.parse('AJT2')).toEqual([ranks.ace,ranks.jack, ranks.ten, ranks.two])
    expect(Deck.ranks.parse('A J  10 2 ')).toEqual([ranks.ace,ranks.jack, ranks.ten, ranks.two])
    expect(Deck.ranks.parse('')).toEqual([])
    expect(Deck.ranks.parse('-')).toEqual([])

    expect(() => Deck.ranks.parse('AA')).toThrow()
    expect(() => Deck.ranks.parse('KA')).toThrow()
    expect(() => Deck.ranks.parse('AKQJFred')).toThrow()
    expect(() => Deck.ranks.parse('T10')).toThrow()
    expect(() => Deck.ranks.parse('AJ12')).toThrow()
    expect(() => Deck.ranks.parse('AJ 1 02')).toThrow()
    expect(() => Deck.ranks.parse('--')).toThrow()

})

test('Deck.card() method',() => {
    const ranks = Deck.ranks
    const suits = Deck.suits
    expect(Deck.card(suits.clubs,ranks.ten).short).toBe('C10')
    expect(Deck.card(suits.spades,ranks.two).short).toBe('S2')
})

test('Rank.of()',()=>{
    expect(Deck.ranks.ace.of(Deck.suits.spades)).toBe(Deck.cards.byName('SA'))
})

test('Ranks from bits', ()=> {
    const ranks = Deck.ranks
    expect(ranks.fromBits(ranks.ace.bit|ranks.jack.bit|ranks.ten.bit)).toEqual([ranks.ace,ranks.jack,ranks.ten])
})

Deck.ranks.each((rank:Rank) => {
    test('Ranks for bits for rank ' + rank.name , () => {
        expect(Deck.ranks.fromBits(rank.bit)).toEqual([rank])
    })
})

test('lookupCardsByName', ()=> {
    const dt = Deck.card(Deck.suits.diamonds, Deck.ranks.ten)
    expect(Deck.cards.byNames('10D','10d','10d', '10D','dt','TD')).toEqual([dt,dt,dt,dt,dt,dt])
}) 