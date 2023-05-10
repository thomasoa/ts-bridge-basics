import {Deck, Card, Rank, Suit} from './constants'
import {Holding, XHolding, HoldingLike} from './holding'

type OptionalHolding = HoldingLike | undefined

type SuitTuple<T> = readonly [T,T,T,T]

class PartialHand {
    static readonly voidH = new Holding(0)
    readonly holdings: SuitTuple<OptionalHolding>
    readonly length: number

    constructor(holdings: SuitTuple<OptionalHolding>) {
        this.holdings = holdings
        let length = 0
        this.eachHolding((s:Suit,h:HoldingLike) => { length += h.length})
        this.length = length
    }

    holding(suit:Suit):OptionalHolding { return this.holdings[suit.order] }

    safeHolding(suit:Suit):HoldingLike { 
        return this.holding(suit) || PartialHand.voidH 
    }
    
    has(card:Card):boolean {
        return this.safeHolding(card.suit).has(card.rank)
    }

    isSpot(card:Card):boolean {
        return this.safeHolding(card.suit).isSpot(card.rank)
    }
    
    eachHolding(callback: (suit:Suit,holding:HoldingLike) => void):void {
        Deck.suits.all.forEach((suit:Suit) => {
            const holding: OptionalHolding = this.holdings[suit.order]
            if (holding) {
                callback(suit,holding)
            }
        })
    }

    eachCard(callback:(card:Card,isSpot:boolean) => void):void {
        const _this = this
        this.eachHolding((suit:Suit, h:HoldingLike) => {
            h.ranks.forEach((rank:Rank) => callback(rank.of(suit),h.isSpot(rank)))
        })
    }

    asString(key:"symbol"|"letter"="letter"):string {
        const suits = new Array<string>()
        this.eachHolding((suit:Suit,holding:HoldingLike) => {
            suits.push((suit[key] as string)+holding.asString(''))
        })
        return suits.join(' ')
    }

    
}

export {PartialHand, Suit, SuitTuple, }