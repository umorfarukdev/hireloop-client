import { Button } from "@/components/ui/button"
import { EyeIcon, PencilIcon } from "lucide-react"
import Link from "next/link"
import DeleteJobDialog from "./DeleteJobDialog"
import { JobFormValues } from "@/type/type"

/* ------------------------------------------------------------------ */
/* Row actions — Update (link) / View / Delete                         */
/* ------------------------------------------------------------------ */

const JobsRowActions = ({ job }: { job: JobFormValues }) => (
  <div className="flex items-center justify-end gap-1.5">
    <Button
      variant="outline"
      size="sm"
      nativeButton={false}
      render={<Link href={`/dashboard/recruiter/jobs/new?edit=${job._id}`} />}
    >
      <PencilIcon aria-hidden="true" />
      Update
    </Button>
    <Link href={`/dashboard/recruiter/jobs/${job._id}`}>
      <Button
        variant="ghost"
        size="icon"
        title={`View ${job.jobTitle}`}
        aria-label={`View ${job.jobTitle}`}
      >
        <EyeIcon />
      </Button>
    </Link>
    <DeleteJobDialog job={job} />
  </div>
)

export default JobsRowActions
