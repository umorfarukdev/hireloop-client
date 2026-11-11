import { SiteNavbar } from "@/components/site/navbar"
import { getJobs } from "@/lib/api/jobs"
import BrowseJobs from "./BrowseJobs"

/* ------------------------------------------------------------------ */
/* Public Browse Jobs (Figma "Public / Browse Jobs") — server fetches  */
/* every job once; all search/filter/sort runs client-side.           */
/* ------------------------------------------------------------------ */

const BrowseJobsPage = async () => {
  const jobs = await getJobs()

  return (
    <div className="min-h-svh">
      <SiteNavbar />
      <main className="pt-8">
        <BrowseJobs jobs={jobs} />
      </main>
    </div>
  )
}

export default BrowseJobsPage
