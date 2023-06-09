import { EnumBooleanMember } from "@babel/types"
import {Deck, Rank, Suit} from "./constants"

interface HoldingLike {
    asString(divider?: string):string
    holding: Holding
    length: number
    spots: number
    ranks: readonly Rank[]
    isSpot(r:Rank):boolean,
    nonSpots:Holding,
    has(r:Rank):boolean,
    add(r:Rank):HoldingLike,
    remove(r:Rank):HoldingLike,
    addSpots(n?:number):HoldingLike,
    removeSpots(n?:number):HoldingLike,
    isDisjoint(h:HoldingLike):boolean,
    union(h:HoldingLike):HoldingLike
}

class Holding {
    /**
     * Immutable holdings of a set of ranks in a single unspecified suits.
     */
    private static lightweightInstances = new Array<Holding>(1<<13 /* 8192 */)

    readonly ranks: readonly Rank[]
    readonly bits:number
    constructor(bits:number) {
        if (bits<0 || bits>= (1<<13)) {
            throw new Error(`bits ${bits} out of range`)
        }

        if (Holding.lightweightInstances[bits]) {
            return Holding.lightweightInstances[bits]
        }
        this.bits = bits
        this.ranks = Deck.ranks.all.filter((rank:Rank) => rank.bit & bits)
        Holding.lightweightInstances[bits] = this
    }
        
    get length() { return this.ranks.length }
        
    asString(divider:string=''):string {
        if (this.length == 0) {
            return '-'
        }
            
        return this.ranks.map((rank)=> rank.brief).join(divider)
    }
        
    isVoid() {
            return this.length == 0
    }

    isDisjoint(h:HoldingLike) {
        return !(this.bits & h.holding.bits)
    }
        
    union(h:HoldingLike):HoldingLike {
        const newH = new Holding(h.nonSpots.bits | this.bits)
        return newH.addSpots(h.spots)
    }

    toString() {
            return this.asString(' ')
    }
        
    has(rank:Rank) {
        return (this.bits & rank.bit) != 0
    }

    remove(rank:Rank) {
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

    addSpots(spots:number=1):HoldingLike {
        if (spots>0) {
            return new XHolding(this,spots)
        }
        return this
    }
    
    removeSpots(spots:number=1):Holding {
        if (spots==0) {return this }
        throw new Error('No spots in holding ' +this.asString())
    }

    get nonSpots():Holding { return this }

    above(rank:Rank):Holding {
        /* Make a holding of the ranks in this holding above the argument rank */
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
    readonly nonSpots: Holding

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

    isDisjoint(h:HoldingLike):boolean {
        if (this.nonSpots.bits & h.nonSpots.bits) {
            return false
        }
        const combined = this.nonSpots.bits | h.nonSpots.bits
        const spotBits = (1<<(this.spots + h.spots))-1
        
        return !(combined&spotBits)
    }
        
    union(h:HoldingLike):HoldingLike {
        const newH = this.nonSpots.union(h)
        return newH.addSpots(this.spots)
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

const parseRE = /^([^X]*)(X*)$/

function parseHolding(start:string):HoldingLike {
    const str = start.replace(/\s/g, '').toUpperCase()
    if (str == '-') {
        return new Holding(0)
    }
    const match = str.match(parseRE)
    if (match) {
        const holding = Holding.forString(match[1] as string)
        const spots = (match[2] as string).length
        if (spots>0) {
            return new XHolding(holding,spots)
        }
        return holding
    }
    throw new Error('Improper holding string "' + start + '" as "' + str +'"')
}

 type SuitHolding = {
    suit:Suit,
    holding: HoldingLike
 }

export {Holding, XHolding, Deck, Rank, HoldingLike, SuitHolding, parseHolding}
