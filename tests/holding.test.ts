import {Holding, XHolding, parseHolding} from "../src/bridge/holding"
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
   expect(holding.nonSpots).toBe(holding)
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
    expect(xh.removeSpots().asString()).toBe('AJXXX')
    expect(xh.removeSpots(4).asString()).toBe('AJ')
    expect(xh.addSpots().asString()).toBe('AJXXXXX')
    expect(xh.addSpots(3).asString()).toBe('AJXXXXXXX')
    expect(() => xh.remove(Deck.ranks.five).asString()).toThrow()
    expect(() => xh.remove(Deck.ranks.two).asString()).toThrow()
    expect(() => xh.remove(Deck.ranks.queen)).toThrow()
    expect(() => xh.remove(Deck.ranks.six)).toThrow()
    expect(() => xh.removeSpots(5)).toThrow()
    expect(() => xh.addSpots(6)).toThrow()

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

test('Holding.add(rank)  Holding.remove(rank)', ()=> {
    const r = Deck.ranks
    const HS = Holding.forString
    const h = HS('KJ105')
    expect(h.add(r.ace)).toBe(HS('AKJ105'))
    expect(h.remove(r.king)).toBe(HS('J105'))
    expect(h.addSpots().asString()).toBe('KJ105X')
    expect(h.addSpots(2).asString()).toBe('KJ105XX')
    expect(h.removeSpots(0)).toBe(h)
    expect(() => h.remove(r.ace)).toThrow()
    expect(() => h.add(r.king)).toThrow()
    expect(() => h.addSpots(4)).toThrow()
    expect(() => h.removeSpots()).toThrow()
    expect(() => h.removeSpots(2)).toThrow()

})


test('XHolding.add(rank)  XHolding.remove(rank)', ()=> {
    const r = Deck.ranks
    const HS = (hs,spots) => new XHolding(Holding.forString(hs),spots)
    const h = HS('KJ107',3)
    expect(h.add(r.ace).asString()).toBe('AKJ107XXX')
    expect(h.remove(r.king).asString()).toBe('J107XXX')
    expect(() => h.remove(r.ace)).toThrow()
    expect(() => h.add(r.king)).toThrow()
})

test('parseHolding', ()=> {
    const hAJ6x = parseHolding(' Aj6 x')
    expect(hAJ6x.asString()).toBe('AJ6X')

    expect(parseHolding('')).toBe(new Holding(0))
    expect(parseHolding(' - ')).toBe(new Holding(0))
    expect(hAJ6x).toBeInstanceOf(XHolding)

    const hK10543 = parseHolding(' kt 543')
    expect(hK10543).toBeInstanceOf(Holding)

    expect(() => parseHolding('AJX2')).toThrow()
})