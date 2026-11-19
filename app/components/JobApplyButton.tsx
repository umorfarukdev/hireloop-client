"use client"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { getApplicationsCount, jobApply } from "@/lib/actions/applications"
import { getPremiumUserById } from "@/lib/api/users"
import { useSession } from "@/lib/auth-client"
import { JobFormValues } from "@/type/type"
import { useRouter } from "next/navigation"

const JobApplyButton = ({ job }: { job: JobFormValues }) => {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()

  const handleEasyApply = async () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
      return
    } else if (user.role === "seeker") {

      const premiumResult = await getPremiumUserById(user.id)
      console.log(premiumResult);
      // Redirect to the job application page
      // console.log("save application database");
      const countResult = await getApplicationsCount(`applicantId=${user.id}`)

      if (!premiumResult.premium && countResult.count >= 2) {
        router.push("/checkout")
        return
      } else {
        const application = {
          jobId: job._id,
          userId: user.id,
          userEmail: user.email,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
        }

        const result = await jobApply(application)
        if (result.insertedId) {
          console.log("Application submited", result)
          toast.add({
            title: "Application submitted",
            description: "Your application has been submitted successfully.",
          })
          router.push("/browse-jobs")
        }
      }
    } else {
      console.log("user is not seeker")
    }
  }
  return (
    <div>
      <Button onClick={handleEasyApply}>Apply Now</Button>
    </div>
  )
}

export default JobApplyButton
