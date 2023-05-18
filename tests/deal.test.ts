import {FullDeal} from '../src/bridge/deal'
import {Deck,Seats} from '../src/bridge/constants'

test('Simple deal constructor', ()=> {
    const whom = Deck.cards.map((card) => Seats.all[Math.floor(card.order/13)])
    const deal = new FullDeal(whom)
    expect(deal.hand(Seats.north).asString()).toBe('SAKQJ1098765432 H- D- C-')
    expect(deal.hand(Seats.east).asString()).toBe('S- HAKQJ1098765432 D- C-')
    expect(deal.hand(Seats.south).asString()).toBe('S- H- DAKQJ1098765432 C-')
    expect(deal.hand(Seats.west).asString()).toBe('S- H- D- CAKQJ1098765432')
}) 

test('Simple FullDeal failures', ()=> {
    const whom = Deck.cards.map((card) => Seats.all[Math.floor(card.order/13)])
    expect(() => new FullDeal(whom.slice(0,51))).toThrow()
    whom[0] = Seats.west
    expect(() => new FullDeal(whom)).toThrow()

})