import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"

import logo from "@/app/images/logo.png"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Hireloop — home"
      className={cn(
        "inline-flex items-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <Image
        src={logo}
        alt="Hireloop"
        width={77}
        height={22}
        priority
        className="h-7 w-auto sm:h-8"
      />
    </Link>
  )
}
