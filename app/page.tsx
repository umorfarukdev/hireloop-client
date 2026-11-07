import { SiteNavbar } from "@/components/site/navbar"
import { Hero } from "@/components/site/hero"

export default function Page() {
  return (
    <div className="min-h-svh">
      <SiteNavbar />
      <main>
        <Hero />
      </main>
    </div>
  )
}
