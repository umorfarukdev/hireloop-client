import { JobFormValues } from "@/type/type"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export const createJob = async (data: JobFormValues) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    console.error("Failed to submit job:", res.statusText)
    return
  }

  return res.json()
}

export const deleteJob = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  })
  // if (!res.ok) {
  //   console.error("Failed to delete job:", res.statusText)
  //   return
  // }
  return res.json()
}
