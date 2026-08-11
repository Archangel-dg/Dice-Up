export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6

export interface Towers {
  tower4: number
  tower5: number
  tower6: number
}

export type RollOutcome =
  | "tower4_up"
  | "tower5_up"
  | "tower6_up"
  | "all_up"
  | "all_down"
  | "failed"

export interface RollRecord {
  id: string
  value: DiceValue
  outcome: RollOutcome
  timestamp: number
}

export interface RollResult {
  towers: Towers
  outcome: RollOutcome
  isCompleted: boolean
}

export type GameState =
  | "idle"
  | "rolling"
  | "result"
  | "failed"
  | "cashed_out"
  | "completed"

export interface GameStats {
  rolls: number
  highestMultiplier: number
  highestTower: number
  successfulCashouts: number
  failedGames: number
}

export type SoundEvent =
  | "roll"
  | "tower_up"
  | "tower_down"
  | "all_towers_up"
  | "failed"
  | "cashout"
  | "tower_completed"
