
"use client"

import { useMemo, useState } from "react"

import JobSearchBar from "@/app/components/JobSearchBar"
import JobFilters from "@/app/components/JobFilters"
import JobListings from "@/app/components/JobListings"

import {
  JOB_CATEGORIES,
  JOB_TYPES,
  labelOf,
} from "@/lib/jobs"

import type { FilterOption } from "@/app/components/Filters"
import { JobFormValues } from "@/type/type"

const PAGE_SIZE = 6

/** "human-resources" → "Human Resources" */
const humanize = (value: string) =>
  value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

const BrowseJobs = ({
  jobs,
  savedIds = [],
}: {
  jobs: JobFormValues[]
  savedIds?: string[]
}) => {
  const [query, setQuery] = useState("")
  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [salary, setSalary] = useState("0")
  const [sort, setSort] = useState("recent")
  const [page, setPage] = useState(1)

  // Filter options
  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>()

    for (const job of jobs) {
      counts.set(
        job.jobCategory,
        (counts.get(job.jobCategory) ?? 0) + 1
      )
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
      counts.set(
        job.location,
        (counts.get(job.location) ?? 0) + 1
      )
    }

    return [...counts].map(([value, count]) => ({
      value,
      count,
      label: value,
    }))
  }, [jobs])

  const jobTypeOptions: FilterOption[] = useMemo(
    () =>
      JOB_TYPES.map((type) => ({
        ...type,
        count: jobs.filter(
          (job) => job.jobType === type.value
        ).length,
      })),
    [jobs]
  )

  // Filtering and sorting
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const floor = Number(salary)

    const list = jobs.filter((job) => {
      if (jobTypes.length && !jobTypes.includes(job.jobType))
        return false

      if (
        categories.length &&
        !categories.includes(job.jobCategory)
      )
        return false

      if (
        locations.length &&
        !locations.includes(job.location)
      )
        return false

      if (
        floor > 0 &&
        (job.maxSalary ?? job.minSalary ?? 0) < floor
      )
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
      list.sort((a, b) =>
        (b.postedAt || "").localeCompare(a.postedAt || "")
      )
    } else if (sort === "oldest") {
      list.sort((a, b) =>
        (a.postedAt || "").localeCompare(b.postedAt || "")
      )
    } else if (sort === "salary") {
      list.sort(
        (a, b) =>
          (b.maxSalary ?? b.minSalary ?? 0) -
          (a.maxSalary ?? a.minSalary ?? 0)
      )
    }

    return list
  }, [jobs, query, jobTypes, categories, locations, salary, sort])

  // Pagination
  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  )

  const currentPage = Math.min(page, pageCount)

  const pageJobs = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // Toggle filters
  const toggle = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => (value: string) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )

    setPage(1)
  }

  // Check active filters
  const hasFilters =
    query !== "" ||
    jobTypes.length > 0 ||
    categories.length > 0 ||
    locations.length > 0 ||
    salary !== "0"

  // Clear filters
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

      {/* Search */}
      <JobSearchBar
        value={query}
        onChange={(value) => {
          setQuery(value)
          setPage(1)
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">

        {/* Sidebar Filters */}
        <JobFilters
          jobTypeOptions={jobTypeOptions}
          categoryOptions={categoryOptions}
          locationOptions={locationOptions}
          jobTypes={jobTypes}
          categories={categories}
          locations={locations}
          salary={salary}
          onJobTypeToggle={toggle(setJobTypes)}
          onCategoryToggle={toggle(setCategories)}
          onLocationToggle={toggle(setLocations)}
          onSalaryChange={(value) => {
            setSalary(value)
            setPage(1)
          }}
          onClear={clearFilters}
          hasFilters={hasFilters}
        />

        {/* Job Listings */}
        <JobListings
          jobs={pageJobs}
          totalJobs={filtered.length}
          page={currentPage}
          pageCount={pageCount}
          sort={sort}
          savedIds={savedIds}
          onSortChange={(value) => {
            setSort(value)
            setPage(1)
          }}
          onPageChange={setPage}
          onClearFilters={clearFilters}
        />

      </div>
    </div>
  )
}

export default BrowseJobs
