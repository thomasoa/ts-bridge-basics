import {PartialHand, FullHand} from "../src/bridge/hand"
import {Holding, XHolding} from "../src/bridge/holding"
import {Deck, Card} from "../src/bridge/constants"

test('partial hand each holding', ()=> {
    const R = Deck.ranks
    const S = Deck.suits
    const h = Holding.forString
    const partial = new PartialHand({spades:h('A32'),diamonds: h('KJ10')})
    expect(partial.asString()).toBe('SA32 DKJ10')
    expect(partial.length).toBe(6)
    expect(partial.has(R.ace.of(S.spades))).toBeTruthy()
    expect(partial.has(R.queen.of(S.hearts))).toBeFalsy()
    expect(partial.has(R.queen.of(S.diamonds))).toBeFalsy()
    
})

test('partial hand with X holdings', ()=> {
    const R = Deck.ranks
    const S = Deck.suits
    const h = (str:string,spots:number) => new XHolding(Holding.forString(str),spots)
    const partial = new PartialHand({spades:h('A',2),diamonds: h('KJ10',3)})
    expect(partial.asString()).toBe('SAXX DKJ10XXX')
    expect(partial.length).toBe(9)
    expect(partial.has(R.ace.of(S.spades))).toBeTruthy()
    expect(partial.has(R.queen.of(S.hearts))).toBeFalsy()
    expect(partial.has(R.queen.of(S.diamonds))).toBeFalsy()

    expect(partial.isSpot(R.ace.of(S.spades))).toBeFalsy()
    expect(partial.isSpot(R.ace.of(S.hearts))).toBeFalsy()
    expect(partial.isSpot(R.three.of(S.spades))).toBeTruthy()
    
    const nonSpots = new Array<String>()
    const spots = new Array<String>()
    partial.eachCard((card:Card ,spot:boolean) => {
        if (!spot) { 
            nonSpots.push(card.short) 
        } else {
            spots.push(card.short)
        }
    })
    expect(nonSpots).toEqual(['SA','DK','DJ','D10'])
    expect(spots).toEqual(['S3','S2','D4','D3','D2'])
    
})

test('Partial hand add and remove methods', ()=> {
    const s = Deck.suits
    const r = Deck.ranks
    const hand = new PartialHand()
    expect(hand.length).toBe(0)
    hand.add(r.jack.of(s.spades))
    hand.add(r.ten.of(s.diamonds))
    expect(hand.length).toBe(2)
    expect(hand.asString()).toBe('SJ D10')
    expect(() => hand.add(r.jack.of(s.spades))).toThrow()
    expect(() => hand.remove(r.ace.of(s.spades))).toThrow()
    hand.addSpots(s.clubs,3)
    expect(hand.asString()).toBe('SJ D10 CXXX')
    hand.addSpots(s.clubs)
    expect(hand.asString()).toBe('SJ D10 CXXXX')
    hand.remove(r.jack.of(s.spades))
    expect(hand.asString()).toBe('S- D10 CXXXX')
})

test('addHolding successful calls', () => {
    const hand = new PartialHand({spades: Holding.forString('Q102')})
    hand.addHolding(Deck.suits.diamonds,Holding.forString('AJ2'))
    expect(hand.asString()).toBe('SQ102 DAJ2')
    hand.addHolding(Deck.suits.spades,Holding.forString('K93'))
    expect(hand.asString()).toBe('SKQ10932 DAJ2')
})

test('addHolding successful calls', () => {
    const hand = new PartialHand({spades: Holding.forString('Q102')})
    expect(() => hand.addHolding(Deck.suits.spades,Holding.forString('Q93'))).toThrow()
})

test('FullHand constructor', () => {
    const hs = Holding.forString
    const hand = new FullHand({spades: hs('AJ1032'), hearts: hs('Q987'), diamonds: hs('5432'), clubs: hs('-')})
    expect(hand.asString()).toBe('SAJ1032 HQ987 D5432 C-')
    expect(hand.suit(Deck.suits.spades).asString()).toBe('AJ1032')
    const cards:string[] = []
    hand.eachCard((card:Card) => cards.push(card.short))
    expect(cards).toEqual(['SA','SJ','S10','S3','S2', 'HQ','H9','H8','H7','D5','D4','D3','D2'])
})
