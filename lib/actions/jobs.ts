import { JobFormValues } from "@/type/type"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export const createJob = async (data: JobFormValues) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // _id is Mongo-generated — sending "" makes the API fail with a
    // duplicate-key error (E11000 on _id). undefined is dropped by JSON.
    body: JSON.stringify({ ...data, _id: undefined }),
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
