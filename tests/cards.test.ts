import { Deck } from "../src/bridge/constants"

test("Ensure there are 52 cardsß", () => {
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



test('Deck.card() method',() => {
    const ranks = Deck.ranks
    const suits = Deck.suits
    expect(Deck.card(suits.clubs,ranks.ten).short).toBe('C10')
    expect(Deck.card(suits.spades,ranks.two).short).toBe('S2')
})

test('lookupCardsByName', ()=> {
    const dt = Deck.card(Deck.suits.diamonds, Deck.ranks.ten)
    expect(Deck.cards.byNames('10D','10d','10d', '10D','dt','TD')).toEqual([dt,dt,dt,dt,dt,dt])
}) 