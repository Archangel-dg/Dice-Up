"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

const PIP_LAYOUT: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

function DiceFace({ value }: { value: number }) {
  const active = new Set(PIP_LAYOUT[value] ?? [4])
  return (
    <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1.5 p-3">
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="flex items-center justify-center">
          {active.has(i) && (
            <span className="size-[18%] min-h-2 min-w-2 rounded-full bg-foreground shadow-[0_0_6px_rgba(0,0,0,0.4)]" />
          )}
        </div>
      ))}
    </div>
  )
}

export function Dice({
  value,
  rolling,
}: {
  value: number
  rolling: boolean
}) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (!rolling) {
      setDisplayValue(value)
      return
    }
    const interval = setInterval(() => {
      setDisplayValue(1 + Math.floor(Math.random() * 6))
    }, 90)
    return () => clearInterval(interval)
  }, [rolling, value])

  return (
    <div className="[perspective:800px]">
      <motion.div
        animate={
          rolling
            ? { rotateX: [0, 360, 720, 1080], rotateY: [0, 180, 360, 540], scale: [1, 1.08, 1.08, 1] }
            : { rotateX: 0, rotateY: 0, scale: 1 }
        }
        transition={
          rolling
            ? { duration: 0.9, ease: "easeInOut" }
            : { type: "spring", stiffness: 300, damping: 20 }
        }
        className={cn(
          "size-20 rounded-2xl border border-white/15 bg-card",
          "shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]"
        )}
      >
        <DiceFace value={displayValue} />
      </motion.div>
    </div>
  )
}
