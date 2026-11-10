"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"

import {
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
import { createJob } from "@/lib/actions/jobs"
import { JobFormValues } from "@/type/type"
import {
  DEFAULT_VALUES,
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  labelOf,
  toJobPayload,
} from "@/lib/jobs"
import { toast } from "@/components/ui/toast"
import PageHeader from "@/app/components/PageHeader"
import { successBadgeClass } from "@/app/components/StatusBadge"
import { cn } from "cn"

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/** Card wrapper for each numbered form section. */
const FormSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className="space-y-4 rounded-xl border bg-card p-5">
    <h2 className="text-sm font-semibold">{title}</h2>
    {children}
  </section>
)

const NewJobAddPage = () => {
  const [submitted, setSubmitted] = useState(false)

  const { data: session } = useSession()

  const form = useForm<JobFormValues>({
    defaultValues: DEFAULT_VALUES,
  })

  // Re-renders the live preview on every keystroke.
  const values = form.watch()

  async function onSubmit(data: JobFormValues) {
    // Collected form entries — toJobPayload normalizes salaries/deadline.
    const payload: JobFormValues = {
      ...toJobPayload(data),
      postedAt: data.postedAt || "Posted just now",
    }

    try {
      const result = await createJob(payload)
      if (!result?.insertedId) throw new Error("No job id returned")

      setSubmitted(true)
      toast.add({
        type: "success",
        title: "Job published",
        description: `"${data.jobTitle}" is now live.`,
      })
    } catch {
      setSubmitted(false)
      toast.add({
        type: "error",
        title: "Could not publish job",
        description: "Something went wrong. Please try again.",
      })
    }
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
      <PageHeader
        crumbs={[
          { label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
          { label: "Create New Listing" },
        ]}
        title="Post a New Job"
        description="Fill in the position specifications to attract qualified talent across our network."
      />

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
                className={cn(
                  successBadgeClass,
                  "rounded-lg border px-4 py-3 text-sm"
                )}
              >
                Job published successfully — find it in Manage Jobs.
              </div>
            )}

            {/* Section 1: Basic Information */}
            <FormSection title="1. Basic Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  rules={{ required: "Job title is required" }}
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
                  rules={{ required: "Company name is required" }}
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
                rules={{ required: "Job category is required" }}
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
            </FormSection>

            {/* Section 2: Location, Compensation & Timeline */}
            <FormSection title="2. Location, Compensation & Timeline">

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
                  rules={{ required: "Job location is required" }}
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
                  rules={{
                    validate: (value) => {
                      if (value === undefined) return true
                      const n = Number(value)
                      return (
                        (Number.isFinite(n) && n >= 0) || "Enter a valid salary"
                      )
                    },
                  }}
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
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxSalary"
                  rules={{
                    validate: (value) => {
                      if (value === undefined) return true
                      const max = Number(value)
                      if (!Number.isFinite(max) || max < 0)
                        return "Enter a valid salary"
                      const min = Number(form.getValues("minSalary"))
                      if (form.getValues("minSalary") !== undefined && max < min)
                        return "Max salary must be ≥ min salary"
                      return true
                    },
                  }}
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
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : Number(e.target.value)
                            )
                          }
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
            </FormSection>

            {/* Section 3: Responsibilities & Requirements */}
            <FormSection title="3. Responsibilities & Requirements">

              <FormField
                control={form.control}
                name="responsibilities"
                rules={{ required: "Key responsibilities are required" }}
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
                rules={{ required: "Qualifications are required" }}
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
            </FormSection>

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
