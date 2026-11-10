"use client"
import { Trash2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteJob } from "@/lib/actions/jobs"

import { useState } from "react"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import { JobFormValues } from "@/type/type"

const DeleteJobDialog = ({ job }: { job: JobFormValues }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      const res = await deleteJob(job._id)
      if (res?.deletedCount) {
        setOpen(false)
        toast.add({
          type: "success",
          title: "Job deleted",
          description: `"${job.jobTitle}" was removed permanently.`,
        })
        router.refresh()
      } else {
        toast.add({
          type: "error",
          title: "Could not delete job",
          description: "Something went wrong. Please try again.",
        })
      }
    } catch {
      toast.add({
        type: "error",
        title: "Could not delete job",
        description: "Something went wrong. Please try again.",
      })
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="destructive">
            <Trash2Icon />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete job?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the &quot;{job.jobTitle}&quot; job
            post. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteJobDialog
