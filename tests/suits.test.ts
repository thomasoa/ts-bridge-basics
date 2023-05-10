import { Deck, Suit, SuitTuple} from "../src/bridge/constants"

test("Ensure there are four suits", () => {
    expect(Deck.suits.all.length).toBe(4)
})

test('Seat.select from SeatTuple', ()=> {
    const st:SuitTuple<String> = ['a','b','c','d']
    expect(Deck.suits.spades.select(st)).toBe('a')
    expect(Deck.suits.hearts.select(st)).toBe('b')
    expect(Deck.suits.diamonds.select(st)).toBe('c')
    expect(Deck.suits.clubs.select(st)).toBe('d')
})