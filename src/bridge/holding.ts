import {Deck, Rank, Suit} from "./constants"

interface HoldingLike {
    asString(divider?: string):string
    holding: Holding
    length: number
    spots: number
    ranks: readonly Rank[]
    isSpot(r:Rank):boolean,
    has(r:Rank):boolean,
    add(r:Rank):HoldingLike,
    remove(r:Rank):HoldingLike,
    addSpots(n?:number):HoldingLike,
    removeSpots(n?:number):HoldingLike
}

class Holding {
    static lwHoldings = new Array<Holding>(1<<13)

    readonly ranks: readonly Rank[]
    readonly bits:number
    constructor(bits:number) {
        if (Holding.lwHoldings[bits]) {
            return Holding.lwHoldings[bits]
        }
        this.bits = bits
        this.ranks = Deck.ranks.all.filter((rank:Rank) => rank.bit & bits)
        Holding.lwHoldings[bits] = this
    }
        
    get length() { return this.ranks.length }
        
    asString(divider:string=''):string {
        if (this.length == 0) {
            return '-'
        }
            
        return this.ranks.map((rank)=> rank.brief).join(divider)
    }
        
    isVoid():boolean {
            return this.length == 0
    }
        
    toString():string {
            return this.asString(' ')
    }
        
    has(rank:Rank):boolean {
        return (this.bits & rank.bit) != 0
    }

    remove(rank:Rank):Holding {
        if (this.has(rank)) {
            return new Holding(this.bits & ~rank.bit)
        }
        throw new Error('Cannot remove rank '+rank.name +' from holding ' + this.asString())
    }

    add(rank:Rank):Holding {
        if (this.has(rank)) {
            throw new Error('Holding already has rank '+rank.name)
        }
        return new Holding(this.bits | rank.bit)
    }

    addSpots(spots:number=1):XHolding {
        return new XHolding(this,spots)
    }
    
    removeSpots(spots:number=1):Holding {
        if (spots==0) {return this }
        throw new Error('No spots in holding ' +this.asString())
    }

    above(rank:Rank):Holding {
        return new Holding(this.bits & ~((rank.bit<<1)-1))
    }

    aboveEq(rank:Rank):Holding {
        return new Holding(this.bits & ~(rank.bit-1))
    }
    
    below(rank:Rank):Holding {
        return new Holding(this.bits & (rank.bit-1))
    }
    belowEq(rank:Rank):Holding {
        return new Holding(this.bits & ((rank.bit<<1)-1))
    }
    
    static forString(text:string):Holding {
        return  Holding.fromRanks(Deck.ranks.parse(text))
    }

    static fromRanks(ranks:Rank[]):Holding {
        const bits = ranks.reduce((b:number,rank:Rank) => b | rank.bit,0)
        return new Holding(bits)
    }

    get holding():Holding { return this }
    get spots():number { return 0 }

    isSpot(rank:Rank):boolean {
        return false
    }
        
 }

/**
 * Representation of a holding with a number of unknown spots, like AKJX or TXX.
 */ 
class XHolding {
    readonly holding:Holding
    readonly spots:number
    readonly spotBits:number
    private nonSpots: Holding

    constructor(topCards:Holding, spots:number) {
        const spotBits = (1<<spots) -1
        if (spotBits & topCards.bits) {
            // Invalidate examples like '5xxxx'
            throw new Error('Too many spots below lowest rank')
        }
        this.holding = new Holding(topCards.bits | spotBits)
        this.spots = spots
        this.spotBits = spotBits
        this.nonSpots = topCards
    }

    get length() {
        return this.holding.length
    }

    private rankText(rank:Rank) {
        if (rank.order + this.spots <13) { 
            return rank.brief
        }
        return Deck.ranks.spotChar
    }

    asString(divider:string=''):string {
        if (this.length == 0) {
            return '-'
        }
        return this.holding.ranks.map(this.rankText.bind(this)).join(divider)
    }

    get ranks():readonly Rank[] { 
        return this.holding.ranks 
    }

    has(rank:Rank):boolean {
        return this.holding.has(rank)
    }

    isSpot(rank:Rank):boolean {
        return rank.order + this.spots >= 13
    }

    get topSpot():Rank {
        if (this.spots) {
            return Deck.ranks.all[13-this.spots]
        }
        throw new Error('No spots, so no topSpot')
    }

    remove(rank:Rank):XHolding {
        if (this.nonSpots.has(rank)) {
            const h = this.nonSpots
            return new XHolding(h.remove(rank),this.spots)
        }
        throw new Error('Cannot remove rank '+rank.name +' from holding ' + this.asString())
    }

    add(rank:Rank):XHolding {
        if (this.has(rank)) {
            throw new Error('Rank '+ rank.name + ' already in ' + this.asString())
        }
        return new XHolding(this.nonSpots.add(rank) as Holding,this.spots)
    }

    addSpots(spots:number=1):XHolding {
        return new XHolding(this.nonSpots,spots+this.spots)
    }


    removeSpots(spots:number=1):XHolding {
        if (spots > this.spots) {
            throw new RangeError('Cannot remove '+spots+' spot(s) from '+ this.asString())
        }
        return new XHolding(this.nonSpots,this.spots - spots)
    }

}

 type SuitHolding = {
    suit:Suit,
    holding: HoldingLike
 }

export {Holding, XHolding, Deck, Rank, HoldingLike, SuitHolding}
