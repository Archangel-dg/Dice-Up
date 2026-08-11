"use client"

import { Dices, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatMultiplier, formatSol } from "@/lib/game/gameLogic"
import { cn } from "@/lib/utils"

export function ActionBar({
  roundActive,
  canRoll,
  canCashOut,
  isRolling,
  multiplier,
  potentialPayout,
  onRoll,
  onCashOut,
}: {
  roundActive: boolean
  canRoll: boolean
  canCashOut: boolean
  isRolling: boolean
  multiplier: number
  potentialPayout: number
  onRoll: () => void
  onCashOut: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {roundActive && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-card/70 px-4 py-2.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Multiplier
          </span>
          <span className="font-heading text-lg font-bold tabular-nums text-accent">
            {formatMultiplier(multiplier)}
          </span>
        </div>
      )}

      <div className="flex gap-2.5">
        {roundActive && (
          <Button
            size="lg"
            variant="secondary"
            disabled={!canCashOut}
            onClick={onCashOut}
            className={cn(
              "h-14 flex-1 rounded-2xl text-base font-bold",
              "border border-tower-5/40 bg-tower-5/15 text-tower-5 hover:bg-tower-5/25"
            )}
          >
            <Wallet data-icon="inline-start" />
            Cash out {formatSol(potentialPayout)}
          </Button>
        )}

        <Button
          size="lg"
          disabled={!canRoll}
          onClick={onRoll}
          className={cn(
            "h-14 flex-1 rounded-2xl text-base font-bold",
            !roundActive && "flex-[2]"
          )}
        >
          <Dices data-icon="inline-start" />
          {isRolling ? "Rolling…" : roundActive ? "Roll again" : "Place bet & roll"}
        </Button>
      </div>
    </div>
  )
}
