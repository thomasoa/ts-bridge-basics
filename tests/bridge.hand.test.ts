import {PartialHand} from "../src/bridge/hand"
import {Holding, XHolding} from "../src/bridge/holding"

test('partial hand each holding', ()=> {
    const h = Holding.forString
    const partial = new PartialHand([h('A32'),undefined,h('KJ10'),undefined])
    expect(partial.asString()).toBe('SA32 DKJ10')
    expect(partial.length).toBe(6)
})