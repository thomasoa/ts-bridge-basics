import {Deck, Rank} from "./constants"

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

    static forString(text:string):Holding {
        return  Holding.fromRanks(Deck.ranks.parse(text))
    }

    static fromRanks(ranks:Rank[]):Holding {
        const bits = ranks.reduce((b:number,rank:Rank) => b | rank.bit,0)
        return new Holding(bits)
    }
        
 }
        
export {Holding, Deck, Rank}
