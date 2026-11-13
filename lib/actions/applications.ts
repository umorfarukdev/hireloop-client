import { JobApplication } from "@/type/type"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export const jobApply = async (data: JobApplication) => {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error("apllicaton faild")
  }
  return res.json()
}
