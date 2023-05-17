import { Seats, Seat, SeatTuple, SeatRecord, PartialSeatRecord } from "../src/bridge/constants"

test("Ensure the size is right", () => {
    expect(Seats.all.length).toBe(4)
})

test("Ensure seat orders are in agreement", () => {
    Seats.each((seat: Seat, index: number) => {
        expect(seat.order).toBe(index)
    })
})

test("Ensure named seats are correct", () => {
    expect(Seats.north.name).toBe("north")
    expect(Seats.east.name).toBe("east")
    expect(Seats.south.name).toBe("south")
    expect(Seats.west.name).toBe("west")
}) 

test('Objects should be frozen', ()=> {
    expect(() => { Seats.all = [] }).toThrow()
    expect(() => { Seats.north = new Seat('north', 'f', 0)}).toThrow()
})


test("Ensure lho, partner, rho are correct", () => {
    expect(Seats.north.lho).toBe(Seats.east)
    expect(Seats.north.rho).toBe(Seats.west)
    expect(Seats.north.partner).toBe(Seats.south)

    expect(Seats.east.lho).toBe(Seats.south)
    expect(Seats.east.rho).toBe(Seats.north)
    expect(Seats.east.partner).toBe(Seats.west)

    expect(Seats.south.lho).toBe(Seats.west)
    expect(Seats.south.rho).toBe(Seats.east)
    expect(Seats.south.partner).toBe(Seats.north)

    expect(Seats.west.lho).toBe(Seats.north)
    expect(Seats.west.rho).toBe(Seats.south)
    expect(Seats.west.partner).toBe(Seats.east)

}) 

test('Seat.select from SeatTuple', ()=> {
    const st:SeatTuple<String> = ['a','b','c','d']
    expect(Seats.north.select(st)).toBe('a')
    expect(Seats.east.select(st)).toBe('b')
    expect(Seats.south.select(st)).toBe('c')
    expect(Seats.west.select(st)).toBe('d')
})

test('SeatRecord accessors', ()=>{
    const record:SeatRecord<number> = {north: 1, south: 2, east: 3, west: 4}
    expect(Seats.north.for(record)).toBe(1)
    expect(Seats.south.for(record)).toBe(2)
    expect(Seats.east.for(record)).toBe(3)
    expect(Seats.west.for(record)).toBe(4)
    Seats.west.set(record,6)
    expect(Seats.west.for(record)).toBe(6)
})

test('PartialSeatRecord accessors', ()=>{
    const pRec:PartialSeatRecord<string> = {north: 'a', east: 'b'}
    expect(Seats.north.for(pRec)).toBe('a')
    expect(Seats.south.for(pRec)).toBeUndefined()
    expect(Seats.east.for(pRec)).toBe('b')
    expect(Seats.west.for(pRec)).toBeUndefined()
    Seats.east.unset(pRec)
    expect(Seats.east.for(pRec)).toBeUndefined()
    Seats.west.set(pRec,'c')
    expect(Seats.west.for(pRec)).toBe('c')

}) 

test('toTuple', () => {
    var tuple:SeatTuple<string> = ['a','b','c','d']
    var record = {north: 1, south: 2, east: 3, west:4}
    expect(Seats.toTuple(tuple)).toBe(tuple)
    expect(Seats.toTuple(record)).toStrictEqual([1,3,2,4])
})
