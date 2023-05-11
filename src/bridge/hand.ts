import {Deck, Card, Rank, Suit} from './constants'
import {Holding, HoldingLike, SuitHolding} from './holding'

type OptionalHolding = HoldingLike | undefined

type SuitTuple<T> = readonly [T,T,T,T]

class PartialHand {
    static readonly voidH = new Holding(0)
     holdings: SuitTuple<OptionalHolding>
     length: number
     spots: number
    
    constructor(holdings: SuitTuple<OptionalHolding>) {
        this.holdings = holdings
        let length = 0, spots = 0
        this.eachHolding((sh:SuitHolding) => { 
            length += sh.holding.length ; 
            spots += sh.holding.spots 
        })
        this.length = length
        this.spots = spots
    }

    holding(suit:Suit):OptionalHolding { 
        return suit.select(this.holdings)
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
            const holding: OptionalHolding = this.holdings[suit.order]
            if (holding) {
                callback({suit: suit,holding: holding})
            }
        
        })
    }

    eachCard(callback:(card:Card,isSpot:boolean) => void):void {
        const _this = this
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