"use client"

import { useCallback, useEffect, useRef } from "react"

import type { SoundEvent } from "@/lib/game/types"

type Tone = { freq: number; duration: number; type?: OscillatorType }

/**
 * Synthesizes short beeps per game event via the Web Audio API. No audio
 * files are required, so the app works fully without any assets. Every
 * event maps to a distinct tone so sound remains a functional, if minimal,
 * feedback layer.
 */
const EVENT_TONES: Record<SoundEvent, Tone[]> = {
  roll: [{ freq: 220, duration: 0.08, type: "square" }],
  tower_up: [{ freq: 520, duration: 0.12, type: "triangle" }],
  tower_down: [{ freq: 180, duration: 0.16, type: "sawtooth" }],
  all_towers_up: [
    { freq: 440, duration: 0.1, type: "triangle" },
    { freq: 660, duration: 0.14, type: "triangle" },
  ],
  failed: [
    { freq: 200, duration: 0.18, type: "sawtooth" },
    { freq: 110, duration: 0.3, type: "sawtooth" },
  ],
  cashout: [
    { freq: 523, duration: 0.1, type: "sine" },
    { freq: 659, duration: 0.1, type: "sine" },
    { freq: 784, duration: 0.18, type: "sine" },
  ],
  tower_completed: [
    { freq: 523, duration: 0.1, type: "sine" },
    { freq: 659, duration: 0.1, type: "sine" },
    { freq: 784, duration: 0.1, type: "sine" },
    { freq: 1046, duration: 0.24, type: "sine" },
  ],
}

export function useSoundEffects(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {})
    }
  }, [])

  const play = useCallback(
    (event: SoundEvent) => {
      if (!enabled) return
      if (typeof window === "undefined") return

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!AudioCtx) return

      if (!ctxRef.current) {
        ctxRef.current = new AudioCtx()
      }
      const ctx = ctxRef.current
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {})
      }

      let cursor = ctx.currentTime
      for (const tone of EVENT_TONES[event]) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = tone.type ?? "sine"
        osc.frequency.value = tone.freq
        gain.gain.setValueAtTime(0.0001, cursor)
        gain.gain.exponentialRampToValueAtTime(0.18, cursor + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.0001, cursor + tone.duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(cursor)
        osc.stop(cursor + tone.duration + 0.02)
        cursor += tone.duration * 0.85
      }
    },
    [enabled]
  )

  return play
}
