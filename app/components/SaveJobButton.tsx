"use client"

import { BookmarkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { JobFormValues } from "@/type/type"
import { useSaveJob } from "@/lib/useSaveJob"
import { cn } from "cn"

/* ------------------------------------------------------------------ */
/* Bookmark toggle on Browse Jobs cards — saves/removes the job via    */
/* the saved-jobs API (see lib/useSaveJob).                            */
/* ------------------------------------------------------------------ */

const SaveJobButton = ({
  job,
  initialSaved = false,
}: {
  job: JobFormValues
  initialSaved?: boolean
}) => {
  const { saved, pending, toggleSave } = useSaveJob(job, initialSaved)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={saved ? "Remove from saved jobs" : "Save job"}
      aria-pressed={saved}
      disabled={pending}
      onClick={toggleSave}
      className="relative z-10 shrink-0"
    >
      <BookmarkIcon className={cn(saved && "fill-current text-primary")} />
    </Button>
  )
}

export default SaveJobButton
