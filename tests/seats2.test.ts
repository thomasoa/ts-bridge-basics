import {Seat} from "../src/bridge/seat"

test("Ensure the size is right", () => {
    expect(Seat.All.length).toBe(4)
})
