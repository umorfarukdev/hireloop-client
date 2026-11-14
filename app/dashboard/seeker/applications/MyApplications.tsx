"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  BriefcaseIcon,
  CalendarIcon,
  DownloadIcon,
  FileTextIcon,
  SearchIcon,
  StarIcon,
  TrendingUpIcon,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Pagination from "@/app/components/Pagination"
import { cn } from "cn"
import { ApplicationStatus } from "@/type/type"

/* ------------------------------------------------------------------ */
/* Seeker › My Applications (Figma: "Seeker / My Applications").        */
/* Receives rows built server-side and handles search, Active/Archived */
/* tabs, stats, pagination and the table / mobile cards.               */
/* ------------------------------------------------------------------ */

export type ApplicationRow = {
  id: string
  jobId: string
  jobTitle: string
  companyName: string
  meta: string // "Full-time · Remote"
  applied: string // "2 hours ago"
  status: ApplicationStatus
}

const PAGE_SIZE = 5

const TABS = ["Active", "Archived"] as const
type Tab = (typeof TABS)[number]

/* Status colors — Applied (neutral), Review (amber), Interview (blue),
   Shortlisted (green), Rejected (red), Offered (filled highlight). */
const STATUS_BADGE_CLASS: Record<ApplicationStatus, string> = {
  Applied: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400",
  Review: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Interview: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  Shortlisted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Rejected: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  Offered: "border-emerald-600 bg-emerald-600 text-white",
}

const StatusPill = ({ status }: { status: ApplicationStatus }) => (
  <Badge variant="outline" className={STATUS_BADGE_CLASS[status]}>
    {status}
  </Badge>
)

const IconTile = ({ icon: Icon }: { icon: LucideIcon }) => (
  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
    <Icon className="size-4" aria-hidden="true" />
  </div>
)

const MyApplications = ({ rows }: { rows: ApplicationRow[] }) => {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<Tab>("Active")
  const [page, setPage] = useState(1)

  // Search filters live as the user types — the input never writes URL
  // query strings (same empty-handler pattern as Browse Jobs).
  const handleQueryChange = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const handleTabChange = (value: Tab) => {
    setTab(value)
    setPage(1)
  }

  // Intentionally empty: PDF export has no backend yet.
  const handleExportClick = () => {}

  const stats = useMemo(() => {
    const count = (status: ApplicationStatus) =>
      rows.filter((row) => row.status === status).length

    const shortlisted = count("Shortlisted")
    const offered = count("Offered")
    const succeeded = shortlisted + offered

    return [
      {
        label: "Total Applied",
        value: `${rows.length}`,
        icon: FileTextIcon,
      },
      {
        label: "Shortlisted",
        value: `${shortlisted}`,
        icon: StarIcon,
      },
      {
        label: "Interviews",
        value: `${count("Interview")}`,
        icon: CalendarIcon,
      },
      {
        label: "Success Rate",
        value: rows.length
          ? `${Math.round((succeeded / rows.length) * 100)}%`
          : "0%",
        icon: TrendingUpIcon,
      },
    ]
  }, [rows])

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return rows.filter((row) => {
      // Active keeps everything except rejections; Archived shows them.
      const inTab =
        tab === "Active" ? row.status !== "Rejected" : row.status === "Rejected"
      if (!inTab) return false

      if (!keyword) return true
      return (
        row.jobTitle.toLowerCase().includes(keyword) ||
        row.companyName.toLowerCase().includes(keyword)
      )
    })
  }, [rows, query, tab])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = filtered.slice(start, start + PAGE_SIZE)

  const emptyText = rows.length
    ? "No applications match your search."
    : "You haven't applied to any jobs yet — browse jobs to get started."

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      {/* ---------------- Top search (Figma top nav) ---------------- */}
      <div className="relative">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder="Search applications..."
          aria-label="Search applications"
          className="h-10 pl-9"
        />
      </div>

      {/* ---------------- Header: title, tabs, export ---------------- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              My Applications
            </h2>
            <p className="text-sm text-muted-foreground">
              Track your job applications and interview progress in real-time.
            </p>
          </div>

          {/* Active / Archived segmented tabs */}
          <div className="inline-flex items-center gap-1 rounded-lg border bg-muted p-1">
            {TABS.map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={value === tab ? "outline" : "ghost"}
                className={cn(
                  value === tab
                    ? "shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleTabChange(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="self-start shrink-0"
          onClick={handleExportClick}
        >
          <DownloadIcon aria-hidden="true" />
          Export PDF
        </Button>
      </div>

      {/* ---------------- Stats overview (bento) ---------------- */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-4 md:p-5"
          >
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

      {/* ---------------- Desktop: table (lg and up) ---------------- */}
      <div className="hidden overflow-x-auto rounded-xl border bg-card lg:block">
        <Table className="min-w-[850px]">
          <TableHeader>
            <TableRow>
              <TableHead>JOB TITLE</TableHead>
              <TableHead>COMPANY</TableHead>
              <TableHead>APPLIED</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={row.id}>
                {/* Job title + type/location */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <IconTile icon={BriefcaseIcon} />
                    <div>
                      <div className="font-medium">{row.jobTitle}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.meta}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Company */}
                <TableCell className="font-medium">
                  {row.companyName}
                </TableCell>

                {/* Applied (relative time) */}
                <TableCell className="text-muted-foreground">
                  {row.applied}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusPill status={row.status} />
                </TableCell>

                {/* Action */}
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/browse-jobs/${row.jobId}`} />}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {pageRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ---------------- Mobile: cards (below lg) ---------------- */}
      <div className="space-y-4 lg:hidden">
        {pageRows.map((row) => (
          <Card key={row.id}>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <IconTile icon={BriefcaseIcon} />
                  <div>
                    <div className="font-semibold leading-snug">
                      {row.jobTitle}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {row.meta}
                    </div>
                  </div>
                </div>
                <StatusPill status={row.status} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">
                    {row.companyName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Applied {row.applied}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`/browse-jobs/${row.jobId}`} />}
                >
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {pageRows.length === 0 && (
          <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
            {emptyText}
          </div>
        )}
      </div>

      {/* ---------------- Pagination ---------------- */}
      {filtered.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {start + 1}-{Math.min(start + PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length} applications
          </p>
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  )
}

export default MyApplications
