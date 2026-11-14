import { SavedJob } from "@/type/type"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export const savedJob = async (data: SavedJob) => {
  const res = await fetch(`${BASE_URL}/saved-jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  // Already saved is a normal outcome for a toggle button, not an error.
  if (res.status === 409) return { alreadySaved: true }
  if (!res.ok) {
    throw new Error("Failed to save job")
  }
  return res.json()
}

export const removeSavedJob = async ({
  jobId,
  userId,
}: {
  jobId: string
  userId: string
}) => {
  const res = await fetch(
    `${BASE_URL}/saved-jobs/${encodeURIComponent(jobId)}/${encodeURIComponent(userId)}`,
    { method: "DELETE" }
  )
  if (!res.ok) {
    throw new Error("Failed to remove saved job")
  }
  return res.json() as Promise<{ deletedCount: number }>
}

export const getSavedJobs = async ({
  email,
}: {
  email: string
}): Promise<SavedJob[]> => {
  const res = await fetch(
    `${BASE_URL}/saved-jobs/${encodeURIComponent(email)}`
  )
  if (!res.ok) {
    throw new Error("Failed to fetch saved jobs")
  }
  return res.json()
}

/** Saved-job ids for a user — [] when logged out or the API is down, so
 *  pages never break over bookmark state. */
export const getSavedJobIds = async (email: string): Promise<string[]> => {
  try {
    const saved = await getSavedJobs({ email })
    return saved
      .map((item) => item.jobId)
      .filter((jobId): jobId is string => Boolean(jobId))
  } catch {
    return []
  }
}
