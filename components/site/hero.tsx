import Image from "next/image"
import Link from "next/link"
import { MapPinIcon, SearchIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import globe from "@/app/images/globe.png"
import { cn } from "cn"

const TRENDING_POSITIONS = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
]

export function Hero() {
  return (
    <section
      data-slot="hero"
      className="relative isolate flex min-h-svh flex-col items-center overflow-hidden px-4 pb-96 pt-32 sm:pt-40"
    >
      {/* Globe artwork */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 flex justify-center"
      >
        <Image
          src={globe}
          alt=""
          priority
          draggable={false}
          className="pointer-events-none w-[min(1400px,240vw)] max-w-none select-none"
        />
        {/* Seat the artwork into the page background (works on both themes) */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/0 to-background/10 sm:from-background/40 dark:via-background/35 dark:to-background/20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground shadow-sm backdrop-blur">
          <SparklesIcon className="size-3.5 text-violet-500" aria-hidden="true" />
          <span className="relative font-bold">50,000+</span>
          new jobs this month
        </div>

        {/* Title */}
        <h1 className="text-5xl font-heading font-bold tracking-tighter text-balance sm:text-6xl md:text-7xl">
          Find Your{" "}
          <span className="bg-gradient-to-r from-violet-500 to-orange-500 bg-clip-text text-transparent">
            Dream Job
          </span>{" "}
          Today
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-base/relaxed text-pretty text-muted-foreground sm:text-lg">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role faster.
        </p>

        {/* Search bar */}
        <form
          action="/jobs"
          method="get"
          className="mt-2 flex w-full max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <div className="flex h-14 w-full items-center gap-2 rounded-full border bg-card/70 py-1.5 pr-1.5 pl-5 shadow-lg shadow-black/5 backdrop-blur-md sm:h-14 sm:w-auto sm:flex-1">
            <SearchIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              name="q"
              placeholder="Job title, skill or company"
              className="h-full border-0 bg-transparent px-0 text-sm shadow-none dark:bg-transparent focus-visible:ring-0 sm:w-full sm:min-w-56"
            />
            <div
              aria-hidden="true"
              className="hidden h-6 w-px bg-border lg:block"
            />
            <div className="hidden items-center gap-2 lg:flex">
              <MapPinIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                name="location"
                placeholder="Location or Remote"
                className="h-full w-44 border-0 bg-transparent px-0 text-sm shadow-none dark:bg-transparent focus-visible:ring-0"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-11 shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-violet-500/25 hover:from-indigo-400 hover:to-violet-400"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Trending positions */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 text-sm">
          <span className="font-mono text-xs text-muted-foreground">
            Trending Position
          </span>
          {TRENDING_POSITIONS.map((position, i) => (
            <Link
              key={position}
              href={`/jobs?tag=${encodeURIComponent(position)}`}
              className={cn(
                "inline-flex items-center rounded-full border bg-card/60 px-3.5 py-1 text-muted-foreground backdrop-blur transition-colors hover:text-foreground hover:bg-muted/60",
                i === 1 && "max-sm:hidden"
              )}
            >
              {position}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
