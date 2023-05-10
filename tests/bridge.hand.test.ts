import {PartialHand} from "../src/bridge/hand"
import {Holding, XHolding} from "../src/bridge/holding"
import {Deck, Card} from "../src/bridge/constants"

test('partial hand each holding', ()=> {
    const R = Deck.ranks
    const S = Deck.suits
    const h = Holding.forString
    const partial = new PartialHand([h('A32'),undefined,h('KJ10'),undefined])
    expect(partial.asString()).toBe('SA32 DKJ10')
    expect(partial.length).toBe(6)
    expect(partial.has(R.ace.of(S.spades))).toBeTruthy()
    expect(partial.has(R.queen.of(S.hearts))).toBeFalsy()
    expect(partial.has(R.queen.of(S.diamonds))).toBeFalsy()
    
})

test('partial hand with X holdings', ()=> {
    const R = Deck.ranks
    const S = Deck.suits
    const h = Holding.forString
    const partial = new PartialHand([new XHolding(h('A'),2),undefined,new XHolding(h('KJ10'),3),undefined])
    expect(partial.asString()).toBe('SAXX DKJ10XXX')
    expect(partial.length).toBe(9)
    expect(partial.has(R.ace.of(S.spades))).toBeTruthy()
    expect(partial.has(R.queen.of(S.hearts))).toBeFalsy()
    expect(partial.has(R.queen.of(S.diamonds))).toBeFalsy()
    
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

