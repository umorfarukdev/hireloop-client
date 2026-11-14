/* ------------------------------------------------------------------ */
/* Date display helpers shared by pages that show "when" something     */
/* happened (e.g. the seeker's My Applications table).                 */
/* ------------------------------------------------------------------ */

const ago = (value: number, unit: string) =>
  `${value} ${unit}${value === 1 ? "" : "s"} ago`

/** Creation time (ms) for an application: an explicit `appliedAt` first,
 *  else the timestamp embedded in the first 4 bytes of its Mongo _id. */
export function timestampOf(appliedAt?: string, id?: string): number | null {
  if (appliedAt) {
    const time = Date.parse(appliedAt)
    if (!Number.isNaN(time)) return time
  }

  const hex = id?.slice(0, 8)
  if (!hex || !/^[0-9a-f]{8}$/i.test(hex)) return null
  return Number.parseInt(hex, 16) * 1000
}

/** Milliseconds-since-epoch → "2 hours ago" / "4 days ago" / … */
export function relativeSince(time: number | null): string {
  if (!time) return "—"

  const minutes = Math.floor((Date.now() - time) / 60_000)
  if (minutes < 1) return "just now"

  const hours = Math.floor(minutes / 60)
  if (hours < 1) return ago(minutes, "minute")

  const days = Math.floor(hours / 24)
  if (days < 1) return ago(hours, "hour")

  if (days < 7) return ago(days, "day")

  const weeks = Math.floor(days / 7)
  if (days < 28) return ago(weeks, "week")

  const months = Math.max(1, Math.floor(days / 30))
  if (days < 365) return ago(months, "month")

  return ago(Math.floor(days / 365), "year")
}
