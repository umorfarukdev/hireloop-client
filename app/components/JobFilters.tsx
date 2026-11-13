
"use client"

import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

import {
  FilterChecks,
  FilterGroup,
  type FilterOption,
} from "@/app/components/Filters"

const SALARY_OPTIONS = [
  { value: "0", label: "Any salary" },
  { value: "50000", label: "$50k+" },
  { value: "100000", label: "$100k+" },
  { value: "150000", label: "$150k+" },
]

type JobFiltersProps = {
  jobTypeOptions: FilterOption[]
  categoryOptions: FilterOption[]
  locationOptions: FilterOption[]
  jobTypes: string[]
  categories: string[]
  locations: string[]
  salary: string
  onJobTypeToggle: (value: string) => void
  onCategoryToggle: (value: string) => void
  onLocationToggle: (value: string) => void
  onSalaryChange: (value: string) => void
  onClear: () => void
  hasFilters: boolean
}

const JobFilters = ({
  jobTypeOptions,
  categoryOptions,
  locationOptions,
  jobTypes,
  categories,
  locations,
  salary,
  onJobTypeToggle,
  onCategoryToggle,
  onLocationToggle,
  onSalaryChange,
  onClear,
  hasFilters,
}: JobFiltersProps) => {
  return (
    <aside className="space-y-5 rounded-xl border bg-card p-5 lg:sticky lg:top-20 lg:self-start">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Filters</h2>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
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
          onToggle={onJobTypeToggle}
        />
      </FilterGroup>

      <Separator />

      <FilterGroup title="Category">
        <FilterChecks
          options={categoryOptions}
          selected={categories}
          onToggle={onCategoryToggle}
        />
      </FilterGroup>

      <Separator />

      <FilterGroup title="Location">
        <FilterChecks
          options={locationOptions}
          selected={locations}
          onToggle={onLocationToggle}
        />
      </FilterGroup>

      <Separator />

      <FilterGroup title="Salary">
        <Select
          value={salary}
          onValueChange={(value) => onSalaryChange(value ?? "0")}
        >
          <SelectTrigger className="w-full">
            {SALARY_OPTIONS.find(
              (option) => option.value === salary
            )?.label}
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
  )
}

export default JobFilters
