"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronRightIcon,
  EyeIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DUMMY_JOBS,
  formatDate,
  formatLocation,
  formatSalary,
  departmentOf,
  labelOf,
  JOB_TYPES,
  type JobPost,
} from "@/lib/jobs"

/* ------------------------------------------------------------------ */
/* Status badge — Active (green) / Expired (red)                       */
/* ------------------------------------------------------------------ */

const StatusBadge = ({ status }: { status: JobPost["status"] }) => (
  <Badge
    variant="outline"
    className={
      status === "Active"
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
    }
  >
    {status}
  </Badge>
)

/* ------------------------------------------------------------------ */
/* Row actions — Update (link) / View / Delete                         */
/* ------------------------------------------------------------------ */

const RowActions = ({
  job,
  onDelete,
}: {
  job: JobPost
  onDelete: (id: string) => void
}) => (
  <div className="flex items-center justify-end gap-1.5">
    <Button
      variant="outline"
      size="sm"
      nativeButton={false}
      render={
        <Link href={`/dashboard/recruiter/jobs/new?edit=${job.id}`} />
      }
    >
      <PencilIcon aria-hidden="true" />
      Update
    </Button>
    <Button
      variant="ghost"
      size="icon"
      title={`View ${job.jobTitle}`}
      aria-label={`View ${job.jobTitle}`}
    >
      <EyeIcon />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      title={`Delete ${job.jobTitle}`}
      aria-label={`Delete ${job.jobTitle}`}
      onClick={() => onDelete(job.id)}
      className="text-red-600 hover:text-red-600 dark:text-red-400"
    >
      <Trash2Icon />
    </Button>
  </div>
)

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState<JobPost[]>(DUMMY_JOBS)

  const deleteJob = (id: string) =>
    setJobs((current) => current.filter((job) => job.id !== id))

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      {/* Top breadcrumb & page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm"
          >
            <span className="text-muted-foreground">Manage Jobs</span>
            <ChevronRightIcon
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="font-medium">Job Listings &amp; Postings</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight">
            Manage Job Posts
          </h1>
          <p className="text-sm text-muted-foreground">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>

        <Button
          className="self-start shrink-0"
          nativeButton={false}
          render={
            <Link href="/dashboard/recruiter/jobs/new" />
          }
        >
          <PlusIcon aria-hidden="true" />
          New Job Post
        </Button>
      </div>

      {/* ---------------- Desktop: table (lg and up) ---------------- */}
      <div className="hidden overflow-x-auto rounded-xl border bg-card lg:block">
        <Table className="min-w-[1050px]">
          <TableHeader>
            <TableRow>
              <TableHead>JOB TITLE &amp; DEPT</TableHead>
              <TableHead>COMPANY &amp; LOCATION</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>COMPENSATION</TableHead>
              <TableHead>APPLICANTS</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>DEADLINE</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                {/* Job title & department */}
                <TableCell>
                  <div className="font-medium">{job.jobTitle}</div>
                  <div className="text-xs text-muted-foreground">
                    {departmentOf(job)}
                  </div>
                </TableCell>

                {/* Company & location */}
                <TableCell>
                  <div className="font-medium">{job.companyName}</div>
                  <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPinIcon className="size-3" aria-hidden="true" />
                    {formatLocation(job)}
                  </div>
                </TableCell>

                {/* Type */}
                <TableCell>
                  <Badge variant="secondary">
                    {labelOf(JOB_TYPES, job.jobType) ?? job.jobType}
                  </Badge>
                </TableCell>

                {/* Compensation */}
                <TableCell className="font-medium">
                  {formatSalary(
                    job.minSalary,
                    job.maxSalary,
                    job.salaryFrequency
                  ) ?? "—"}
                </TableCell>

                {/* Applicants */}
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <UsersIcon
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {job.applicants} Candidates
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={job.status} />
                </TableCell>

                {/* Deadline */}
                <TableCell>
                  <div>{formatDate(job.deadline)}</div>
                  <div className="text-xs text-muted-foreground">
                    {job.postedAt}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <RowActions job={job} onDelete={deleteJob} />
                </TableCell>
              </TableRow>
            ))}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-muted-foreground"
                >
                  No job posts yet — create your first listing.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ---------------- Mobile: cards (below lg) ---------------- */}
      <div className="space-y-4 lg:hidden">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="space-y-4">
              {/* Title, status & dept */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-semibold leading-snug">
                    {job.jobTitle}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {departmentOf(job)}
                  </div>
                </div>
                <StatusBadge status={job.status} />
              </div>

              {/* Company & location */}
              <div className="space-y-1 text-sm">
                <div className="font-medium">{job.companyName}</div>
                <div className="inline-flex items-center gap-1 text-muted-foreground">
                  <MapPinIcon className="size-3.5" aria-hidden="true" />
                  {formatLocation(job)}
                </div>
              </div>

              {/* Facts grid */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Type</div>
                  <Badge variant="secondary" className="mt-1">
                    {labelOf(JOB_TYPES, job.jobType) ?? job.jobType}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Compensation
                  </div>
                  <div className="mt-1 font-medium">
                    {formatSalary(
                      job.minSalary,
                      job.maxSalary,
                      job.salaryFrequency
                    ) ?? "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Applicants
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1.5 font-medium">
                    <UsersIcon
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {job.applicants} Candidates
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Deadline</div>
                  <div className="mt-1 font-medium">
                    {formatDate(job.deadline)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {job.postedAt}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <RowActions job={job} onDelete={deleteJob} />
            </CardContent>
          </Card>
        ))}

        {jobs.length === 0 && (
          <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
            No job posts yet — create your first listing.
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageJobsPage
