"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function TopLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timers = useRef<number[]>([])
  const firstLoad = useRef(true)

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false
      return
    }

    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []

    setVisible(true)
    setProgress(12)

    timers.current.push(window.setTimeout(() => setProgress(45), 120))
    timers.current.push(window.setTimeout(() => setProgress(75), 280))
    timers.current.push(window.setTimeout(() => setProgress(100), 600))
    timers.current.push(
      window.setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 820)
    )

    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
      timers.current = []
    }
  }, [pathname, searchParams?.toString()])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
    >
      <div
        className="bg-primary h-full transition-[width,opacity] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  )
}
