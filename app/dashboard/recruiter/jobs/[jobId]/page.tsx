import Link from "next/link"
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CircleCheckIcon,
  ExternalLinkIcon,
  HeartPulseIcon,
  LaptopIcon,
  MapPinIcon,
  PiggyBankIcon,
  TreePalmIcon,
  UsersRoundIcon,
  WalletIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getJobById } from "@/lib/api/jobs"
import {
  departmentOf,
  formatDate,
  formatLocation,
  formatSalary,
  JOB_CATEGORIES,
  JOB_TYPES,
  labelOf,
} from "@/lib/jobs"
import JobDetailActions from "@/app/components/JobDetailActions"

/* ------------------------------------------------------------------ */
/* Static content from the Figma "Public / Job Details" frame          */
/* ------------------------------------------------------------------ */

const BENEFITS = [
  { icon: HeartPulseIcon, label: "Full Health & Dental" },
  { icon: PiggyBankIcon, label: "Competitive 401k" },
  { icon: LaptopIcon, label: "Latest Hardware Stipend" },
  { icon: TreePalmIcon, label: "Unlimited PTO" },
]

/** Free text → bullet list (newline or sentence aware). */
const toBullets = (text: string): string[] =>
  text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+/))
    .map((item) => item.trim())
    .filter(Boolean)

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>
}) => {
  const { jobId } = await params
  const job = await getJobById({ jobId })

  /* ---------------- Not found ---------------- */
  if (!job) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-6">
        <div className="space-y-3 rounded-xl border bg-card p-10 text-center">
          <h1 className="text-xl font-semibold">Job not found</h1>
          <p className="text-sm text-muted-foreground">
            This job post doesn&apos;t exist or was removed.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/recruiter/jobs" />}
          >
            Back to Manage Jobs
          </Button>
        </div>
      </div>
    )
  }

  const typeLabel = labelOf(JOB_TYPES, job.jobType) ?? job.jobType
  const department = departmentOf(job)
  const salary = formatSalary(job.minSalary, job.maxSalary, job.salaryFrequency)
  const location = formatLocation(job)
  const industry =
    JOB_CATEGORIES.find((category) => category.value === job.jobCategory)
      ?.label ?? "—"
  const initials = job.companyName
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")

  const description = [
    `${job.companyName} is hiring a ${job.jobTitle} (${typeLabel}) for the ${department} department.`,
    job.isRemote
      ? `This role is remote${job.location ? ` (${job.location})` : ""}.`
      : `This role is based in ${job.location}.`,
    job.deadline
      ? `Applications close on ${formatDate(job.deadline)}.`
      : null,
  ]
    .filter(Boolean)
    .join(" ")

  const responsibilityBullets = toBullets(job.responsibilities)
  const requirementBullets = toBullets(job.qualifications)

  /* ---------------- Bento info grid (4 cards) ---------------- */
  const facts = [
    { icon: WalletIcon, label: "SALARY RANGE", value: salary ?? "Negotiable" },
    { icon: MapPinIcon, label: "LOCATION", value: location },
    { icon: BriefcaseIcon, label: "JOB TYPE", value: typeLabel },
    {
      icon: CalendarDaysIcon,
      label: "DEADLINE",
      value: formatDate(job.deadline),
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      {/* Back link */}
      <Link
        href="/dashboard/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
        Manage Jobs
      </Link>

      {/* ---------------- Header Section ---------------- */}
      <header className="relative overflow-hidden rounded-xl border bg-card">
        {/* Overlay + blur gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent"
        />
        <div className="relative flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between md:p-6">
          <div className="flex gap-4">
            {/* Company logo */}
            <div
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-lg font-semibold text-primary-foreground"
            >
              {initials}
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                {job.jobTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="font-medium">{job.companyName}</span>
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                >
                  <BadgeCheckIcon className="size-3" aria-hidden="true" />
                  Verified Employer
                </Badge>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <Badge
                  variant="outline"
                  className={
                    job.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                  }
                >
                  {job.status}
                </Badge>
                <span className="inline-flex items-center gap-1.5">
                  <UsersRoundIcon className="size-4" aria-hidden="true" />
                  {job.applicants} Candidates
                </span>
                <span>{job.postedAt}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <JobDetailActions />
            <Button type="button">Apply Now</Button>
          </div>
        </div>
      </header>

      {/* ---------------- Main: content + sidebar ---------------- */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          {/* Bento info grid */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl border bg-card p-4"
              >
                <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4.5" aria-hidden="true" />
                </div>
                <div className="text-xs font-medium tracking-wide text-muted-foreground">
                  {label}
                </div>
                <div className="mt-1 truncate text-sm font-semibold md:text-base">
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Content sections */}
          <div className="divide-y rounded-xl border bg-card">
            {/* Job Description */}
            <section className="space-y-3 p-5 md:p-6">
              <h2 className="text-base font-semibold">Job Description</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </section>

            {/* Responsibilities */}
            <section className="space-y-3 p-5 md:p-6">
              <h2 className="text-base font-semibold">Responsibilities</h2>
              {responsibilityBullets.length > 0 ? (
                <ul className="space-y-2.5">
                  {responsibilityBullets.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm">
                      <CircleCheckIcon
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No responsibilities listed yet.
                </p>
              )}
            </section>

            {/* Requirements */}
            <section className="space-y-3 p-5 md:p-6">
              <h2 className="text-base font-semibold">Requirements</h2>
              {requirementBullets.length > 0 ? (
                <ul className="space-y-2.5">
                  {requirementBullets.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm">
                      <CircleCheckIcon
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No requirements listed yet.
                </p>
              )}
            </section>

            {/* Benefits */}
            <section className="space-y-3 p-5 md:p-6">
              <h2 className="text-base font-semibold">Benefits</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {BENEFITS.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-lg border bg-muted/40 p-4"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4.5" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ---------------- Aside: Company Overview ---------------- */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="p-5">
              <h2 className="mb-4 text-base font-semibold">
                Company Overview
              </h2>

              {/* Gradient cover */}
              <div
                aria-hidden="true"
                className="mb-4 flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-primary/80 via-primary/40 to-primary/10"
              >
                <span className="text-3xl font-semibold text-primary-foreground">
                  {initials}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="font-medium">{job.companyName}</div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-muted-foreground">SIZE</span>
                  <span>250 - 500 Employees</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-muted-foreground">INDUSTRY</span>
                  <span className="text-right">{industry}</span>
                </div>
              </div>
            </div>

            <div className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                <ExternalLinkIcon aria-hidden="true" />
                Visit Website
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default JobDetailsPage
