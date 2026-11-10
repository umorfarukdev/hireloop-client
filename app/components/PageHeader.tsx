import { Fragment, type ReactNode } from "react"
import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

/* ------------------------------------------------------------------ */
/* Breadcrumb + page title + description (+ optional action slot).     */
/* Shared by Manage Jobs and Post a New Job.                           */
/* ------------------------------------------------------------------ */

type Crumb = { label: string; href?: string }

const PageHeader = ({
  crumbs,
  title,
  description,
  actions,
}: {
  crumbs: Crumb[]
  title: string
  description?: string
  actions?: ReactNode
}) => {
  const heading = (
    <div className="space-y-1">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm"
      >
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.label}>
            {index > 0 && (
              <ChevronRightIcon
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            {index === crumbs.length - 1 ? (
              <span className="font-medium">{crumb.label}</span>
            ) : crumb.href ? (
              <Link
                href={crumb.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-muted-foreground">{crumb.label}</span>
            )}
          </Fragment>
        ))}
      </nav>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )

  if (!actions) return heading

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {heading}
      {actions}
    </div>
  )
}

export default PageHeader
