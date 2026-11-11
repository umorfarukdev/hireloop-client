import { Fragment } from "react"

import { Button } from "@/components/ui/button"

/* ------------------------------------------------------------------ */
/* Shared pagination — used under the Browse Jobs listing.             */
/* ------------------------------------------------------------------ */

const Pagination = ({
  page,
  pageCount,
  onChange,
}: {
  page: number
  pageCount: number
  onChange: (page: number) => void
}) => {
  if (pageCount <= 1) return null

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </Button>

      {pages.map((value) => (
        <Fragment key={value}>
          <Button
            type="button"
            variant={value === page ? "default" : "outline"}
            size="sm"
            aria-current={value === page ? "page" : undefined}
            onClick={() => onChange(value)}
          >
            {value}
          </Button>
        </Fragment>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  )
}

export default Pagination
