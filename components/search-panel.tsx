"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { dashboardNavItems } from "@/components/dashboard-nav"

export function SearchPanel() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase()
      if ((event.ctrlKey || event.metaKey) && key === "k") {
        event.preventDefault()
        if (mounted) {
          setOpen(true)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mounted])

  useEffect(() => {
    if (open) {
      setQuery("")
      const id = window.setTimeout(() => inputRef.current?.focus(), 0)
      return () => window.clearTimeout(id)
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return dashboardNavItems
    return dashboardNavItems.filter((item) =>
      item.title.toLowerCase().includes(q)
    )
  }, [query])

  if (!mounted) {
    return (
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex w-full max-w-[250px] items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition sm:max-w-sm focus-visible:ring-[3px] focus-visible:outline-none"
        aria-label="Search"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search...</span>
        <span className="text-xs">Ctrl K</span>
      </button>
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex w-full max-w-[250px] items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition sm:max-w-sm focus-visible:ring-[3px] focus-visible:outline-none"
          aria-label="Open search"
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">Search...</span>
          <span className="text-xs">Ctrl K</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="bg-background text-foreground fixed left-1/2 top-24 z-50 w-[90vw] max-w-xl -translate-x-1/2 rounded-lg border border-border p-4 shadow-lg">
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              ref={inputRef}
              name="search"
              type="search"
              placeholder="Search dashboard..."
              className="pl-9"
              aria-label="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="mt-3 max-h-64 overflow-auto rounded-md border border-border/60">
            {results.length ? (
              <ul className="divide-y divide-border/60">
                {results.map((item) => (
                  <li key={item.url}>
                    <Dialog.Close asChild>
                      <Link
                        href={item.url}
                        className="hover:bg-muted flex items-center gap-3 px-3 py-2 text-sm"
                      >
                        <item.icon className="text-muted-foreground size-4" />
                        <span className="flex-1">{item.title}</span>
                        <span className="text-muted-foreground text-xs">
                          Dashboard
                        </span>
                      </Link>
                    </Dialog.Close>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted-foreground px-3 py-4 text-sm">
                No results.
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
