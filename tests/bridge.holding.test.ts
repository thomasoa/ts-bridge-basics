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
   const holding = Holding.fromRanks([Deck.ranks.ace, Deck.ranks.king, Deck.ranks.two])
   expect(holding.length).toBe(3)
   expect(holding.isVoid()).toBeFalsy()
   expect(holding.toString()).toBe("A K 2")
   expect(holding.asString('')).toBe("AK2")
   expect(holding.bits).toBe((3 << 11) + 1)
   expect(holding.has(Deck.ranks.ace)).toBeTruthy()
   expect(holding.has(Deck.ranks.queen)).toBeFalsy()
   expect(holding.has(Deck.ranks.three)).toBeFalsy()
   expect(holding.has(Deck.ranks.two)).toBeTruthy()
})

test('XHolding basics', () => {
    const xh = new XHolding(new Holding(0),4)
    expect(xh.holding.asString()).toBe('5432')
    expect(xh.asString()).toBe('XXXX')
})