import { describe, expect, it } from "vitest"

import { EMPTY_TOWERS } from "./constants"
import { applyRoll, calculatePayout, clampTowerLevel, getMultiplier } from "./gameLogic"

describe("applyRoll", () => {
  it("roll 6 increments only tower6", () => {
    const { towers, outcome } = applyRoll(EMPTY_TOWERS, 6)
    expect(towers).toEqual({ tower4: 0, tower5: 0, tower6: 1 })
    expect(outcome).toBe("tower6_up")
  })

  it("roll 5 increments only tower5", () => {
    const { towers, outcome } = applyRoll(EMPTY_TOWERS, 5)
    expect(towers).toEqual({ tower4: 0, tower5: 1, tower6: 0 })
    expect(outcome).toBe("tower5_up")
  })

  it("roll 4 increments only tower4", () => {
    const { towers, outcome } = applyRoll(EMPTY_TOWERS, 4)
    expect(towers).toEqual({ tower4: 1, tower5: 0, tower6: 0 })
    expect(outcome).toBe("tower4_up")
  })

  it("roll 3 increments all towers", () => {
    const { towers, outcome } = applyRoll(EMPTY_TOWERS, 3)
    expect(towers).toEqual({ tower4: 1, tower5: 1, tower6: 1 })
    expect(outcome).toBe("all_up")
  })

  it("roll 2 decrements all towers, floored at 0", () => {
    const { towers, outcome } = applyRoll(EMPTY_TOWERS, 2)
    expect(towers).toEqual({ tower4: 0, tower5: 0, tower6: 0 })
    expect(outcome).toBe("all_down")
  })

  it("roll 1 resets all towers to 0 and fails", () => {
    const { towers, outcome } = applyRoll({ tower4: 5, tower5: 6, tower6: 7 }, 1)
    expect(towers).toEqual({ tower4: 0, tower5: 0, tower6: 0 })
    expect(outcome).toBe("failed")
  })

  it("never exceeds level 7", () => {
    const { towers } = applyRoll({ tower4: 7, tower5: 7, tower6: 7 }, 6)
    expect(towers.tower6).toBe(7)
  })

  it("never drops below level 0", () => {
    const { towers } = applyRoll(EMPTY_TOWERS, 2)
    expect(towers.tower4).toBeGreaterThanOrEqual(0)
    expect(towers.tower5).toBeGreaterThanOrEqual(0)
    expect(towers.tower6).toBeGreaterThanOrEqual(0)
  })

  it("flags isCompleted once all towers are maxed", () => {
    const { isCompleted } = applyRoll({ tower4: 7, tower5: 7, tower6: 6 }, 6)
    expect(isCompleted).toBe(true)
  })
})

describe("clampTowerLevel", () => {
  it("clamps values above 7", () => {
    expect(clampTowerLevel(20)).toBe(7)
  })
  it("clamps values below 0", () => {
    expect(clampTowerLevel(-5)).toBe(0)
  })
  it("handles NaN and Infinity safely", () => {
    expect(clampTowerLevel(NaN)).toBe(0)
    expect(clampTowerLevel(Infinity)).toBe(7)
  })
})

describe("getMultiplier", () => {
  it("computes the base multiplier for empty towers", () => {
    expect(getMultiplier(EMPTY_TOWERS)).toBe(1)
  })

  it("computes the example from the spec: 3/1/1 -> 3.95x", () => {
    expect(getMultiplier({ tower4: 1, tower5: 1, tower6: 3 })).toBeCloseTo(3.95)
  })

  it("returns 25x once all towers reach level 7", () => {
    expect(getMultiplier({ tower4: 7, tower5: 7, tower6: 7 })).toBe(25)
  })
})

describe("calculatePayout", () => {
  it("multiplies bet by multiplier", () => {
    expect(calculatePayout(0.1, 3.95)).toBeCloseTo(0.395)
  })

  it("never returns NaN or Infinity", () => {
    expect(calculatePayout(NaN, 3)).toBe(0)
    expect(calculatePayout(0.1, Infinity)).toBe(0)
  })
})
