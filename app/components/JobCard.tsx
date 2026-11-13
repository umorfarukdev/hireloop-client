"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookmarkIcon,
  BriefcaseIcon,
  MapPinIcon,
  WalletIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatLocation, formatSalary, typeLabelOf } from "@/lib/jobs"
import { successBadgeClass } from "@/app/components/StatusBadge"
import { JobFormValues } from "@/type/type"
import { cn } from "cn"


/* ------------------------------------------------------------------ */
/* Browse Jobs listing card (Figma "Article - Job Card"): logo, title, */
/* company·location, salary + type chips, Easy Apply, save button.     */
/* Clicking the card opens Job Details.                                */
/* ------------------------------------------------------------------ */

const JobCard = ({ job }: { job: JobFormValues }) => {
  const [saved, setSaved] = useState(false)

  
  const initials = job.companyName
  .split(/\s+/)
  .slice(0, 2)
  .map((word) => word[0]?.toUpperCase() ?? "")
  .join("")
  
  const salary = formatSalary(job.minSalary, job.maxSalary, job.salaryFrequency)
  


  return (
    <article className="relative flex flex-col gap-4 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        {/* Company logo */}
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-sm font-semibold text-primary-foreground"
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          {/* Title links to Job Details */}
          <h3 className="pr-8 font-semibold leading-snug">
            <Link
              href={`/browse-jobs/${job._id}`}
              className="transition-colors hover:text-primary after:absolute after:inset-0"
            >
              {job.jobTitle}
            </Link>
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {job.companyName}
            </span>
            <span aria-hidden="true">·</span>
            <MapPinIcon className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{formatLocation(job)}</span>
          </p>
        </div>

        {/* Save toggle */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={saved ? "Remove from saved jobs" : "Save job"}
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
          className="relative z-10 shrink-0"
        >
          <BookmarkIcon
            className={cn(saved && "fill-current text-primary")}
            aria-hidden="true"
          />
        </Button>
      </div>

      {/* Salary + type chips */}
      <div className="flex flex-wrap gap-2">
        {salary && (
          <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
            <WalletIcon aria-hidden="true" />
            {salary}
          </Badge>
        )}
        <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
          <BriefcaseIcon aria-hidden="true" />
          {typeLabelOf(job)}
        </Badge>
        <Badge variant="outline" className={cn("gap-1.5 px-2.5 py-1", successBadgeClass)}>
          Easy Apply
        </Badge>
      </div>
    </article>
  )
}

export default JobCard
