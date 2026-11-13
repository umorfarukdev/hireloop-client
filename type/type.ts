export type UserRole = "seeker" | "recruiter" | "admin"

export type AuthFormData = {
    name: string
    email: string
    password: string
    role: UserRole
}

export type JobStatus = "Active" | "Expired"


export type JobFormValues = {
  _id: string
  jobTitle: string
  companyName: string
  jobCategory: string
  jobType: string
  isRemote: boolean
  location: string
  deadline?: string
  minSalary?: number
  maxSalary?: number
  salaryFrequency: string
  responsibilities: string
  qualifications: string
  applicants: number
  status: JobStatus
  postedAt: string
}

/* Persisted job post = exactly what the form submits, plus the
   extra fields the manage-jobs table needs. */
export type JobPost = {
  id: string
  applicants: number
  status: JobStatus
  postedAt: string
}

/* AuthForm submit contract — better-auth style: resolves with
   `{ error }` instead of throwing. */
export type AuthSubmitHandler = (data: AuthFormData) => Promise<unknown> | unknown

export type JobApplication = {
  jobId: string
  userId: string
  userEmail: string
  jobTitle: string
  companyName: string
}
