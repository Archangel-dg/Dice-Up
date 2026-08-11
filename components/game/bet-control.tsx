"use client"

import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BET_PRESETS } from "@/lib/game/constants"
import { formatSol } from "@/lib/game/gameLogic"
import { cn } from "@/lib/utils"

export function BetControl({
  bet,
  wallet,
  disabled,
  onChange,
}: {
  bet: number
  wallet: number
  disabled: boolean
  onChange: (next: number) => void
}) {
  const step = bet >= 1 ? 0.5 : 0.05
  const min = BET_PRESETS[0]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Bet
        </span>
        <span className="text-xs text-muted-foreground">
          Balance{" "}
          <span className="font-mono tabular-nums text-foreground">
            {formatSol(wallet)}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card/70 p-1.5">
        <Button
          size="icon"
          variant="ghost"
          className="size-9 shrink-0 rounded-xl"
          disabled={disabled}
          onClick={() => onChange(bet - step)}
          aria-label="Decrease bet"
        >
          <Minus />
        </Button>

        <div className="flex flex-1 items-center justify-center gap-1 font-mono text-base font-bold tabular-nums text-foreground">
          {formatSol(bet)}
          <span className="text-xs font-normal text-muted-foreground">SOL</span>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="size-9 shrink-0 rounded-xl"
          disabled={disabled}
          onClick={() => onChange(bet + step)}
          aria-label="Increase bet"
        >
          <Plus />
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        {BET_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={disabled}
            onClick={() => onChange(preset)}
            className={cn(
              "flex-1 rounded-lg border px-1.5 py-1.5 font-mono text-[11px] font-semibold tabular-nums transition-colors",
              "disabled:pointer-events-none disabled:opacity-40",
              Math.abs(preset - bet) < 0.001
                ? "border-primary/60 bg-primary/15 text-primary"
                : "border-border bg-transparent text-muted-foreground hover:bg-secondary"
            )}
          >
            {preset}
          </button>
        ))}
      </div>

      <span className="sr-only">Minimum bet {min} SOL</span>
    </div>
  )
}
