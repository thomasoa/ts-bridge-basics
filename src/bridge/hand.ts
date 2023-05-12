import {Deck, Card, Rank, Suit, PartialSuitRecord, SuitTuple} from './constants'
import {Holding, HoldingLike, SuitHolding} from './holding'

type OptionalHolding = HoldingLike | undefined

class PartialHand {
    static readonly voidH = new Holding(0)
     holdings: PartialSuitRecord<HoldingLike>
     length: number
     spots: number
    
    constructor(holdings: PartialSuitRecord<HoldingLike>={}) {
        this.holdings = holdings
        let length = 0, spots = 0
        this.eachHolding((sh:SuitHolding) => { 
            length += sh.holding.length ; 
            spots += sh.holding.spots 
        })
        this.length = length
        this.spots = spots
    }

    add(card:Card):void {
        this[card.suit.name] = this.safeHolding(card.suit).add(card.rank)
    }

    remove(card:Card):void {
        this[card.suit.name] = this.safeHolding(card.suit).remove(card.rank)
    }

    addSpots(suit:Suit,count:number=1) {
        this[suit.name] = this.safeHolding(suit).addSpots(count)
    }

    holding(suit:Suit):OptionalHolding { 
        return this.holdings[suit.name]
    }

    safeHolding(suit:Suit):HoldingLike { 
        return this.holding(suit) || PartialHand.voidH 
    }
    
    has(card:Card):boolean {
        return this.safeHolding(card.suit).has(card.rank)
    }

    isSpot(card:Card):boolean {
        return this.safeHolding(card.suit).isSpot(card.rank)
    }

    eachHolding(callback: (sh:SuitHolding) => void):void {
        Deck.suits.all.forEach((suit:Suit) => {
            const holding: OptionalHolding = this.holding(suit)
            if (holding) {
                callback({suit: suit,holding: holding})
            }        
        })
    }

    eachCard(callback:(card:Card,isSpot:boolean) => void):void {
        this.eachHolding((sh:SuitHolding) => {
            sh.holding.ranks.forEach((rank:Rank) => callback(rank.of(sh.suit),sh.holding.isSpot(rank)))
        })
    }

    asString(key:"symbol"|"letter"="letter"):string {
        const suits = new Array<string>()
        this.eachHolding((sh:SuitHolding) => {
            suits.push((sh.suit[key] as string)+sh.holding.asString(''))
        })
        return suits.join(' ')
    }   
}

class PartialHandBuilder {
    bits: number[] = new Array<number>(4)
    length: number = 0

    constructor(suits:readonly Suit[]=Deck.suits.all) {
        suits.forEach((suit) => this.bits[suit.order] = 0)
    }

    addCard(card:Card):void {
        if (! this.bits[card.suit.order]) {
            this.bits[card.suit.order] = card.rank.bit
        } else {
            const bits = this.bits[card.suit.order]
        }
        throw new Error('not implemented')
    }
}

export {PartialHand, Suit, SuitTuple}