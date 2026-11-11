import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/* ------------------------------------------------------------------ */
/* Browse Jobs search bar — keyword input + "Search Jobs" button.      */
/* Results filter live as the user types; the button has no query      */
/* behavior on purpose (empty handler).                                */
/* ------------------------------------------------------------------ */

const JobSearchBar = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  // Intentionally empty: filtering happens as the input changes, so the
  // button never runs a search or writes URL query strings.
  const handleSearchClick = () => {}

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by job title, keywords..."
          aria-label="Search jobs"
          className="h-10 pl-9"
        />
      </div>
      <Button type="button" className="h-10" onClick={handleSearchClick}>
        Search Jobs
      </Button>
    </div>
  )
}

export default JobSearchBar
