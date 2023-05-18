import {Deck, Card, Rank, Suit, PartialSuitRecord, SuitRecord, SuitTuple} from './constants'
import {Holding, HoldingLike, SuitHolding} from './holding'

type OptionalHolding = HoldingLike | undefined

class PartialHand {
    static readonly voidH = new Holding(0)
     holdings: PartialSuitRecord<HoldingLike>
     length: number
     spots: number
    
    constructor(holdings: PartialSuitRecord<HoldingLike>={}) {
        this.holdings = {...holdings} // Copy
        let length = 0, spots = 0
        this.eachHolding((sh:SuitHolding) => { 
            length += sh.holding.length ; 
            spots += sh.holding.spots 
        })
        this.length = length
        this.spots = spots
    }

    add(card:Card):void {
        card.suit.set(this.holdings, this.safeHolding(card.suit).add(card.rank))
        this.length++
    }

    remove(card:Card):void {
        card.suit.set(this.holdings, this.safeHolding(card.suit).remove(card.rank))
        this.length--
    }

    addSpots(suit:Suit,count:number=1) {
        suit.set(this.holdings, this.safeHolding(suit).addSpots(count))
        this.length += count
    }

    addHolding(suit:Suit,holding:HoldingLike):void {
        const current = this.safeHolding(suit)
        if (current.isDisjoint(holding)) {
            suit.set(this.holdings, current.union(holding))
        } else {
            throw new Error('Holdding ' + this.asString() + ' is not disjoint fron ' + holding.asString())
        }
    }

    holding(suit:Suit):OptionalHolding { 
        return suit.for(this.holdings)
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

class FullHand {
    private readonly holdings: SuitTuple<Holding>

    constructor(holdings:SuitRecord<Holding>|SuitTuple<Holding>) {
        this.holdings = Deck.suits.toTuple(holdings)
        const length = this.holdings.reduce((prev,h) => prev+ h.length, 0)
        if (length != 13) {
            throw new Error(`Hand must have 13 cardds, got ${length} cards`)
        }
    }

    suit(suit:Suit):Holding {
        return suit.value(this.holdings)
    }
    
    has(card:Card):boolean {
        return this.suit(card.suit).has(card.rank)
    }

    get spades():Holding { return this.suit(Deck.suits.spades) }
    get hearts():Holding { return this.suit(Deck.suits.hearts) }
    get diamonds():Holding { return this.suit(Deck.suits.diamonds) }
    get clubs():Holding { return this.suit(Deck.suits.clubs) }

    eachSuit(callback: (h:Holding,suit:Suit) => void):void {
        Deck.suits.all.forEach((suit:Suit) => {
            callback(this.suit(suit),suit)
        })
    }

    eachCard(callback: (c:Card) => void):void {
        this.eachSuit((holding,suit) => {
            holding.ranks.forEach((rank) => { callback(rank.of(suit))})
        })
    }

    holding(suit:Suit):Holding {
        return suit.value(this.holdings)
    }

    eachHolding(callback: (sh:SuitHolding) => void):void {
        Deck.suits.all.forEach((suit:Suit) => {
            const holding: OptionalHolding = this.holding(suit)
            callback({suit: suit,holding: holding})
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

export {PartialHand, Suit, SuitRecord, PartialSuitRecord, FullHand}