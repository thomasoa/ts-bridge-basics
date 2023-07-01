export type SeatNumber = 0|1|2|3
export type SeatTuple<T> = [T,T,T,T]
export type SeatName = "north"|"east"|"south"|"west"
export type SeatRecord<T> = Record<SeatName,T>
const SeatNames: SeatTuple<SeatName> = ["north","east","south","west"]
const SeatNumbers: SeatRecord<SeatNumber> = {
    north: 0,
    east: 1,
    south: 2,
    west: 3
}

function seatMap<T>(func:(name:SeatName,order:SeatNumber) => T ): SeatTuple<T> {
    return SeatNames.map((name:SeatName,index) => func(name,index as SeatNumber)) as SeatTuple<T>
}

function convertToSeatRecord<T>(tuple:SeatTuple<T>):SeatRecord<T> {
    const record:Partial<SeatRecord<T>> = {}
    SeatNames.forEach((name,index) => {
        record[name] = tuple[index]
    })
    return record as SeatRecord<T>
}

function convertToSeatTuple<T>(record:SeatRecord<T>):SeatTuple<T> {
    return SeatNames.map((name) => record[name]) as SeatTuple<T>
}

function shiftSeat(seatNo:SeatNumber,positiveShift:number):SeatNumber {
    return (seatNo+positiveShift) % 4 as SeatNumber
}

function lho(seatNo:SeatNumber):SeatNumber {
    return shiftSeat(seatNo,1)
}

function rho(seatNo:SeatNumber):SeatNumber {
    return shiftSeat(seatNo,3)
}

function partner(seatNo:SeatNumber):SeatNumber {
    return shiftSeat(seatNo,2)
}

export class Seat {
    static readonly All: SeatTuple<Seat> = SeatNames.map((name:SeatName,index) => new Seat(name,index as SeatNumber)) as SeatTuple<Seat>


    readonly name: SeatName
    readonly order: SeatNumber
    readonly lhoNumber:SeatNumber 
    readonly rhoNumber:SeatNumber
    readonly partnerNumber: SeatNumber

    public constructor(name:SeatName,order:SeatNumber) {
        if (Seat.All) {
            return Seat.All[order]
        }

        this.name = name
        this.order = order
        this.lhoNumber = lho(order)
        this.rhoNumber = rho(order)
        this.partnerNumber = partner(order)
    }

    lho() { return Seat.All[this.lhoNumber] }
    
    rho() { return Seat.All[this.rhoNumber] }
    
    partner() {
        return Seat.All[this.partnerNumber]
    }

    for<T>(tupleOrRecord: SeatTuple<T>|SeatRecord<T>): T {
        if (typeof(tupleOrRecord) == 'object') {
            return tupleOrRecord[this.name]
        } else {
            return tupleOrRecord[this.order]
        }
    }
}

type SeatLanguageKeys = "name" | "letter"
type SeatLanguage = Record<SeatLanguageKeys,string>
type SeatsLanguage = SeatRecord<SeatLanguage>

export const EnglishSeats: SeatsLanguage = convertToSeatRecord(seatMap((name:SeatName,order:SeatNumber) => {
    return {
        name: name,
        letter: name.slice(0,1).toUpperCase()
    }   
}))

