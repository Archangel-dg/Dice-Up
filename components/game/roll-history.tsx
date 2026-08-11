"use client"

import { cn } from "@/lib/utils"
import type { RollRecord } from "@/lib/game/types"

const OUTCOME_STYLES: Record<RollRecord["outcome"], string> = {
  tower4_up: "border-tower-4/50 bg-tower-4/15 text-tower-4",
  tower5_up: "border-tower-5/50 bg-tower-5/15 text-tower-5",
  tower6_up: "border-tower-6/50 bg-tower-6/15 text-tower-6",
  all_up: "border-emerald-400/50 bg-emerald-400/15 text-emerald-300",
  all_down: "border-orange-400/50 bg-orange-400/15 text-orange-300",
  failed: "border-fail/60 bg-fail/20 text-fail",
}

export function RollHistory({ history }: { history: RollRecord[] }) {
  if (history.length === 0) {
    return (
      <p className="px-1 text-center text-xs text-muted-foreground">
        Your rolls will show up here.
      </p>
    )
  }

  return (
    <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-1 pb-1">
      {history.map((record) => (
        <div
          key={record.id}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold tabular-nums",
            OUTCOME_STYLES[record.outcome]
          )}
          title={record.outcome.replaceAll("_", " ")}
        >
          {record.value}
        </div>
      ))}
    </div>
  )
}
