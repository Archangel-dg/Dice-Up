import type { GameStats, Towers } from "./types"

/**
 * Developer test mode. When true, a "TEST ROLL" panel is rendered that lets
 * the developer force a specific dice value to quickly exercise every game
 * state. Set to false to hide it (e.g. for a production build).
 */
export const DEV_MODE = true

export const MAX_TOWER_LEVEL = 7
export const MIN_TOWER_LEVEL = 0

export const BASE_MULTIPLIER = 1
export const TOWER_6_STEP = 0.75
export const TOWER_5_STEP = 0.45
export const TOWER_4_STEP = 0.25

/** Guaranteed cashout multiplier once all three towers hit MAX_TOWER_LEVEL. */
export const COMPLETION_MULTIPLIER = 25

export const STARTING_BALANCE = 10
export const DEFAULT_BET = 0.1

export const BET_PRESETS = [0.01, 0.05, 0.1, 0.25, 0.5, 1] as const

export const EMPTY_TOWERS: Towers = { tower4: 0, tower5: 0, tower6: 0 }

export const EMPTY_STATS: GameStats = {
  rolls: 0,
  highestMultiplier: 1,
  highestTower: 0,
  successfulCashouts: 0,
  failedGames: 0,
}

export const MAX_HISTORY = 10

export const ROLL_ANIMATION_MS = 900
export const RESULT_PAUSE_MS = 400
export const RESULT_DISPLAY_MS = 1400

export const STORAGE_KEYS = {
  wallet: "diceup:wallet",
  sound: "diceup:sound",
  music: "diceup:music",
  stats: "diceup:stats",
  history: "diceup:history",
} as const
