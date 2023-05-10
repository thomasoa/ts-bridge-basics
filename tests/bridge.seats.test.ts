import { Seats, Seat, SeatTuple } from "../src/bridge/constants"

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
    expect(() => { Seats.north = new Seat('foo', 'f', 0)}).toThrow()
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
