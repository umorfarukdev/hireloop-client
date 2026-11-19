const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
export const getPremiumUserById = async (userId: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/premium`)
    return res.json()
}