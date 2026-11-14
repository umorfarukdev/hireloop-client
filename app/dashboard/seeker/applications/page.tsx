import { getJobs } from "@/lib/api/jobs"
import { auth } from "@/lib/auth"
import { relativeSince, timestampOf } from "@/lib/format"
import { formatLocation, typeLabelOf } from "@/lib/jobs"
import { JobApplication, JobFormValues } from "@/type/type"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import MyApplications, { ApplicationRow } from "./MyApplications"
import { getApplications } from "@/lib/actions/applications"

const ApplicationsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = session?.user

  if (!user) {
    redirect("/sign-in")
  }

  const applications: JobApplication[] = await getApplications(
    `applicantId=${user.id}`
  )

  // Enrich each application with its job (type + location) for the table.
  const jobs: JobFormValues[] = await getJobs()
  const jobById = new Map(jobs.map((job) => [job._id, job]))

  const rows: ApplicationRow[] = applications
    // Sort newest-first using the raw timestamp…
    .map((application) => ({
      application,
      time: timestampOf(application.appliedAt, application._id) ?? 0,
    }))
    .sort((a, b) => b.time - a.time)
    // …then flatten to the serializable rows the table renders.
    .map(({ application, time }) => {
      const job = jobById.get(application.jobId)

      return {
        id: application._id ?? application.jobId,
        jobId: application.jobId,
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        meta: job
          ? `${typeLabelOf(job)} · ${formatLocation(job)}`
          : "Job no longer listed",
        applied: relativeSince(time || null),
        status: application.status ?? "Applied",
      }
    })

  return <MyApplications rows={rows} />
}

export default ApplicationsPage
