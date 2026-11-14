import { getSavedJobs } from "@/lib/actions/savedJobs"
import { getJobs } from "@/lib/api/jobs"
import { auth } from "@/lib/auth"
import { relativeSince, timestampOf } from "@/lib/format"
import { departmentOf } from "@/lib/jobs"
import { JobFormValues, SavedJob } from "@/type/type"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import SavedJobs, { SavedJobRow } from "./SavedJobs"

/* ------------------------------------------------------------------ */
/* Seeker › Saved Jobs (Figma "Seeker / Saved Jobs") — server loads    */
/* the user's bookmarks joined with their jobs; filtering/sorting and  */
/* removal run in the client component.                                */
/* ------------------------------------------------------------------ */

const DAY_MS = 86_400_000

const SavedJobsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = session?.user

  if (!user) {
    redirect("/sign-in")
  }

  const saved: SavedJob[] = await getSavedJobs({ email: user.email })

  // Enrich each bookmark with its job (location, salary, deadline…).
  const jobs: JobFormValues[] = await getJobs()
  const jobById = new Map(jobs.map((job) => [job._id, job]))
  const now = Date.now()

  const rows: SavedJobRow[] = saved.map((item) => {
    const job = jobById.get(item.jobId) ?? null
    const savedMs = timestampOf(item.savedAt, item._id) ?? 0

    const deadlineMs = job?.deadline
      ? Date.parse(`${job.deadline}T23:59:59`)
      : null
    const pastDeadline = deadlineMs !== null && deadlineMs < now
    const closed = !job || job.status === "Expired" || pastDeadline

    let deadlineLabel: string | null = null
    if (deadlineMs !== null) {
      if (pastDeadline) {
        deadlineLabel = `Closed ${relativeSince(deadlineMs)}`
      } else if (closed) {
        deadlineLabel = "Closed"
      } else {
        const days = Math.max(1, Math.ceil((deadlineMs - now) / DAY_MS))
        deadlineLabel = `Closes in ${days} ${days === 1 ? "day" : "days"}`
      }
    }

    return {
      id: item._id ?? item.jobId,
      jobId: item.jobId,
      jobTitle: item.jobTitle,
      companyName: item.companyName,
      category: job ? departmentOf(job) : "Other",
      savedLabel: `Saved ${relativeSince(savedMs)}`,
      savedMs,
      deadlineLabel,
      deadlineMs,
      closingSoon:
        !closed && deadlineMs !== null && deadlineMs - now <= 7 * DAY_MS,
      closed,
      job,
    }
  })

  return <SavedJobs rows={rows} userId={user.id} />
}

export default SavedJobsPage
