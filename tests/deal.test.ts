import {FullDeal} from '../src/bridge/deal'
import {Deck,Seats} from '../src/bridge/constants'

test('Simple deal constructor', ()=> {
    const whom = Deck.cards.map((card) => Seats.all[Math.floor(card.order/13)])
    const deal = new FullDeal(whom)
    expect(deal.hand(Seats.north).asString()).toBe('SAKQJ1098765432 H- D- C-')
    expect(deal.hand(Seats.east).asString()).toBe('S- HAKQJ1098765432 D- C-')
    expect(deal.hand(Seats.south).asString()).toBe('S- H- DAKQJ1098765432 C-')
    expect(deal.hand(Seats.west).asString()).toBe('S- H- D- CAKQJ1098765432')
    expect(deal.north).toBe(deal.hand(Seats.north))
    expect(deal.east).toBe(deal.hand(Seats.east))
    expect(deal.south).toBe(deal.hand(Seats.south))
    expect(deal.west).toBe(deal.hand(Seats.west))
}) 

test('eachCard whom', () => {
    const whom = Deck.cards.map((card) => Seats.all[Math.floor(card.order/13)])
    const deal = new FullDeal(whom)
    deal.eachCard((card,seat) => {
        expect(seat).toBe(whom[card.order])
    })
    const deal2 = new FullDeal(whom)
    expect(deal.equals(deal2)).toBeTruthy()

    const whom3 = Deck.cards.map((card) => Seats.all[card.order%4])
    const deal3 = new FullDeal(whom3)
    expect(deal.equals(deal3)).toBeFalsy()

})

test('Simple FullDeal failures', ()=> {
    const whom = Deck.cards.map((card) => Seats.all[Math.floor(card.order/13)])
    expect(() => new FullDeal(whom.slice(0,51))).toThrow()
    whom[0] = Seats.west
    expect(() => new FullDeal(whom)).toThrow()

})

test("Deal eachHand", () => {
    const toWhom = Array.from({ length: 52 }, (v, i) => Seats.all[Math.floor(i / 13)])
    const deal = new FullDeal(toWhom)
    const expected = new Map([
       ["north", "SAKQJ1098765432 H- D- C-"],
       ["east", "S- HAKQJ1098765432 D- C-"],
       ['south', 'S- H- DAKQJ1098765432 C-'],
       ['west', 'S- H- D- CAKQJ1098765432']
    ])
    deal.eachHand((seat, hand) => {
       expect(hand.toString()).toBe(expected.get(seat.name))
    })
 })