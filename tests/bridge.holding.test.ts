import {Holding, XHolding} from "../src/bridge/holding"
import { Deck, Rank} from "../src/bridge/constants"

test("Holding void", () => {
   const holding = new Holding(0)
   expect(holding.length).toBe(0)
   expect(holding.isVoid()).toBeTruthy()
   expect(holding.toString()).toBe('-')
   expect(holding.asString(',')).toBe('-')
   expect(holding.bits).toBe(0)
   Deck.ranks.each((rank) => {
      expect(holding.has(rank)).toBeFalsy()
   })
   
   // Check that the same holdings are identical objects
   expect(holding === new Holding(0)).toBeTruthy()
})

test("AK2 Holding", () => {
   const holding = Holding.fromRanks([Deck.ranks.ace, Deck.ranks.king, Deck.ranks.five, Deck.ranks.two])
   const holding2 = Holding.forString('AK52')
   expect(holding).toBe(holding2)
   expect(holding.length).toBe(4)
   expect(holding.isVoid()).toBeFalsy()
   expect(holding.toString()).toBe("A K 5 2")
   expect(holding.asString()).toBe("AK52")
   expect(holding.bits).toBe((3 << 11) + (1 << 3) + 1)
   expect(holding.has(Deck.ranks.ace)).toBeTruthy()
   expect(holding.has(Deck.ranks.queen)).toBeFalsy()
   expect(holding.has(Deck.ranks.three)).toBeFalsy()
   expect(holding.has(Deck.ranks.five)).toBeTruthy()
   expect(holding.has(Deck.ranks.two)).toBeTruthy()
   expect(holding.holding).toBe(holding)
   expect(holding.spots).toBe(0)
   expect(holding.above(Deck.ranks.two)).toBe(Holding.forString('AK5'))
   expect(holding.aboveEq(Deck.ranks.five)).toBe(Holding.forString('AK5'))
   expect(holding.belowEq(Deck.ranks.five)).toBe(Holding.forString('52'))
   expect(holding.below(Deck.ranks.five)).toBe(Holding.forString('2'))
})

test('XHolding basics', () => {
    const xh = new XHolding(Holding.forString('AJ'),4)
    expect(xh.length).toBe(6)
    expect(xh.holding).toBe(Holding.forString('AJ5432'))
    expect(xh.asString()).toBe('AJXXXX')
})

test('XHolding void', ()=> {
    const voidXH = new XHolding(new Holding(0),0)
    expect(voidXH.asString()).toBe('-')
    expect(voidXH.length).toBe(0)
})

test('XHolding constructor throws exception', ()=> {
    expect(() => new XHolding(Holding.forString('A5'),4)).toThrow()
})