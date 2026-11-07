export type UserRole = "seeker" | "recruiter" | "admin"

export type AuthFormData = {
    name: string
    email: string
    password: string
    role: UserRole
}
