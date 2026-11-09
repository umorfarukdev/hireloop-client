"use client"

import { useState } from "react"
import { BookmarkIcon, CheckIcon, Share2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

/* ------------------------------------------------------------------ */
/* Header actions — Save (toggle) / Share (copy link)                  */
/* ------------------------------------------------------------------ */

const JobDetailActions = () => {
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — ignore silently
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label={saved ? "Remove from saved jobs" : "Save job"}
        aria-pressed={saved}
        onClick={() => setSaved((value) => !value)}
        className={saved ? "border-primary text-primary" : undefined}
      >
        <BookmarkIcon className={saved ? "fill-current" : undefined} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label={copied ? "Link copied" : "Copy link to this job"}
        onClick={share}
      >
        {copied ? <CheckIcon /> : <Share2Icon />}
      </Button>
    </div>
  )
}

export default JobDetailActions
