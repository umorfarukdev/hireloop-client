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
  jobId: string
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

/* Application lifecycle shown on the seeker's My Applications page. */
export type ApplicationStatus =
  | "Applied"
  | "Review"
  | "Interview"
  | "Shortlisted"
  | "Rejected"
  | "Offered"

/* One row of GET /applications/:email — what the apply form posts, plus
   the server's `_id`. `status`/`appliedAt` are stamped on submit; older
   documents may not have them yet (pages fall back gracefully). */
export type JobApplication = {
  _id?: string
  jobId: string
  userId: string
  userEmail: string
  jobTitle: string
  companyName: string
  status?: ApplicationStatus
  appliedAt?: string
}


export type SavedJob = {
  _id?: string
  jobId: string
  userId: string
  userEmail: string
  jobTitle: string
  companyName: string
  savedAt?: string
}