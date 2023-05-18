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

test('toTuple', () => {
    var tuple:SuitTuple<string> = ['a','b','c','d']
    var record = {spades: 1, clubs: 2, hearts: 3, diamonds:4}
    expect(Deck.suits.toTuple(tuple)).toBe(tuple)
    expect(Deck.suits.toTuple(record)).toStrictEqual([1,3,4,2])
})

test('suit record unset', ()=>{
    var record = {spades: 1, hearts: 2, clubs: 3}
    Deck.suits.hearts.unset(record)
    expect(record).toEqual({spades:1, clubs: 3})
})
