"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { useSession } from "@/lib/auth-client"
import { removeSavedJob, savedJob } from "@/lib/actions/savedJobs"
import { JobFormValues } from "@/type/type"

/* ------------------------------------------------------------------ */
/* Shared save/unsave logic for the bookmark buttons (job cards, job   */
/* details header). Handles auth redirect, seeker-role guard, the      */
/* already-saved (409) response, and in-flight toggling.               */
/* ------------------------------------------------------------------ */

export const useSaveJob = (job: JobFormValues, initialSaved = false) => {
  const [saved, setSaved] = useState(initialSaved)
  const [pending, setPending] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()

  const toggleSave = async () => {
    if (!user) {
      router.push(
        `/sign-in?redirectTo=${encodeURIComponent(`/browse-jobs/${job._id}`)}`
      )
      return
    }

    if (user.role !== "seeker" || pending) return

    setPending(true)
    try {
      if (saved) {
        const result = await removeSavedJob({
          jobId: job._id,
          userId: user.id,
        })
        if (result.deletedCount) setSaved(false)
      } else {
        const result = await savedJob({
          jobId: job._id,
          userId: user.id,
          userEmail: user.email,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
        })
        if (result.insertedId || result.alreadySaved) setSaved(true)
      }
    } catch (error) {
      console.error("Failed to save job:", error)
    } finally {
      setPending(false)
    }
  }

  return { saved, pending, toggleSave }
}
