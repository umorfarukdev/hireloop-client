import type { ReactNode } from "react"

/* ------------------------------------------------------------------ */
/* Sidebar filter building blocks — shared by every filter group on the */
/* Browse Jobs page (Job Type, Category, Location).                    */
/* ------------------------------------------------------------------ */

export type FilterOption = {
  value: string
  label: string
  count?: number
}

/** Titled card section inside the Filters sidebar. */
export const FilterGroup = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold">{title}</h3>
    <div className="space-y-1.5">{children}</div>
  </div>
)

/** Checkbox rows with an optional per-option count (e.g. "12"). */
export const FilterChecks = ({
  options,
  selected,
  onToggle,
}: {
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
}) => (
  <>
    {options.map((option) => (
      <label
        key={option.value}
        className="flex cursor-pointer items-center gap-2.5 text-sm"
      >
        <input
          type="checkbox"
          checked={selected.includes(option.value)}
          onChange={() => onToggle(option.value)}
          className="size-4 shrink-0 accent-primary"
        />
        <span className="text-muted-foreground">{option.label}</span>
        {option.count !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground">
            {option.count}
          </span>
        )}
      </label>
    ))}
  </>
)
