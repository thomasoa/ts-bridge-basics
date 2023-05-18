import {SeatTuple, SuitTuple, Card, Deck, Seat, Seats} from './constants'
import {FullHand} from './hand'
import {Holding} from './holding'

class FullDeal {
    private hands:SeatTuple<FullHand> 
    readonly toWhom: readonly Seat[]

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
        this.toWhom = whom
    }
    
    eachCard(method: (card:Card,seat:Seat) => void ):void {
        this.toWhom.forEach((seat:Seat, index:number) => method(Deck.cards.all[index],seat))
    }


    hand(seat:Seat):FullHand {
        return seat.value(this.hands)
    }

    get north():FullHand { return this.hand(Seats.north)}
    get east():FullHand { return this.hand(Seats.east)}
    get south():FullHand { return this.hand(Seats.south)}
    get west():FullHand { return this.hand(Seats.west)}

    eachHand(method: (seat:Seat,hand:FullHand)=> void):void {
        this.hands.forEach((hand,index) => method(Seats.all[index],hand))           
    }

    equals(other:FullDeal):boolean {
        this.toWhom.forEach((seat,index)  => {
            if (seat != other.toWhom[index]) {
                return false
            }
        })
        return true
    }
}

export {FullDeal, FullHand}