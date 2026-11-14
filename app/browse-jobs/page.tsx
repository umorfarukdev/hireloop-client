import { SiteNavbar } from "@/components/site/navbar"
import { getSavedJobIds } from "@/lib/actions/savedJobs"
import { getJobs } from "@/lib/api/jobs"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import BrowseJobs from "./BrowseJobs"

/* ------------------------------------------------------------------ */
/* Public Browse Jobs (Figma "Public / Browse Jobs") — server fetches  */
/* every job once; all search/filter/sort runs client-side.           */
/* Saved-job ids are preloaded so bookmarks render in the right state. */
/* ------------------------------------------------------------------ */

const BrowseJobsPage = async () => {
  const jobs = await getJobs()

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const savedIds = session?.user
    ? await getSavedJobIds(session.user.email)
    : []

  return (
    <div className="min-h-svh">
      <SiteNavbar />
      <main className="pt-8">
        <BrowseJobs jobs={jobs} savedIds={savedIds} />
      </main>
    </div>
  )
}

export default BrowseJobsPage
