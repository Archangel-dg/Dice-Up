"use client"

import { Music, RotateCcw, Volume2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { formatMultiplier } from "@/lib/game/gameLogic"
import type { GameStats } from "@/lib/game/types"

export function GameMenu({
  open,
  onOpenChange,
  soundOn,
  musicOn,
  onToggleSound,
  onToggleMusic,
  stats,
  onReset,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  soundOn: boolean
  musicOn: boolean
  onToggleSound: () => void
  onToggleMusic: () => void
  stats: GameStats
  onReset: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle>Settings & stats</SheetTitle>
          <SheetDescription>
            Adjust sound and review your session so far.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4">
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Sound effects
                </span>
              </div>
              <Switch checked={soundOn} onCheckedChange={onToggleSound} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Music
                </span>
              </div>
              <Switch checked={musicOn} onCheckedChange={onToggleMusic} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Session stats
            </span>
            <div className="grid grid-cols-2 gap-2">
              <StatCell label="Rolls" value={String(stats.rolls)} />
              <StatCell
                label="Best multiplier"
                value={formatMultiplier(stats.highestMultiplier)}
              />
              <StatCell label="Cashouts" value={String(stats.successfulCashouts)} />
              <StatCell label="Busts" value={String(stats.failedGames)} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 p-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                Reset demo wallet
              </span>
              <span className="text-xs text-muted-foreground">
                Restores balance and clears stats
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={onReset}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>

          <Badge variant="secondary" className="w-fit">
            Demo currency, not real SOL
          </Badge>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-card/40 p-2.5">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-sm font-bold tabular-nums text-foreground">
        {value}
      </span>
    </div>
  )
}
