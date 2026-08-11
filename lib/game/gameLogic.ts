import {
  BASE_MULTIPLIER,
  COMPLETION_MULTIPLIER,
  MAX_TOWER_LEVEL,
  MIN_TOWER_LEVEL,
  TOWER_4_STEP,
  TOWER_5_STEP,
  TOWER_6_STEP,
} from "./constants"
import type { DiceValue, RollOutcome, RollResult, Towers } from "./types"

/** Clamp a tower level into the valid [0, 7] range. Never NaN, never Infinity. */
export function clampTowerLevel(level: number): number {
  if (Number.isNaN(level)) return MIN_TOWER_LEVEL
  if (level === Infinity) return MAX_TOWER_LEVEL
  if (level === -Infinity) return MIN_TOWER_LEVEL
  return Math.min(MAX_TOWER_LEVEL, Math.max(MIN_TOWER_LEVEL, Math.round(level)))
}

export function isMaxedOut(towers: Towers): boolean {
  return (
    towers.tower4 === MAX_TOWER_LEVEL &&
    towers.tower5 === MAX_TOWER_LEVEL &&
    towers.tower6 === MAX_TOWER_LEVEL
  )
}

/**
 * Computes the current cashout multiplier for a given tower state.
 * Returns the flat COMPLETION_MULTIPLIER once every tower is fully built.
 */
export function getMultiplier(towers: Towers): number {
  if (isMaxedOut(towers)) return COMPLETION_MULTIPLIER

  const multiplier =
    BASE_MULTIPLIER +
    towers.tower6 * TOWER_6_STEP +
    towers.tower5 * TOWER_5_STEP +
    towers.tower4 * TOWER_4_STEP

  return Number.isFinite(multiplier) ? multiplier : BASE_MULTIPLIER
}

/** Fair 1-6 die roll. Pass a custom rng (0-1) for deterministic testing. */
export function rollDie(rng: () => number = Math.random): DiceValue {
  const value = Math.floor(rng() * 6) + 1
  return Math.min(6, Math.max(1, value)) as DiceValue
}

/**
 * Pure reducer: applies a dice value to the current tower state and
 * returns the resulting towers plus the outcome classification.
 */
export function applyRoll(towers: Towers, value: DiceValue): RollResult {
  let next: Towers = { ...towers }
  let outcome: RollOutcome

  switch (value) {
    case 6:
      next.tower6 = clampTowerLevel(towers.tower6 + 1)
      outcome = "tower6_up"
      break
    case 5:
      next.tower5 = clampTowerLevel(towers.tower5 + 1)
      outcome = "tower5_up"
      break
    case 4:
      next.tower4 = clampTowerLevel(towers.tower4 + 1)
      outcome = "tower4_up"
      break
    case 3:
      next = {
        tower4: clampTowerLevel(towers.tower4 + 1),
        tower5: clampTowerLevel(towers.tower5 + 1),
        tower6: clampTowerLevel(towers.tower6 + 1),
      }
      outcome = "all_up"
      break
    case 2:
      next = {
        tower4: clampTowerLevel(towers.tower4 - 1),
        tower5: clampTowerLevel(towers.tower5 - 1),
        tower6: clampTowerLevel(towers.tower6 - 1),
      }
      outcome = "all_down"
      break
    case 1:
    default:
      next = { tower4: 0, tower5: 0, tower6: 0 }
      outcome = "failed"
      break
  }

  return { towers: next, outcome, isCompleted: isMaxedOut(next) }
}

/** Computes the payout for a cashout given the locked-in bet and multiplier. */
export function calculatePayout(bet: number, multiplier: number): number {
  if (!Number.isFinite(bet) || !Number.isFinite(multiplier)) return 0
  const payout = bet * multiplier
  return Number.isFinite(payout) && payout > 0 ? payout : 0
}

export function isValidBet(bet: number, walletBalance: number): boolean {
  return (
    Number.isFinite(bet) &&
    bet > 0 &&
    Number.isFinite(walletBalance) &&
    bet <= walletBalance
  )
}

export function highestTowerLevel(towers: Towers): number {
  return Math.max(towers.tower4, towers.tower5, towers.tower6)
}

export function formatSol(value: number): string {
  if (!Number.isFinite(value)) return "0.00"
  return value.toFixed(2)
}

export function formatMultiplier(value: number): string {
  if (!Number.isFinite(value)) return "1.00x"
  return `${value.toFixed(2)}x`
}
