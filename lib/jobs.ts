import { JobFormValues } from "@/type/type";

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

/** Display label for a job type ("full-time" → "Full-time"). */
export const typeLabelOf = (job: { jobType: string }): string =>
  labelOf(JOB_TYPES, job.jobType) ?? job.jobType

/** Short department name for the table's "JOB TITLE & DEPT" column. */
export const shortLabelOf = (
  options: Array<{ value: string; short: string }>,
  value: string
) => options.find((option) => option.value === value)?.short

export const DEFAULT_VALUES: JobFormValues = {
  _id: "",
  jobTitle: "",
  companyName: "",
  jobCategory: "",
  jobType: "full-time",
  isRemote: false,
  location: "",
  deadline: "",
  minSalary: undefined,
  maxSalary: undefined,
  salaryFrequency: "year",
  responsibilities: "",
  qualifications: "",
  applicants: 0,
  status: "Active",
  postedAt: "",
}

/** Form values → submitted payload (salary strings become numbers). */
export function toJobPayload(data: JobFormValues): JobFormValues {
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
    // the API returns null for an unset bound — filter nullish, not just undefined
    .filter((value): value is number => value != null)
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
  if (!job.isRemote) return job.location
  // Avoid the redundant "Remote (Remote)".
  return job.location.toLowerCase() === "remote"
    ? "Remote"
    : `Remote (${job.location})`
}

/** Department shown in the table = the form's job category (short name). */
export function departmentOf(job: { jobCategory: string }): string {
  return shortLabelOf(JOB_CATEGORIES, job.jobCategory) ?? "—"
}
