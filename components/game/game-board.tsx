"use client"

import { useEffect, useRef, useState } from "react"

import { ActionBar } from "@/components/game/action-bar"
import { BetControl } from "@/components/game/bet-control"
import { Dice } from "@/components/game/dice"
import { GameMenu } from "@/components/game/game-menu"
import { ResultBanner } from "@/components/game/result-banner"
import { RollHistory } from "@/components/game/roll-history"
import { TopBar } from "@/components/game/top-bar"
import { TowerBoard } from "@/components/game/tower-board"
import { useGame } from "@/hooks/use-game"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import { DEV_MODE } from "@/lib/game/constants"
import type { DiceValue } from "@/lib/game/types"

export function GameBoard() {
  const game = useGame()
  const playSound = useSoundEffects(game.soundOn)
  const [menuOpen, setMenuOpen] = useState(false)
  const [diceFace, setDiceFace] = useState<DiceValue>(1)
  const [bankDelta, setBankDelta] = useState<{
    amount: number
    key: number
  } | null>(null)
  const lastEventKeyRef = useRef(0)
  const prevWalletRef = useRef(game.wallet)

  useEffect(() => {
    game.setSoundHandler(playSound)
  }, [game, playSound])

  useEffect(() => {
    if (game.lastEvent?.value) {
      setDiceFace(game.lastEvent.value)
    }
  }, [game.lastEvent])

  useEffect(() => {
    if (!game.hydrated) {
      prevWalletRef.current = game.wallet
      return
    }
    const diff = game.wallet - prevWalletRef.current
    if (diff !== 0) {
      lastEventKeyRef.current += 1
      setBankDelta({ amount: diff, key: lastEventKeyRef.current })
    }
    prevWalletRef.current = game.wallet
  }, [game.wallet, game.hydrated])

  const isRolling = game.gameState === "rolling"

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_60%)]"
      />

      <TopBar
        bank={game.wallet}
        delta={bankDelta}
        onOpenMenu={() => setMenuOpen(true)}
      />

      <ResultBanner event={game.lastEvent} />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 py-6">
        <TowerBoard
          towers={game.towers}
          lastOutcome={game.lastEvent?.outcome}
          lastOutcomeKey={game.history[0]?.id ?? "none"}
        />
        <Dice value={diceFace} rolling={isRolling} />
      </main>

      <div className="relative z-10 flex flex-col gap-3 px-4">
        <RollHistory history={game.history} />
      </div>

      <div className="safe-bottom relative z-10 mt-4 flex flex-col gap-3 rounded-t-3xl border-t border-border bg-card/40 p-4 backdrop-blur-md">
        <BetControl
          bet={game.bet}
          wallet={game.wallet}
          disabled={!game.canEditBet}
          onChange={game.setBet}
        />
        <ActionBar
          roundActive={game.roundActive}
          canRoll={game.canRoll}
          canCashOut={game.canCashOut}
          isRolling={isRolling}
          multiplier={game.multiplier}
          potentialPayout={game.potentialPayout}
          onRoll={() => game.roll()}
          onCashOut={game.cashOut}
        />

        {DEV_MODE && (
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Test roll
            </span>
            {([1, 2, 3, 4, 5, 6] as const).map((n) => (
              <button
                key={n}
                type="button"
                disabled={!game.canRoll}
                onClick={() => game.roll(n)}
                className="flex size-6 items-center justify-center rounded-md border border-border bg-secondary text-[11px] font-bold text-muted-foreground transition-colors hover:bg-secondary/70 disabled:opacity-40"
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      <GameMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        soundOn={game.soundOn}
        musicOn={game.musicOn}
        onToggleSound={game.toggleSound}
        onToggleMusic={game.toggleMusic}
        stats={game.stats}
        onReset={game.resetDemo}
      />
    </div>
  )
}
