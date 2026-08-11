"use client"

import { useCallback, useMemo, useRef, useState } from "react"

import { useLocalStorage } from "@/hooks/use-local-storage"
import {
  DEFAULT_BET,
  EMPTY_STATS,
  EMPTY_TOWERS,
  MAX_HISTORY,
  RESULT_DISPLAY_MS,
  ROLL_ANIMATION_MS,
  STARTING_BALANCE,
  STORAGE_KEYS,
} from "@/lib/game/constants"
import {
  applyRoll,
  calculatePayout,
  getMultiplier,
  highestTowerLevel,
  isValidBet,
  rollDie,
} from "@/lib/game/gameLogic"
import type {
  DiceValue,
  GameState,
  GameStats,
  RollRecord,
  SoundEvent,
  Towers,
} from "@/lib/game/types"

export interface LastEvent {
  kind: "roll" | "cashed_out" | "failed" | "completed"
  value?: DiceValue
  outcome?: RollRecord["outcome"]
  amount?: number
}

export function useGame() {
  const [wallet, setWallet, walletMeta] = useLocalStorage(
    STORAGE_KEYS.wallet,
    STARTING_BALANCE
  )
  const [soundOn, setSoundOn] = useLocalStorage(STORAGE_KEYS.sound, true)
  const [musicOn, setMusicOn] = useLocalStorage(STORAGE_KEYS.music, false)
  const [stats, setStats] = useLocalStorage<GameStats>(
    STORAGE_KEYS.stats,
    EMPTY_STATS
  )
  const [history, setHistory] = useLocalStorage<RollRecord[]>(
    STORAGE_KEYS.history,
    []
  )

  const [bet, setBet] = useState(DEFAULT_BET)
  const [activeBet, setActiveBet] = useState(DEFAULT_BET)
  const [towers, setTowers] = useState<Towers>(EMPTY_TOWERS)
  const [gameState, setGameState] = useState<GameState>("idle")
  const [roundActive, setRoundActive] = useState(false)
  const [lastEvent, setLastEvent] = useState<LastEvent | null>(null)

  const soundHandlerRef = useRef<((event: SoundEvent) => void) | null>(null)
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const towersRef = useRef<Towers>(towers)
  towersRef.current = towers

  const setSoundHandler = useCallback(
    (handler: (event: SoundEvent) => void) => {
      soundHandlerRef.current = handler
    },
    []
  )

  const playSound = useCallback((event: SoundEvent) => {
    soundHandlerRef.current?.(event)
  }, [])

  const multiplier = useMemo(() => getMultiplier(towers), [towers])
  const potentialPayout = useMemo(
    () => calculatePayout(roundActive ? activeBet : bet, multiplier),
    [roundActive, activeBet, bet, multiplier]
  )

  const canEditBet = !roundActive && gameState !== "rolling"
  const canRoll =
    gameState !== "rolling" &&
    gameState !== "failed" &&
    gameState !== "cashed_out" &&
    (roundActive || isValidBet(bet, wallet))
  const canCashOut =
    roundActive && gameState !== "rolling" && gameState !== "failed"

  const clearPendingTimer = useCallback(() => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current)
      clearTimerRef.current = null
    }
  }, [])

  const roll = useCallback(
    (forcedValue?: DiceValue) => {
      if (gameState === "rolling") return
      if (!roundActive) {
        if (!isValidBet(bet, wallet)) return
        setWallet((w) => Math.max(0, w - bet))
        setActiveBet(bet)
        setRoundActive(true)
      }

      setGameState("rolling")
      playSound("roll")
      clearPendingTimer()

      clearTimerRef.current = setTimeout(() => {
        const value = forcedValue ?? rollDie()
        const result = applyRoll(towersRef.current, value)

        setTowers(result.towers)

        setStats((prevStats) => ({
          ...prevStats,
          rolls: prevStats.rolls + 1,
          highestTower: Math.max(
            prevStats.highestTower,
            highestTowerLevel(result.towers)
          ),
          failedGames:
            result.outcome === "failed"
              ? prevStats.failedGames + 1
              : prevStats.failedGames,
        }))

        setHistory((prev) => {
          const record: RollRecord = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            value,
            outcome: result.outcome,
            timestamp: Date.now(),
          }
          return [record, ...prev].slice(0, MAX_HISTORY)
        })

        if (result.outcome === "failed") {
          setLastEvent({
            kind: "failed",
            value,
            outcome: result.outcome,
            amount: calculatePayout(activeBet, multiplier),
          })
          setGameState("failed")
          setRoundActive(false)
          playSound("failed")
          clearTimerRef.current = setTimeout(() => {
            setGameState("idle")
          }, RESULT_DISPLAY_MS)
        } else if (result.isCompleted) {
          setLastEvent({ kind: "completed", value, outcome: result.outcome })
          setGameState("completed")
          playSound("tower_completed")

          clearTimerRef.current = setTimeout(() => {
            const payout = calculatePayout(
              activeBet,
              getMultiplier(result.towers)
            )
            setWallet((w) => w + payout)
            setStats((prev) => ({
              ...prev,
              successfulCashouts: prev.successfulCashouts + 1,
              highestMultiplier: Math.max(
                prev.highestMultiplier,
                getMultiplier(result.towers)
              ),
            }))
            setLastEvent({ kind: "cashed_out", amount: payout })
            setTowers(EMPTY_TOWERS)
            setRoundActive(false)
            setGameState("cashed_out")
            playSound("cashout")

            clearTimerRef.current = setTimeout(() => {
              setGameState("idle")
            }, RESULT_DISPLAY_MS)
          }, RESULT_DISPLAY_MS)
        } else {
          setLastEvent({ kind: "roll", value, outcome: result.outcome })
          setGameState("result")
          playSound(
            result.outcome === "all_up"
              ? "all_towers_up"
              : result.outcome === "all_down"
                ? "tower_down"
                : "tower_up"
          )
          clearTimerRef.current = setTimeout(() => {
            setGameState("idle")
          }, RESULT_DISPLAY_MS)
        }
      }, ROLL_ANIMATION_MS)
    },
    [
      activeBet,
      bet,
      clearPendingTimer,
      gameState,
      multiplier,
      playSound,
      roundActive,
      setHistory,
      setStats,
      setWallet,
      wallet,
    ]
  )

  const cashOut = useCallback(() => {
    if (!canCashOut) return
    const payout = calculatePayout(activeBet, multiplier)

    setWallet((w) => w + payout)
    setStats((prev) => ({
      ...prev,
      successfulCashouts: prev.successfulCashouts + 1,
      highestMultiplier: Math.max(prev.highestMultiplier, multiplier),
    }))
    setLastEvent({ kind: "cashed_out", amount: payout })
    setTowers(EMPTY_TOWERS)
    setRoundActive(false)
    setGameState("cashed_out")
    playSound("cashout")

    clearPendingTimer()
    clearTimerRef.current = setTimeout(() => {
      setGameState("idle")
    }, RESULT_DISPLAY_MS)
  }, [
    activeBet,
    canCashOut,
    clearPendingTimer,
    multiplier,
    playSound,
    setStats,
    setWallet,
  ])

  const updateBet = useCallback(
    (nextBet: number) => {
      if (!canEditBet) return
      setBet(Math.min(Math.max(0.01, nextBet), Math.max(0.01, wallet)))
    },
    [canEditBet, wallet]
  )

  const resetDemo = useCallback(() => {
    clearPendingTimer()
    walletMeta.reset()
    setStats(EMPTY_STATS)
    setHistory([])
    setBet(DEFAULT_BET)
    setActiveBet(DEFAULT_BET)
    setTowers(EMPTY_TOWERS)
    setGameState("idle")
    setRoundActive(false)
    setLastEvent(null)
  }, [clearPendingTimer, setHistory, setStats, walletMeta])

  return {
    wallet,
    bet,
    setBet: updateBet,
    activeBet,
    towers,
    multiplier,
    potentialPayout,
    gameState,
    roundActive,
    lastEvent,
    history,
    stats,
    soundOn,
    musicOn,
    toggleSound: () => setSoundOn((v) => !v),
    toggleMusic: () => setMusicOn((v) => !v),
    setSoundHandler,
    roll,
    cashOut,
    resetDemo,
    canRoll,
    canCashOut,
    canEditBet,
    hydrated: walletMeta.hydrated,
  }
}

export type UseGameReturn = ReturnType<typeof useGame>
