"use client"

import { AnimatePresence, motion } from "framer-motion"

import { MAX_TOWER_LEVEL } from "@/lib/game/constants"
import { cn } from "@/lib/utils"

type TowerColor = "tower-4" | "tower-5" | "tower-6"
type TowerSize = "sm" | "md" | "lg"

const SIZE_WIDTH: Record<TowerSize, string> = {
  sm: "w-11",
  md: "w-14",
  lg: "w-[4.5rem]",
}

const SIZE_HEIGHT: Record<TowerSize, string> = {
  sm: "h-32",
  md: "h-40",
  lg: "h-48",
}

const COLOR_BG: Record<TowerColor, string> = {
  "tower-4": "bg-tower-4",
  "tower-5": "bg-tower-5",
  "tower-6": "bg-tower-6",
}

const COLOR_TEXT: Record<TowerColor, string> = {
  "tower-4": "text-tower-4",
  "tower-5": "text-tower-5",
  "tower-6": "text-tower-6",
}

const COLOR_SHADOW: Record<TowerColor, string> = {
  "tower-4": "shadow-[0_0_18px_var(--tower-4-glow)]",
  "tower-5": "shadow-[0_0_18px_var(--tower-5-glow)]",
  "tower-6": "shadow-[0_0_22px_var(--tower-6-glow)]",
}

export function Tower({
  label,
  level,
  color,
  size,
  flash,
}: {
  label: string
  level: number
  color: TowerColor
  size: TowerSize
  flash: "up" | "down" | null
}) {
  const slots = Array.from({ length: MAX_TOWER_LEVEL }, (_, i) => i)

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "font-heading text-xs font-bold tracking-wide",
          COLOR_TEXT[color]
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "relative flex flex-col-reverse items-center justify-start gap-[3px] rounded-lg bg-black/20 p-1",
          SIZE_WIDTH[size],
          SIZE_HEIGHT[size]
        )}
      >
        <AnimatePresence initial={false}>
          {slots.map((slotIndex) => {
            const filled = slotIndex < level
            const isTop = slotIndex === level - 1
            return (
              <motion.div
                key={slotIndex}
                initial={filled ? { scaleY: 0, opacity: 0 } : false}
                animate={{ scaleY: 1, opacity: filled ? 1 : 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                style={{ transformOrigin: "bottom" }}
                className={cn(
                  "w-full flex-1 rounded-[3px]",
                  filled
                    ? COLOR_BG[color]
                    : "border border-white/10 bg-white/[0.03]",
                  filled && isTop && flash === "up" && COLOR_SHADOW[color],
                  filled && isTop && flash === "down" && "shadow-[0_0_16px_var(--fail)]"
                )}
              />
            )
          })}
        </AnimatePresence>
      </div>
      <div className="font-mono text-[11px] tabular-nums text-muted-foreground">
        {level}/{MAX_TOWER_LEVEL}
      </div>
    </div>
  )
}
