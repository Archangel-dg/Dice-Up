"use client"

import { useEffect, useState } from "react"

import { Tower } from "@/components/game/tower"
import type { RollOutcome, Towers } from "@/lib/game/types"

function flashFor(
  towerKey: "tower4" | "tower5" | "tower6",
  outcome: RollOutcome | undefined
): "up" | "down" | null {
  if (!outcome) return null
  if (outcome === "all_up") return "up"
  if (outcome === "all_down") return "down"
  if (outcome === "tower4_up" && towerKey === "tower4") return "up"
  if (outcome === "tower5_up" && towerKey === "tower5") return "up"
  if (outcome === "tower6_up" && towerKey === "tower6") return "up"
  return null
}

export function TowerBoard({
  towers,
  lastOutcome,
  lastOutcomeKey,
}: {
  towers: Towers
  lastOutcome: RollOutcome | undefined
  lastOutcomeKey: string
}) {
  const [flash, setFlash] = useState<RollOutcome | undefined>(undefined)

  useEffect(() => {
    if (!lastOutcome) return
    setFlash(lastOutcome)
    const timeout = setTimeout(() => setFlash(undefined), 700)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastOutcomeKey])

  return (
    <div className="flex items-end justify-center gap-4 sm:gap-8">
      <Tower
        label="TOWER 4"
        level={towers.tower4}
        color="tower-4"
        size="sm"
        flash={flashFor("tower4", flash)}
      />
      <Tower
        label="TOWER 6"
        level={towers.tower6}
        color="tower-6"
        size="lg"
        flash={flashFor("tower6", flash)}
      />
      <Tower
        label="TOWER 5"
        level={towers.tower5}
        color="tower-5"
        size="md"
        flash={flashFor("tower5", flash)}
      />
    </div>
  )
}
