import { JobApplication } from "@/type/type"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export const jobApply = async (data: JobApplication) => {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // New applications start as "Applied" and carry their submit time so
    // the My Applications table can show a real date (callers may override).
    body: JSON.stringify({
      ...data,
      status: data.status ?? "Applied",
      appliedAt: data.appliedAt ?? new Date().toISOString(),
    }),
  })
  if (!res.ok) {
    throw new Error("apllicaton faild")
  }
  return res.json()
}

export const getApplications = async (query = " ") => {
  const res = await fetch(`${BASE_URL}/applications?${query}`)
  if (!res.ok) {
     throw new Error("Application fetch failed");
  }
  return res.json()
}

export const getApplicationsCount = async (query = "") : Promise<{count : number}> => {
  const res = await fetch(`${BASE_URL}/applications/count?${query}`)
  if (!res.ok) {
     throw new Error("Application fetch failed");
  }
  return res.json()
}
