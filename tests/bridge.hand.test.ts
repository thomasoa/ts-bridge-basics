import {PartialHand} from "../src/bridge/hand"
import {Holding, XHolding} from "../src/bridge/holding"
import {Deck} from "../src/bridge/constants"

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