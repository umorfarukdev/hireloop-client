import { Badge } from "@/components/ui/badge"
import { JobStatus } from "@/type/type"

/* ------------------------------------------------------------------ */
/* Active (green) / Expired (red) badge — shared by the manage-jobs    */
/* table, its mobile cards, and the job-details header.                */
/* ------------------------------------------------------------------ */

export const successBadgeClass =
  "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"

export const dangerBadgeClass =
  "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"

const StatusBadge = ({ status }: { status: JobStatus }) => (
  <Badge
    variant="outline"
    className={status === "Active" ? successBadgeClass : dangerBadgeClass}
  >
    {status}
  </Badge>
)

export default StatusBadge
