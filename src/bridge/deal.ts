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

    static pbnParse(str:string) {
        const parts = str.split(':')
        if (parts.length!=5) {
            throw new Error('Invalid deal string: ' + str)
        }
        const firstSeat:Seat|undefined = Seats.byText(parts[0])
        if (firstSeat == undefined) {
            throw new Error('Invalid first seat ' + parts[0] + ' for deal ' + str)
        }
        const hands = parts.slice(1).map(part => FullHand.pbnParse(part))
        const toWhom = new Array<Seat>(52)
        let currentSeat = firstSeat
        hands.forEach((hand) => {
            hand.eachCard((card) => { toWhom[card.order]=currentSeat})
            currentSeat = currentSeat.lho
        })
        return new FullDeal(toWhom)
    }

    equals(other:FullDeal):boolean {
        return this.toWhom.every((seat,index)  => seat == other.toWhom[index])
    }
}

export {FullDeal, FullHand}