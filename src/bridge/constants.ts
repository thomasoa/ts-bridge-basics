/**
 * A set of constant describing things related to bridge deals.
 * 
 * Types: Seat, Rank, Suit, 
 * Class: Card
 * Global: Deck, Seats
 * 
 *     Seats.all : Seat[] - Array of all seat objects
 *     Seats.each         - alias for Seats.all.forEach
 *     Seats.map          - alias for Seats.all.map
 *    
 *     Deck.suits.all : Suit[] - Array of all suits
 *     Deck.suits.each, Deck.suits.map 
 *                             - aliases
 * 
 *     Deck.ranks.all: Rank[] - Array of all ranks
 *     Deck.ranks.each, Deck.ranks.map 
 *                            - aliases
 * 
 *     Deck.cards.all: Card[] - All 52 different card values
 *     Deck.cards.each, Deck.cards.map 
 * 
 *     Deck.card(suit:Suit, rank:Rank):Card - returns the card
 * 
 *     Deck.cardByName(name:string):Card - Expects suit first, then rank: 'ST' or 'd10' 
 * 
 *     Seats.nprth, Seats.east, Seats.south, Seats.west
 *     Deck.Ranks.ace, ..., Deck.Ranks.two
 *     Deck.Suits.spades, ..., Deck.Suits.clubs
 * 
 */

import {UpcaseMap} from "../generic/maps"

function f<T>(obj: T): T {
    Object.freeze(obj)
    return obj
}

type SeatName = 'north'|'east'|'south'|'west'
type SeatRecord<T> = Record<SeatName,T>
type PartialSeatRecord<T> = Partial<SeatRecord<T>>

type SeatTuple<T> =  [T,T,T,T]

type SuitName = 'spades'|'hearts'|'diamonds'|'clubs'
type SuitRecord<T> = Record<SuitName,T>
type PartialSuitRecord<T> = Partial<SuitRecord<T>>
type SuitTuple<T> =  [T,T,T,T]
type SeatOrder = 0|1|2|3
class Seat {
    private static readonly AllSeats = new Array<Seat>(4)
    readonly name: SeatName;
    readonly letter: string;
    readonly order: SeatOrder
    constructor(name: SeatName,letter: string,order: SeatOrder) {
        const existing = Seat.AllSeats[order]
        if (existing) {
            return existing
        }
        this.name = name
        this.letter = letter
        this.order = order
        Seat.AllSeats[order] = this
    }

    static get all():readonly Seat[] {
        return Seat.AllSeats
    }

    value<T>(tuple:SeatTuple<T>,value?:T|undefined):T {
        const oldValue = tuple[this.order]
        if (value) {
            tuple[this.order] = value
        }
        return oldValue
    }

    for<T>(record: Readonly<PartialSeatRecord<T>>):T { return record[this.name] }
    set<T>(aRec:PartialSeatRecord<T>,value: T):void { aRec[this.name] = value }
    unset<T>(aRec:PartialSeatRecord<T>):void { delete aRec[this.name]}

    shift(positive:number):Seat {
        return Seat.AllSeats[(this.order + positive)%4]
    }

    get lho():Seat {
        return this.shift(1)
    }

    get partner():Seat {
        return this.shift(2)
    }

    get rho():Seat {
        return this.shift(3)
    }
}

const North = new Seat("north", "N", 0) 
const East = new Seat("east", "E", 1)
const South = new Seat( "south", "S", 2)
const West = new Seat("west", "W", 3)

const SeatNameMap = new UpcaseMap<Seat>()

Seat.all.forEach((seat:Seat) => {
    SeatNameMap.set(seat.name, seat)
    SeatNameMap.set(seat.letter, seat)
})

const AllSeats = Seat.all
const Seats = {
    north: North,
    east: East,
    south: South,
    west: West,
    all: AllSeats,
    each: AllSeats.forEach.bind(AllSeats),
    map: AllSeats.map.bind(AllSeats),
    byText: SeatNameMap.get.bind(SeatNameMap),
    toTuple: toSeatTuple
}

Object.freeze(Seats)

type SuitOrder = 0|1|2|3

type SuitBase = {
    name: SuitName;
    singular: string,
    letter: string;
    symbol: string;
    color: "red"|"black",
    type: "major" | "minor",
    order: SuitOrder,
    summand: number,
}

class Suit {
    readonly name: SuitName
    readonly singular: string
    readonly letter: string
    readonly symbol: string;
    readonly color: "red"|"black"
    readonly type: "major" | "minor"
    readonly order: SuitOrder
    readonly summand: number

    constructor(suit:SuitBase) {
        for (let key in suit) {
            this[key] = suit[key]
        } 
    }

    value<T>(aTuple:SuitTuple<T>,value?:T):T { 
        const origValue = aTuple[this.order] 
        if (value) {
            aTuple[this.order] = value
        }
        return origValue
    }

    for<T>(aRec:PartialSuitRecord<T>):T { return aRec[this.name] }
    set<T>(aRec:PartialSuitRecord<T>,value: T):void { aRec[this.name] = value }
    unset<T>(aRec:PartialSuitRecord<T>):void { delete aRec[this.name]}
}

type RankBrief = 'A'|'K'|'Q'|'J'|'10'|'9'|'8'|'7'|'6'|'5'|'4'|'3'|'2'
type RankName = 'ace'|'king'|'queen'|'jack'|'ten'|'nine'|'eight'|'seven'|'six'|'five'|'four'|'three'|'two'

class Rank {
    brief: RankBrief
    name: RankName
    order: number
    bit: number
    letter: RankBrief|'T'
    summand: number
    
    constructor(brief: RankBrief, name:RankName, order: number, letter: RankBrief|'T' | undefined = undefined) {
        this.brief = brief
        this.name = name
        this.order = order
        this.bit = 1 << (12 - order)
        this.letter = letter || brief
        this.summand = order
        Object.freeze(this)
    }
}

const Spades = new Suit({ 
    name: 'spades', 
    singular: 'spade', 
    letter: 'S', 
    symbol: '\U+2660', 
    color: "black",
    type: "major",
    order: 0, 
    summand: 0 
})

const Hearts = new Suit({ 
    name: 'hearts', 
    singular: 'heart', 
    letter: 'H', 
    symbol: '\U+2665', 
    color: "red",
    type: "major",
    order: 1, 
    summand: 13 * 1 
})

const Diamonds = new Suit({ 
    name: 'diamonds', 
    singular: 'diamond', 
    letter: 'D', 
    symbol: '\U+2666', 
    color:  "red",
    type: "minor",
    order: 2, 
    summand: 13 * 2 
})

const Clubs = new Suit({ 
    name: 'clubs', 
    singular: 'club', 
    letter: 'C', 
    symbol: '\U+2663', 
    color: "black",
    type: "minor",
    order: 3, 
    summand: 13 * 3 
})

const AllSuits: readonly Suit[] = [Spades, Hearts, Diamonds, Clubs]
Object.freeze(AllSuits)

const SuitNameMap  = new UpcaseMap<Suit>()
AllSuits.forEach((suit) => {
    SuitNameMap.set(suit.name,suit)
    SuitNameMap.set(suit.letter,suit)
    SuitNameMap.set(suit.singular,suit)
})

function toSuitTuple<T>(arg:SuitRecord<T>|SuitTuple<T>):SuitTuple<T> {
    if (arg instanceof Array) {
        if (arg.length != 4) {
            throw new Error('Wrong number of suits')
        }
        return arg as SuitTuple<T>
    }
    const argRec = arg as SuitRecord<T>
    return [argRec.spades,argRec.hearts, argRec.diamonds, argRec.clubs]
}

function toSeatTuple<T>(arg:SeatRecord<T>|SeatTuple<T>):SeatTuple<T> {
    if (arg instanceof Array) {
        return arg as SeatTuple<T>
    }
    const argRec = arg as SeatRecord<T>
    return [argRec.north,argRec.east, argRec.south, argRec.west]
}

const Suits = {
    spades: Spades,
    hearts: Hearts,
    diamonds: Diamonds,
    clubs: Clubs,
    all: AllSuits as readonly Suit[],
    majors: [Spades, Hearts] as readonly Suit[],
    minors: [Diamonds, Clubs] as readonly  Suit[],
    each: AllSuits.forEach.bind(AllSuits),
    map: AllSuits.map.bind(AllSuits),
    byText: SuitNameMap.get.bind(SuitNameMap),
    toTuple: toSuitTuple
}

Suits.each(Object.freeze)
Object.freeze(Suits)

class Card {
    suit: Suit;
    rank: Rank;
    short: string;
    shortRS: string;
    order: number;
    constructor(suit: Suit, rank: Rank) {
        this.suit = suit
        this.rank = rank
        this.short = suit.letter + rank.brief
        this.order = rank.order + 13 * suit.order
        Object.freeze(this)
    }
}

const Ace = new Rank('A','ace', 0)
const King = new Rank('K','king', 1)
const Queen = new Rank('Q','queen', 2)
const Jack = new Rank('J','jack', 3)
const Ten = new Rank('10','ten', 4, 'T')
const Nine = new Rank('9', 'nine', 5)
const Eight = new Rank('8','eight', 6)
const Seven = new Rank('7','seven', 7)
const Six = new Rank('6', 'six', 8)
const Five = new Rank('5','five', 9)
const Four = new Rank('4', 'four', 10)
const Three = new Rank('3', 'three', 11)
const Two = new Rank('2', 'two', 12)
const AllRanks: readonly Rank[] = f([Ace, King, Queen, Jack, Ten, Nine, Eight, Seven, Six, Five, Four, Three, Two])

function ranksFromBits(bits: number): Rank[] {
    const ranks = new Array<Rank>()
    AllRanks.forEach((rank) => {
        if (rank.bit & bits) {
            ranks.push(rank)
        }
    })
    return ranks
}

interface RankLookupResult {
    rank: Rank,
    rest: string
}

class RankParser {
    letter: string
    full: string
    rank: Rank
    constructor(text: string, rank: Rank) {
        text = text.toUpperCase()
        this.letter = text.slice(0, 1)
        this.full = text
        this.rank = rank
    }

    get length() { return this.full.length }

    apply(text: string): RankLookupResult {
        text = text.toUpperCase()
        if (text.slice(0, this.length) == this.full) {
            return { rank: this.rank, rest: text.slice(this.length) }
        }
        throw new Error('Invalid card rank ' + text)
    }
}

function createRankParser(): (text: string) => RankLookupResult {
    const map = new UpcaseMap<RankParser>()

    const add = (parser: RankParser): void => {
        map.set(parser.letter, parser)
    }

    AllRanks.forEach((rank) => {
        add(new RankParser(rank.letter, rank))
        if (rank.brief != rank.letter) {
            add(new RankParser(rank.brief, rank))
        }
    })

    return function (text: string): RankLookupResult {
        const parser = map.get(text.slice(0, 1))
        if (parser) {
            return parser.apply(text)
        }
        throw new Error('Invalid rank ' + text)
    }
}

const rankParser = createRankParser()

function rankByText(text: string) {
    text = text.toUpperCase()
    const result = rankParser(text)
    if (result.rest != "") {
        throw new Error('Invalid rank: ' + text)
    }
    return result.rank
}

function ranksByText(text: string) {
    const ranks = new Array<Rank>()
    if (text == '-') {
        return ranks
    }
    let lastOrder = -1
    let rest = text
    while (rest != '') {
        const result = rankParser(rest)
        if (result.rank.order <= lastOrder) {
            throw new Error('Invalid rank order in ' + text)
        }
        ranks.push(result.rank)
        rest = result.rest.trimStart()
        lastOrder = result.rank.order
    }
    return ranks

}

const Ranks = f({
    ace: Ace,
    king: King,
    queen: Queen,
    jack: Jack,
    ten: Ten,
    nine: Nine,
    eight: Eight,
    seven: Seven,
    six: Six,
    five: Five,
    four: Four,
    three: Three,
    two: Two,
    spotChar: 'X',
    all: AllRanks,
    each: AllRanks.forEach.bind(AllRanks),
    map: AllRanks.map.bind(AllRanks),
    fromBits: ranksFromBits,
    byName: rankByText,
    parse: ranksByText
})

function make_cards(): Card[] {
    const cards = new Array<Card>(52)
    Ranks.each((rank) => {
        Suits.each((suit) => {
            const index = suit.summand + rank.summand
            cards[index] = f(new Card(suit, rank))
        })
    })
    return f(cards)
}

const AllCards: readonly Card[] = make_cards()
const CardsByName = new UpcaseMap<Card>()
AllCards.forEach((card:Card) => {
    const rank = card.rank
    const suit = card.suit
    const rankStrings = [rank.brief, rank.letter]
    rankStrings.forEach((rankStr: string) => {
        CardsByName.set(suit.letter + rankStr,card)
        CardsByName.set(rankStr + suit.letter,card)
    })
})

function cardBySuitRank(suit: Suit, rank: Rank) {
    return AllCards[suit.summand + rank.summand]
}

interface Rank {
    of(suit: Suit): Card
}

Rank.prototype.of = function (suit: Suit) { return cardBySuitRank(suit, this) }

function lookupCardByName(name: string) {
    name = name.toUpperCase()
    const card: Card | undefined = CardsByName.get(name)
    if (card) { return card }
    throw Error('Invalid card name ' + name)
}

function lookupCardsByNames(...names: string[]) {
    return names.map(lookupCardByName)
}

const Cards = f({
    all: AllCards,
    each: AllCards.forEach.bind(AllCards),
    map: AllCards.map.bind(AllCards),
    byName: lookupCardByName,
    byNames: lookupCardsByNames
})


const Deck = {
    ranks: Ranks,
    suits: Suits,
    cards: Cards,
    card: cardBySuitRank,
    c: Cards.byName
}
Object.freeze(Deck)

export {
    Deck, Seats, /* constants */
    SeatName, SeatRecord, PartialSeatRecord, SeatTuple,
    SuitName, SuitRecord,  PartialSuitRecord, SuitTuple,
    Suit, Rank, Card, Seat /* types */
}
