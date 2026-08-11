"use client"

import { useEffect, useRef, useState } from "react"
import { Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatSol } from "@/lib/game/gameLogic"

function useAnimatedNumber(value: number, duration = 500) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (to - from) * eased)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return display
}

export function BankDisplay({
  bank,
  delta,
}: {
  bank: number
  delta?: { amount: number; key: number } | null
}) {
  const animated = useAnimatedNumber(bank)

  return (
    <div className="relative flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 shadow-lg backdrop-blur-sm">
      <span className="flex size-7 items-center justify-center rounded-full bg-accent/15">
        <Coins className="size-4 text-accent" />
      </span>
      <span className="font-heading text-lg font-bold tabular-nums tracking-tight text-foreground">
        {formatSol(animated)}
      </span>

      {delta && delta.amount !== 0 ? (
        <span
          key={delta.key}
          className={cn(
            "pointer-events-none absolute -top-6 right-2 text-sm font-bold tabular-nums",
            "animate-[float-up_1.1s_ease-out_forwards]",
            delta.amount > 0 ? "text-emerald-400" : "text-fail",
          )}
        >
          {delta.amount > 0 ? "+" : ""}
          {formatSol(delta.amount)}
        </span>
      ) : null}
    </div>
  )
}
