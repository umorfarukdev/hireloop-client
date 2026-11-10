import { JobFormValues } from "@/type/type"


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export const getJobs = async (query = " "): Promise<JobFormValues[]> => {
  const res = await fetch(`${BASE_URL}/jobs?${query}`, { cache: "no-store" })
  if (!res.ok) {
    console.error("Failed to fetch jobs:", res.statusText)
    return []
  }
  return res.json()
}

export const getJobById = async ({
  jobId,
}: {
  jobId: string
}): Promise<JobFormValues | null> => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, { cache: "no-store" })
  // The API answers 200 with an empty body for a missing job, and 500 for a
  // malformed id — both mean "not found" from the page's perspective.
  if (!res.ok) return null
  return res.json()
}
