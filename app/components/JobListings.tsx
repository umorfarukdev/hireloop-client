
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

import JobCard from "@/app/components/JobCard"
import Pagination from "@/app/components/Pagination"
import { JobFormValues } from "@/type/type"

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "salary", label: "Highest Salary" },
  { value: "relevant", label: "Most Relevant" },
  { value: "oldest", label: "Oldest" },
]

type JobListingsProps = {
  jobs: JobFormValues[]
  totalJobs: number
  page: number
  pageCount: number
  sort: string
  onSortChange: (value: string) => void
  onPageChange: (page: number) => void
  onClearFilters: () => void
}

const JobListings = ({
  jobs,
  totalJobs,
  page,
  pageCount,
  sort,
  onSortChange,
  onPageChange,
  onClearFilters,
}: JobListingsProps) => {
  return (
    <section className="space-y-4">
      {/* Header and Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">
          Found {totalJobs}{" "}
          {totalJobs === 1
            ? "Professional Job"
            : "Professional Jobs"}
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Sort by:
          </span>

          <Select value={sort} onValueChange={(value) => onSortChange(value ?? "recent")}>
            <SelectTrigger className="w-44">
              {SORT_OPTIONS.find(
                (option) => option.value === sort
              )?.label}
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
      {jobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
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
            onClick={onClearFilters}
            className="text-sm text-primary transition-colors hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={onPageChange}
      />
    </section>
  )
}

export default JobListings
