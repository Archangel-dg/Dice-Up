"use client"

import { AnimatePresence, motion } from "framer-motion"
import { PartyPopper, Skull, TrendingDown, TrendingUp, Trophy } from "lucide-react"

import type { LastEvent } from "@/hooks/use-game"
import { formatSol } from "@/lib/game/gameLogic"
import { cn } from "@/lib/utils"

function bannerFor(event: LastEvent) {
  switch (event.kind) {
    case "failed":
      return {
        icon: Skull,
        text: "Busted! Towers collapsed.",
        tone: "fail" as const,
      }
    case "completed":
      return {
        icon: Trophy,
        text: "All towers maxed! Auto cash-out incoming.",
        tone: "gold" as const,
      }
    case "cashed_out":
      return {
        icon: PartyPopper,
        text: `Cashed out +${formatSol(event.amount ?? 0)} SOL`,
        tone: "gold" as const,
      }
    case "roll":
      if (event.outcome === "all_up")
        return { icon: TrendingUp, text: "All towers up!", tone: "up" as const }
      if (event.outcome === "all_down")
        return { icon: TrendingDown, text: "All towers down.", tone: "down" as const }
      return null
    default:
      return null
  }
}

const TONE_CLASSES: Record<string, string> = {
  fail: "border-fail/40 bg-fail/15 text-fail",
  gold: "border-tower-5/40 bg-tower-5/15 text-tower-5",
  up: "border-tower-6/40 bg-tower-6/15 text-tower-6",
  down: "border-fail/40 bg-fail/15 text-fail",
}

export function ResultBanner({ event }: { event: LastEvent | null }) {
  const content = event ? bannerFor(event) : null

  return (
    <div className="pointer-events-none absolute inset-x-0 top-20 z-20 flex justify-center px-4">
      <AnimatePresence mode="wait">
        {content && (
          <motion.div
            key={`${event?.kind}-${event?.value}-${event?.amount}`}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold shadow-xl backdrop-blur-md",
              TONE_CLASSES[content.tone]
            )}
          >
            <content.icon className="size-4" />
            {content.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
