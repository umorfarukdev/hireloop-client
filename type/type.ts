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
