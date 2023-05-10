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
    const r = Deck.ranks
   const holding = Holding.fromRanks([r.ace, r.king, r.five, r.two])
   const holding2 = Holding.forString('AK52')
   expect(holding).toBe(holding2)
   expect(holding.length).toBe(4)
   expect(holding.isVoid()).toBeFalsy()
   expect(holding.toString()).toBe("A K 5 2")
   expect(holding.asString()).toBe("AK52")
   expect(holding.bits).toBe(r.ace.bit | r.king.bit | r.five.bit | r.two.bit )
   expect(holding.has(r.ace)).toBeTruthy()
   expect(holding.has(r.queen)).toBeFalsy()
   expect(holding.has(r.three)).toBeFalsy()
   expect(holding.has(r.five)).toBeTruthy()
   expect(holding.has(r.two)).toBeTruthy()
   expect(holding.holding).toBe(holding)
   expect(holding.spots).toBe(0)
   expect(holding.above(r.five)).toBe(Holding.forString('AK'))
   expect(holding.aboveEq(r.five)).toBe(Holding.forString('AK5'))
   expect(holding.belowEq(r.five)).toBe(Holding.forString('52'))
   expect(holding.below(r.five)).toBe(Holding.forString('2'))
   expect(holding.isSpot(r.two)).toBeFalsy()
   expect(holding.remove(r.five).asString()).toBe('AK2')
   expect(() => holding.remove(Deck.ranks.queen)).toThrow()
   expect(() => holding.remove(Deck.ranks.three)).toThrow()

})

test('XHolding basics', () => {
    const xh = new XHolding(Holding.forString('AJ'),4)
    expect(xh.length).toBe(6)
    expect(xh.holding).toBe(Holding.forString('AJ5432'))
    expect(xh.topSpot).toBe(Deck.ranks.five)
    expect(xh.asString()).toBe('AJXXXX')
    expect(xh.isSpot(Deck.ranks.five)).toBeTruthy()
    expect(xh.isSpot(Deck.ranks.six)).toBeFalsy()
    expect(xh.remove(Deck.ranks.jack).asString()).toBe('AXXXX')
    expect(xh.remove(Deck.ranks.five).asString()).toBe('AJXXX')
    expect(xh.remove(Deck.ranks.two).asString()).toBe('AJXXX')
    expect(() => xh.remove(Deck.ranks.queen)).toThrow()
    expect(() => xh.remove(Deck.ranks.six)).toThrow()
})

test('XHolding void', ()=> {
    const voidXH = new XHolding(new Holding(0),0)
    expect(voidXH.asString()).toBe('-')
    expect(voidXH.length).toBe(0)
    expect(() => voidXH.topSpot).toThrow()
})

test('XHolding constructor throws exception', ()=> {
    expect(() => new XHolding(Holding.forString('A5'),4)).toThrow()
})