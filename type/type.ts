export type UserRole = "seeker" | "recruiter" | "admin"

export type AuthFormData = {
    name: string
    email: string
    password: string
    role: UserRole
}



export type JobFormValues = {
  jobTitle: string
  companyName: string
  jobCategory: string
  jobType: string
  isRemote: boolean
  location: string
  deadline?: string
  minSalary?: string
  maxSalary?: string
  salaryFrequency: string
  responsibilities: string
  qualifications: string
}

export type CreateJobPayload = Omit<
  JobFormValues,
  "minSalary" | "maxSalary"
> & {
  minSalary?: number
  maxSalary?: number
}