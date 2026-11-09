import { z } from "zod"

/* ------------------------------------------------------------------ */
/* Options shared by the "Post a New Job" form and the "Manage Jobs"  */
/* table — one source of truth so both always match.                   */
/* ------------------------------------------------------------------ */

export const JOB_CATEGORIES = [
  { value: "engineering", label: "Engineering & Tech", short: "Engineering" },
  { value: "design", label: "Design & Creative", short: "Design" },
  { value: "marketing", label: "Marketing & PR", short: "Marketing" },
  { value: "sales", label: "Sales & Business Dev", short: "Sales" },
  { value: "finance", label: "Finance & Legal", short: "Finance" },
  { value: "operations", label: "Operations & HR", short: "Operations" },
  { value: "support", label: "Customer Support", short: "Support" },
  { value: "infrastructure", label: "Infrastructure & DevOps", short: "Infrastructure" },
  { value: "quality", label: "Quality Assurance", short: "Quality" },
]

export const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
]

export const SALARY_FREQUENCIES = [
  { value: "hour", label: "per hour", unit: "hr" },
  { value: "day", label: "per day", unit: "day" },
  { value: "week", label: "per week", unit: "wk" },
  { value: "month", label: "per month", unit: "mo" },
  { value: "year", label: "per year", unit: "yr" },
]

export const labelOf = (
  options: Array<{ value: string; label: string }>,
  value: string
) => options.find((option) => option.value === value)?.label

/** Short department name for the table's "JOB TITLE & DEPT" column. */
export const shortLabelOf = (
  options: Array<{ value: string; short: string }>,
  value: string
) => options.find((option) => option.value === value)?.short

/* ------------------------------------------------------------------ */
/* Job form schema (react-hook-form + zod)                            */
/* ------------------------------------------------------------------ */

export const jobSchema = z
  .object({
    jobTitle: z.string().min(3, "Job title must be at least 3 characters"),
    companyName: z.string().min(2, "Company name is required"),
    jobCategory: z.string().min(1, "Select a job category"),
    jobType: z.string().min(1, "Select a job type"),
    isRemote: z.boolean(),
    location: z.string().min(2, "Job location is required"),
    deadline: z.string().optional(),
    minSalary: z.string().optional(),
    maxSalary: z.string().optional(),
    salaryFrequency: z.string(),
    responsibilities: z.string().min(10, "Describe the key responsibilities"),
    qualifications: z.string().min(10, "List the qualifications & requirements"),
  })
  .refine(
    (values) => {
      const min = values.minSalary ? Number(values.minSalary) : undefined
      const max = values.maxSalary ? Number(values.maxSalary) : undefined
      if (min === undefined && max === undefined) return true
      if (min !== undefined && Number.isNaN(min)) return false
      if (max !== undefined && Number.isNaN(max)) return false
      if (min !== undefined && max !== undefined && max < min) return false
      return true
    },
    { message: "Enter a valid salary range (max must be ≥ min)", path: ["maxSalary"] }
  )

export type JobFormValues = z.infer<typeof jobSchema>

export const DEFAULT_VALUES: JobFormValues = {
  jobTitle: "",
  companyName: "",
  jobCategory: "",
  jobType: "full-time",
  isRemote: false,
  location: "",
  deadline: "",
  minSalary: "",
  maxSalary: "",
  salaryFrequency: "year",
  responsibilities: "",
  qualifications: "",
}

/* ------------------------------------------------------------------ */
/* Persisted job post = exactly what the form submits, plus the       */
/* extra fields the manage-jobs table needs.                          */
/* ------------------------------------------------------------------ */

export type JobStatus = "Active" | "Expired"

export type JobPost = Omit<JobFormValues, "minSalary" | "maxSalary"> & {
  id: string
  minSalary?: number
  maxSalary?: number
  // manage-jobs table extras
  applicants: number
  status: JobStatus
  postedAt: string
}

/** Form values → submitted payload (salary strings become numbers). */
export function toJobPayload(
  data: JobFormValues
): Omit<JobPost, "id" | "applicants" | "status" | "postedAt"> {
  return {
    ...data,
    minSalary: data.minSalary ? Number(data.minSalary) : undefined,
    maxSalary: data.maxSalary ? Number(data.maxSalary) : undefined,
    deadline: data.deadline || undefined,
  }
}

/* ------------------------------------------------------------------ */
/* Display helpers                                                     */
/* ------------------------------------------------------------------ */

const abbreviate = (value: number) =>
  value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`

/** 40000–65000 @ year → "$40k – $65k / yr"; 40 @ hour → "40 / hr" */
export function formatSalary(
  min?: number,
  max?: number,
  frequency = "year"
): string | null {
  if (min === undefined && max === undefined) return null

  const range = [min, max]
    .filter((value): value is number => value !== undefined)
    .map(abbreviate)
    .join(" – ")

  const unit =
    SALARY_FREQUENCIES.find((option) => option.value === frequency)?.unit ??
    frequency

  return `${range} / ${unit}`
}

/** "2025-05-30" → "May 30, 2025" (no timezone shifting) */
export function formatDate(iso?: string): string {
  if (!iso) return "—"
  const [year, month, day] = iso.split("-").map(Number)
  if (!year || !month || !day) return iso

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  return `${months[month - 1]} ${String(day).padStart(2, "0")}, ${year}`
}

/** "Remote (New York, USA)" for remote posts, location as-is otherwise. */
export function formatLocation(job: { isRemote: boolean; location: string }) {
  return job.isRemote ? `Remote (${job.location})` : job.location
}

/** Department shown in the table = the form's job category (short name). */
export function departmentOf(job: { jobCategory: string }): string {
  return shortLabelOf(JOB_CATEGORIES, job.jobCategory) ?? "—"
}

/* ------------------------------------------------------------------ */
/* Dummy data for the manage-jobs table (mirrors the Figma rows)      */
/* ------------------------------------------------------------------ */

export const DUMMY_JOBS: JobPost[] = 
[
  {
    id: "job-1",
    jobTitle: "Frontend Developer",
    companyName: "HirePulse Network",
    jobCategory: "engineering",
    jobType: "full-time",
    isRemote: true,
    location: "New York, USA",
    deadline: "2025-05-30",
    minSalary: 40,
    maxSalary: undefined,
    salaryFrequency: "hour",
    responsibilities: "Build and maintain responsive, accessible product interfaces.",
    qualifications: "3+ years with React and TypeScript.",
    applicants: 34,
    status: "Active",
    postedAt: "Posted 4d ago",
  },
  {
    id: "job-2",
    jobTitle: "Senior Product Designer",
    companyName: "HirePulse Labs",
    jobCategory: "design",
    jobType: "full-time",
    isRemote: false,
    location: "London, UK (Hybrid)",
    deadline: "2025-06-14",
    minSalary: 90000,
    maxSalary: 115000,
    salaryFrequency: "year",
    responsibilities: "Own end-to-end product design from research to hand-off.",
    qualifications: "5+ years designing SaaS products.",
    applicants: 19,
    status: "Active",
    postedAt: "Posted 1w ago",
  },
  {
    id: "job-3",
    jobTitle: "DevOps Specialist",
    companyName: "HirePulse Platform",
    jobCategory: "infrastructure",
    jobType: "full-time",
    isRemote: false,
    location: "Berlin, Germany",
    deadline: "2025-06-30",
    minSalary: 95000,
    maxSalary: 120000,
    salaryFrequency: "year",
    responsibilities: "Run our CI/CD pipelines and keep production healthy.",
    qualifications: "Strong Kubernetes and cloud infrastructure experience.",
    applicants: 12,
    status: "Active",
    postedAt: "Posted 2w ago",
  },
  {
    id: "job-4",
    jobTitle: "Product Marketing Lead",
    companyName: "HirePulse Network",
    jobCategory: "marketing",
    jobType: "full-time",
    isRemote: true,
    location: "EU/US",
    deadline: "2025-07-15",
    minSalary: 80000,
    maxSalary: 105000,
    salaryFrequency: "year",
    responsibilities: "Shape launches, messaging and go-to-market campaigns.",
    qualifications: "5+ years in B2B product marketing.",
    applicants: 27,
    status: "Active",
    postedAt: "Posted 5d ago",
  },
  {
    id: "job-5",
    jobTitle: "QA Automation Engineer",
    companyName: "HirePulse Platform",
    jobCategory: "quality",
    jobType: "part-time",
    isRemote: false,
    location: "Dublin, Ireland (Hybrid)",
    deadline: "2025-05-01",
    minSalary: 50,
    maxSalary: undefined,
    salaryFrequency: "hour",
    responsibilities: "Design and maintain automated test suites.",
    qualifications: "Experience with Playwright or Cypress.",
    applicants: 8,
    status: "Expired",
    postedAt: "Closed",
  },
]
