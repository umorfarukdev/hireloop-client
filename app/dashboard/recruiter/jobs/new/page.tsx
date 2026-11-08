"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  ChevronRightIcon,
  Clock3Icon,
  Globe2Icon,
  MapPinIcon,
  WalletIcon,
} from "lucide-react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"

/* ------------------------------------------------------------------ */
/* Options (from the Figma "Add New Job" spec)                        */
/* ------------------------------------------------------------------ */

const JOB_CATEGORIES = [
  { value: "engineering", label: "Engineering & Tech" },
  { value: "design", label: "Design & Creative" },
  { value: "marketing", label: "Marketing & PR" },
  { value: "sales", label: "Sales & Business Dev" },
  { value: "finance", label: "Finance & Legal" },
  { value: "operations", label: "Operations & HR" },
  { value: "support", label: "Customer Support" },
]

const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
]

const SALARY_FREQUENCIES = [
  { value: "hour", label: "per hour" },
  { value: "day", label: "per day" },
  { value: "week", label: "per week" },
  { value: "month", label: "per month" },
  { value: "year", label: "per year" },
]

const labelOf = (
  options: Array<{ value: string; label: string }>,
  value: string
) => options.find((option) => option.value === value)?.label

/* ------------------------------------------------------------------ */
/* Schema — one zod object = all form entries collected on submit      */
/* ------------------------------------------------------------------ */

const jobSchema = z
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
    qualifications: z
      .string()
      .min(10, "List the qualifications & requirements"),
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
    {
      message: "Enter a valid salary range (max must be ≥ min)",
      path: ["maxSalary"],
    }
  )

type JobFormValues = z.infer<typeof jobSchema>

const DEFAULT_VALUES: JobFormValues = {
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
/* Page                                                                */
/* ------------------------------------------------------------------ */

const NewJobAddPage = () => {
  const [submitted, setSubmitted] = useState(false)

  const {data: session} = useSession()

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: DEFAULT_VALUES,
  })

  // Re-renders the live preview on every keystroke.
  const values = form.watch()

  async function onSubmit(data: JobFormValues) {
    // Collected form entries — convert salary strings to numbers for the API.
    const payload = {
      ...data,
      minSalary: data.minSalary ? Number(data.minSalary) : undefined,
      maxSalary: data.maxSalary ? Number(data.maxSalary) : undefined,
      deadline: data.deadline || undefined,
    }

    console.log("new job form data", payload)
    setSubmitted(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error("Failed to submit job:", res.statusText)
      return
    }

    const result = await res.json()
    console.log("Job submitted successfully:", result)
  }

  const salaryText =
    values.minSalary || values.maxSalary
      ? [
          values.minSalary ? `$${values.minSalary}` : "",
          values.maxSalary ? `$${values.maxSalary}` : "",
        ]
          .filter(Boolean)
          .join(" – ") +
        " " +
        (labelOf(SALARY_FREQUENCIES, values.salaryFrequency) ?? "")
      : null

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      {/* Top breadcrumb & page heading */}
      <div className="space-y-1">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm"
        >
          <Link
            href="/dashboard/recruiter/jobs"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Manage Jobs
          </Link>
          <ChevronRightIcon
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="font-medium">Create New Listing</span>
        </nav>
        <h1 className="text-2xl font-semibold tracking-tight">
          Post a New Job
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill in the position specifications to attract qualified talent across
          our network.
        </p>
      </div>

      {/* Form 60% + Live Preview 40% */}
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        {/* ---------------- Left column: form ---------------- */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, () => setSubmitted(false))}
            noValidate
            className="space-y-6"
          >
            {submitted && (
              <div
                role="status"
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400"
              >
                Job details collected successfully — see the browser console for
                the submitted data.
              </div>
            )}

            {/* Section 1: Basic Information */}
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <h2 className="text-sm font-semibold">1. Basic Information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Job Title <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Company Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="HirePulse Network" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="jobCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Job Category <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          {labelOf(JOB_CATEGORIES, field.value) ?? (
                            <span className="text-muted-foreground">
                              Select a category
                            </span>
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Job Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <ToggleGroup
                        value={field.value ? [field.value] : []}
                        onValueChange={(groupValue) =>
                          // single-select: take the first pressed value;
                          // ignore deselecting the active item (keeps it required)
                          field.onChange(groupValue[0] ?? field.value)
                        }
                        variant="outline"
                        className="flex flex-wrap"
                      >
                        {JOB_TYPES.map((type) => (
                          <ToggleGroupItem key={type.value} value={type.value}>
                            {type.label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {/* Section 2: Location, Compensation & Timeline */}
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <h2 className="text-sm font-semibold">
                2. Location, Compensation &amp; Timeline
              </h2>

              <FormField
                control={form.control}
                name="isRemote"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium">
                        Remote Work Allowed
                      </FormLabel>
                      <FormDescription>
                        Enable worldwide or distributed candidate applications
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-label="Remote work allowed"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Job Location <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="New York, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="minSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Salary / Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          placeholder="80000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Salary / Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          placeholder="120000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            {labelOf(SALARY_FREQUENCIES, field.value) ?? (
                              <span className="text-muted-foreground">
                                Frequency
                              </span>
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SALARY_FREQUENCIES.map((frequency) => (
                            <SelectItem
                              key={frequency.value}
                              value={frequency.value}
                            >
                              {frequency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Section 3: Responsibilities & Requirements */}
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <h2 className="text-sm font-semibold">
                3. Responsibilities &amp; Requirements
              </h2>

              <FormField
                control={form.control}
                name="responsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Key Responsibilities{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="What will this person own day to day?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Qualifications &amp; Requirements{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Skills, experience and education required"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(DEFAULT_VALUES)
                  setSubmitted(false)
                }}
              >
                Reset
              </Button>
              <Button type="submit">Publish Job</Button>
            </div>
          </form>
        </Form>

        {/* ---------------- Right column: live preview ---------------- */}
        <aside className="self-start lg:sticky lg:top-20">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Live Preview</h2>
            <span className="text-xs text-muted-foreground">
              Updates as you type
            </span>
          </div>

          <Card>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {labelOf(JOB_TYPES, values.jobType) ?? "Full-time"}
                </Badge>
                {values.isRemote && (
                  <Badge variant="outline" className="gap-1">
                    <Globe2Icon className="size-3" aria-hidden="true" />
                    Remote
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg leading-snug">
                {values.jobTitle || "Your job title"}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span>{values.companyName || "Company name"}</span>
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="size-3.5" aria-hidden="true" />
                  {values.location || "Location"}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {salaryText && (
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <WalletIcon
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {salaryText}
                  </span>
                )}
                {values.deadline && (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock3Icon className="size-4" aria-hidden="true" />
                    Apply by {values.deadline}
                  </span>
                )}
              </div>

              <div className="space-y-3 border-t pt-4 text-sm">
                <div>
                  <h3 className="mb-1 font-medium">Key Responsibilities</h3>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {values.responsibilities ||
                      "Responsibilities will appear here…"}
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-medium">
                    Qualifications &amp; Requirements
                  </h3>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {values.qualifications || "Requirements will appear here…"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

export default NewJobAddPage
