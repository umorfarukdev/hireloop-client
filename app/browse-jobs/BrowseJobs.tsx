"use client"

import { useMemo, useState } from "react"

import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { JOB_CATEGORIES, JOB_TYPES, labelOf } from "@/lib/jobs"
import JobSearchBar from "@/app/components/JobSearchBar"
import JobCard from "@/app/components/JobCard"
import Pagination from "@/app/components/Pagination"
import { FilterChecks, FilterGroup, type FilterOption } from "@/app/components/Filters"
import { JobFormValues } from "@/type/type"

/* ------------------------------------------------------------------ */
/* Browse Jobs — search + sidebar filters (Figma "Public / Browse      */
/* Jobs"). Filtering is client-side: it runs whenever the user changes */
/* the search input or a filter. The Search button is an empty        */
/* handler on purpose (no URL query strings).                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 6

const SALARY_OPTIONS = [
  { value: "0", label: "Any salary" },
  { value: "50000", label: "$50k+" },
  { value: "100000", label: "$100k+" },
  { value: "150000", label: "$150k+" },
]

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "salary", label: "Highest Salary" },
  { value: "relevant", label: "Most Relevant" },
  { value: "oldest", label: "Oldest" },
]

/** "human-resources" → "Human Resources" (for categories missing a label). */
const humanize = (value: string) =>
  value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

const BrowseJobs = ({ jobs }: { jobs: JobFormValues[] }) => {
  const [query, setQuery] = useState("")
  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [salary, setSalary] = useState("0")
  const [sort, setSort] = useState("recent")
  const [page, setPage] = useState(1)

  /* ---------------- Filter options (derived from the data) ---------- */

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const job of jobs) {
      counts.set(job.jobCategory, (counts.get(job.jobCategory) ?? 0) + 1)
    }
    return [...counts].map(([value, count]) => ({
      value,
      count,
      label: labelOf(JOB_CATEGORIES, value) ?? humanize(value),
    }))
  }, [jobs])

  const locationOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const job of jobs) {
      counts.set(job.location, (counts.get(job.location) ?? 0) + 1)
    }
    return [...counts].map(([value, count]) => ({
      value,
      count,
      label: value,
    }))
  }, [jobs])

  const jobTypeOptions: FilterOption[] = JOB_TYPES.map((type) => ({
    ...type,
    count: jobs.filter((job) => job.jobType === type.value).length,
  }))

  /* ---------------- Filtering + sorting ----------------------------- */

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const floor = Number(salary)

    const list = jobs.filter((job) => {
      if (jobTypes.length && !jobTypes.includes(job.jobType)) return false
      if (categories.length && !categories.includes(job.jobCategory))
        return false
      if (locations.length && !locations.includes(job.location)) return false
      // Salary frequencies differ per job — compare the raw bounds only.
      if (floor > 0 && (job.maxSalary ?? job.minSalary ?? 0) < floor)
        return false
      if (keyword) {
        const haystack = [
          job.jobTitle,
          job.companyName,
          job.location,
          job.jobCategory,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(keyword)) return false
      }
      return true
    })

    if (sort === "recent") {
      list.sort((a, b) => (b.postedAt || "").localeCompare(a.postedAt || ""))
    } else if (sort === "oldest") {
      list.sort((a, b) => (a.postedAt || "").localeCompare(b.postedAt || ""))
    } else if (sort === "salary") {
      list.sort(
        (a, b) =>
          (b.maxSalary ?? b.minSalary ?? 0) -
          (a.maxSalary ?? a.minSalary ?? 0)
      )
    }
    // "relevant" keeps the API's original order.

    return list
  }, [jobs, query, jobTypes, categories, locations, salary, sort])

  /* ---------------- Pagination (clamped to the result count) -------- */

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageJobs = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  /* ---------------- Handlers ---------------------------------------- */

  const toggle =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (value: string) =>
      setter((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      )

  const hasFilters =
    query !== "" ||
    jobTypes.length > 0 ||
    categories.length > 0 ||
    locations.length > 0 ||
    salary !== "0"

  const clearFilters = () => {
    setQuery("")
    setJobTypes([])
    setCategories([])
    setLocations([])
    setSalary("0")
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      {/* Section - Search & Quick Filters */}
      <JobSearchBar value={query} onChange={setQuery} />

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        {/* Aside - Sidebar Filters */}
        <aside className="space-y-5 rounded-xl border bg-card p-5 lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Filters</h2>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-primary transition-colors hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <Separator />

          <FilterGroup title="Job Type">
            <FilterChecks
              options={jobTypeOptions}
              selected={jobTypes}
              onToggle={toggle(setJobTypes)}
            />
          </FilterGroup>

          <Separator />

          <FilterGroup title="Category">
            <FilterChecks
              options={categoryOptions}
              selected={categories}
              onToggle={toggle(setCategories)}
            />
          </FilterGroup>

          <Separator />

          <FilterGroup title="Location">
            <FilterChecks
              options={locationOptions}
              selected={locations}
              onToggle={toggle(setLocations)}
            />
          </FilterGroup>

          <Separator />

          <FilterGroup title="Salary">
            <Select
              value={salary}
              onValueChange={(value) => {
                setSalary(value ?? "0")
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full">
                {SALARY_OPTIONS.find((option) => option.value === salary)?.label}
              </SelectTrigger>
              <SelectContent>
                {SALARY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterGroup>
        </aside>

        {/* Section - Main Job Listing */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-semibold">
              Found {filtered.length}{" "}
              {filtered.length === 1 ? "Professional Job" : "Professional Jobs"}
            </h1>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sort} onValueChange={(value) => setSort(value ?? "recent")}>
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

          {/* Job Grid */}
          {pageJobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pageJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No jobs match your search or filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-primary transition-colors hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onChange={setPage}
          />
        </section>
      </div>
    </div>
  )
}

export default BrowseJobs
