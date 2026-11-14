"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  BookmarkIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  SearchIcon,
  WalletIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import JobApplyButton from "@/app/components/JobApplyButton"
import { removeSavedJob } from "@/lib/actions/savedJobs"
import { formatLocation, formatSalary } from "@/lib/jobs"
import { JobFormValues } from "@/type/type"
import { cn } from "cn"

/* ------------------------------------------------------------------ */
/* Seeker › Saved Jobs list (Figma "Seeker / Saved Jobs"): search,     */
/* stats, category chips, sort, bento cards, Load More.                */
/* ------------------------------------------------------------------ */

export type SavedJobRow = {
  id: string
  jobId: string
  jobTitle: string
  companyName: string
  category: string
  savedLabel: string // "Saved 2 hours ago"
  savedMs: number // sort key
  deadlineLabel: string | null // "Closes in 3 days" / "Closed …"
  deadlineMs: number | null // sort key
  closingSoon: boolean
  closed: boolean
  job: JobFormValues | null
}

const SORT_OPTIONS = [
  { value: "recent", label: "Recently Saved" },
  { value: "oldest", label: "Oldest Saved" },
  { value: "salary", label: "Highest Salary" },
  { value: "closing", label: "Closing Soon" },
]

const PAGE_SIZE = 5

const salaryMaxOf = (row: SavedJobRow) =>
  row.job?.maxSalary ?? row.job?.minSalary ?? -1

/* ------------------------------------------------------------------ */
/* One saved-job card                                                  */
/* ------------------------------------------------------------------ */

const SavedJobCard = ({
  row,
  removing,
  onRemove,
}: {
  row: SavedJobRow
  removing: boolean
  onRemove: () => void
}) => {
  const salary = row.job
    ? formatSalary(row.job.minSalary, row.job.maxSalary, row.job.salaryFrequency)
    : null
  const location = row.job ? formatLocation(row.job) : null

  const initials = row.companyName
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")

  return (
    <article className="rounded-xl border bg-card p-5">
      <div className="flex items-start gap-3">
        {/* Company logo */}
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-sm font-semibold text-primary-foreground"
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <h3 className="font-semibold leading-snug">
              <Link
                href={`/browse-jobs/${row.jobId}`}
                className="transition-colors hover:text-primary"
              >
                {row.jobTitle}
              </Link>
            </h3>
            <Badge variant="secondary">{row.companyName}</Badge>
          </div>

          {/* Location + salary chips */}
          {(location || salary) && (
            <div className="flex flex-wrap gap-2">
              {location && (
                <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
                  <MapPinIcon aria-hidden="true" />
                  {location}
                </Badge>
              )}
              {salary && (
                <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
                  <WalletIcon aria-hidden="true" />
                  {salary}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Open jobs: remove from the list. Closed jobs get the full
            "Remove from List" button below instead. */}
        {!row.closed && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove from saved jobs"
            disabled={removing}
            onClick={onRemove}
            className="relative z-10 shrink-0"
          >
            <BookmarkIcon className="fill-current text-primary" />
          </Button>
        )}
      </div>

      {/* Saved time, deadline & action */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <BookmarkIcon className="size-3.5" aria-hidden="true" />
            {row.savedLabel}
          </span>
          {row.deadlineLabel && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5",
                row.closed
                  ? "text-red-600 dark:text-red-400"
                  : row.closingSoon
                    ? "text-amber-600 dark:text-amber-400"
                    : undefined
              )}
            >
              <CalendarIcon className="size-3.5" aria-hidden="true" />
              {row.deadlineLabel}
            </span>
          )}
          {row.closed && (
            <Badge
              variant="outline"
              className="border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
            >
              Job closed by employer
            </Badge>
          )}
        </div>

        {row.closed || !row.job ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={removing}
            onClick={onRemove}
          >
            Remove from List
          </Button>
        ) : (
          <JobApplyButton job={row.job} />
        )}
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Page body                                                           */
/* ------------------------------------------------------------------ */

const SavedJobs = ({
  rows,
  userId,
}: {
  rows: SavedJobRow[]
  userId: string
}) => {
  const [items, setItems] = useState(rows)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState("recent")
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [removingId, setRemovingId] = useState<string | null>(null)

  // Search filters live as the user types — no URL query strings
  // (same pattern as Browse Jobs / My Applications).
  const handleQueryChange = (value: string) => {
    setQuery(value)
    setVisible(PAGE_SIZE)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setVisible(PAGE_SIZE)
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    setVisible(PAGE_SIZE)
  }

  const handleRemove = async (row: SavedJobRow) => {
    if (removingId) return

    setRemovingId(row.id)
    try {
      const result = await removeSavedJob({
        jobId: row.jobId,
        userId,
      })
      if (result.deletedCount) {
        setItems((prev) => prev.filter((item) => item.id !== row.id))
      }
    } catch (error) {
      console.error("Failed to remove saved job:", error)
    } finally {
      setRemovingId(null)
    }
  }

  // Category chips derived from the saved jobs themselves.
  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of items) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1)
    }
    return [...counts].map(([value, count]) => ({ value, count, label: value }))
  }, [items])

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    const list = items.filter((item) => {
      if (category !== "all" && item.category !== category) return false
      if (!keyword) return true

      const haystack = [
        item.jobTitle,
        item.companyName,
        item.job?.location ?? "",
        item.category,
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(keyword)
    })

    if (sort === "recent") {
      list.sort((a, b) => b.savedMs - a.savedMs)
    } else if (sort === "oldest") {
      list.sort((a, b) => a.savedMs - b.savedMs)
    } else if (sort === "salary") {
      list.sort((a, b) => salaryMaxOf(b) - salaryMaxOf(a))
    } else if (sort === "closing") {
      list.sort(
        (a, b) => (a.deadlineMs ?? Infinity) - (b.deadlineMs ?? Infinity)
      )
    }

    return list
  }, [items, query, category, sort])

  const visibleItems = filtered.slice(0, visible)

  const stats = [
    { label: "Total Saved", value: `${items.length}`, icon: BookmarkIcon },
    {
      label: "Closing Soon",
      value: `${items.filter((item) => item.closingSoon).length}`,
      icon: CalendarIcon,
    },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      {/* ---------------- Search ---------------- */}
      <div className="relative">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder="Search jobs, companies, or skills..."
          aria-label="Search saved jobs"
          className="h-10 pl-9"
        />
      </div>

      {/* ---------------- Header ---------------- */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Saved Jobs</h2>
        <p className="text-sm text-muted-foreground">
          Manage and track your bookmarked opportunities.
        </p>
      </div>

      {/* ---------------- Stats ---------------- */}
      <div className="grid grid-cols-2 gap-4 lg:max-w-lg">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4 md:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- Filters & Sort ---------------- */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={category === "all" ? "default" : "outline"}
            onClick={() => handleCategoryChange("all")}
          >
            All Saved
          </Button>
          {categoryOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={category === option.value ? "default" : "outline"}
              onClick={() => handleCategoryChange(option.value)}
            >
              {option.label} ({option.count})
            </Button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sort} onValueChange={(value) => handleSortChange(value ?? "recent")}>
            <SelectTrigger className="w-44">
              {SORT_OPTIONS.find((option) => option.value === sort)?.label}
            </SelectTrigger>

            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ---------------- List ---------------- */}
      {visibleItems.length > 0 ? (
        <div className="space-y-4">
          {visibleItems.map((row) => (
            <SavedJobCard
              key={row.id}
              row={row}
              removing={removingId === row.id}
              onRemove={() => handleRemove(row)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {items.length
              ? "No saved jobs match your search or filters."
              : "You haven't saved any jobs yet — bookmark jobs to find them here."}
          </p>
          {!items.length && (
            <Link
              href="/browse-jobs"
              className="text-sm text-primary transition-colors hover:underline"
            >
              Browse jobs
            </Link>
          )}
        </div>
      )}

      {/* ---------------- Load More ---------------- */}
      {visible < filtered.length && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setVisible((value) => value + PAGE_SIZE)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}

export default SavedJobs
