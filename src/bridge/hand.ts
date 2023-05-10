import {Deck, Card, Rank, Suit} from './constants'
import {Holding, XHolding, HoldingLike} from './holding'

type OptionalHolding = HoldingLike | undefined

type SuitTuple<T> = readonly [T,T,T,T]

class PartialHand {
    readonly holdings: SuitTuple<OptionalHolding>
    readonly length: number

    constructor(holdings: SuitTuple<OptionalHolding>) {
        this.holdings = holdings
        let length = 0
        this.eachHolding((s:Suit,h:HoldingLike) => { length += h.length})
        this.length = length
    }

    holding(suit:Suit):OptionalHolding { return this.holdings[suit.order] }

    eachHolding(callback: (suit:Suit,holding:HoldingLike) => void):void {
        Deck.suits.all.forEach((suit:Suit) => {
            const holding: OptionalHolding = this.holdings[suit.order]
            if (holding) {
                callback(suit,holding)
            }
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