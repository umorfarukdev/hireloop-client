import { CreateJobPayload } from "@/type/type"


export const createJob = async (data: CreateJobPayload) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    console.error("Failed to submit job:", res.statusText)
    return
  }

  return res.json()
}

