import { Deck } from "../src/bridge/constants"

test("Ensure there are four suits", () => {
    expect(Deck.suits.all.length).toBe(4)
})
