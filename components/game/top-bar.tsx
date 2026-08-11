"use client"

import Image from "next/image"
import { Menu as MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BankDisplay } from "@/components/game/bank-display"

export function TopBar({
  bank,
  delta,
  onOpenMenu,
}: {
  bank: number
  delta: { amount: number; key: number } | null
  onOpenMenu: () => void
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 pt-4">
      <div className="flex items-center gap-2">
        <Image
          src="/images/dice-up-logo.png"
          alt="Dice Up"
          width={36}
          height={36}
          className="rounded-lg"
          priority
        />
        <span className="font-heading text-lg font-black tracking-tight text-foreground">
          DICE UP
        </span>
      </div>

      <div className="flex items-center gap-2">
        <BankDisplay bank={bank} delta={delta} />
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-muted-foreground hover:text-foreground"
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <MenuIcon />
        </Button>
      </div>
    </header>
  )
}
