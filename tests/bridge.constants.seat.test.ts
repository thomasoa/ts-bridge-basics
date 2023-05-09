import { Seats, Seat } from "../src/bridge/constants"

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
    expect(() => { Seats.north = { name:'foo', letter:'f', order:999 } }).toThrow()
    expect(() => { Seats.north.order = 10 }).toThrow()
})


test("Ensure seat orders are in agreement", () => {
}) 
