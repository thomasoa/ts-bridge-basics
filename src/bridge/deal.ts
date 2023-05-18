import {SeatTuple, SuitTuple, Card, Deck, Seat} from './constants'
import {FullHand} from './hand'
import {Holding} from './holding'

class FullDeal {
    private hands:SeatTuple<FullHand> 

    constructor(whom:Seat[]) {
        const bits:SeatTuple<SuitTuple<number>> = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ]
        Deck.cards.each((card:Card) => {
            const seat = whom[card.order]
            let newBits = card.rank.bit | card.suit.value(seat.value(bits))
            card.suit.value(seat.value(bits),newBits)
        })
        this.hands = bits.map((handBits)=> {
            const holdings:SuitTuple<Holding> = handBits.map(
                (suitBits) => new Holding(suitBits)
            ) as SuitTuple<Holding>
            return new FullHand(holdings)
        }) as SeatTuple<FullHand>
    }

    hand(seat:Seat):FullHand {
        return seat.value(this.hands)
    }
}

export {FullDeal}