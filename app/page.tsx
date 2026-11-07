import { SiteNavbar } from "@/components/site/navbar"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="min-h-svh">
      <SiteNavbar />
      <main className="flex min-h-svh flex-col items-center justify-center p-6 pt-28">
        <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
          <div className="text-center">
            <h1 className="font-medium">Project ready!</h1>
            <p>You may now add components and start building.</p>
            <p>We&apos;ve already added the button component for you.</p>
            <Button className="mt-2">Button</Button>
          </div>
          <div className="text-center font-mono text-xs text-muted-foreground">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </div>
      </main>
    </div>
  )
}
