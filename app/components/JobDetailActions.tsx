"use client"

import { useState } from "react"
import { BookmarkIcon, CheckIcon, Share2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { JobFormValues } from "@/type/type"
import { useSaveJob } from "@/lib/useSaveJob"
import { cn } from "cn"

/* ------------------------------------------------------------------ */
/* Header actions — Save (persists to Saved Jobs) / Share (copy link)  */
/* ------------------------------------------------------------------ */

const JobDetailActions = ({
  job,
  initialSaved = false,
}: {
  job: JobFormValues
  initialSaved?: boolean
}) => {
  const { saved, pending, toggleSave } = useSaveJob(job, initialSaved)
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
        disabled={pending}
        onClick={toggleSave}
        className={cn(saved && "border-primary text-primary")}
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
