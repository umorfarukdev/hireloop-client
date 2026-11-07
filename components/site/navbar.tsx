"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BriefcaseBusinessIcon, Building2Icon, MenuIcon, TagsIcon } from "lucide-react"

import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "cn"

const NAV_LINKS = [
  { href: "/jobs", label: "Browse Jobs", icon: BriefcaseBusinessIcon },
  { href: "/company", label: "Company", icon: Building2Icon },
  { href: "/pricing", label: "Pricing", icon: TagsIcon },
]

export function SiteNavbar() {
  const pathname = usePathname()

  return (
    <header className="sticky inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4">
      <nav
        data-slot="site-navbar"
        className="flex h-14 w-full max-w-6xl items-center justify-between gap-2 rounded-full border border-border bg-background/70 pl-4 pr-3 shadow-lg shadow-black/5 backdrop-blur-md"
      >
        {/* Logo */}
        <Logo />

        {/* Desktop navigation links */}
        <NavigationMenu
          aria-label="Main"
          className="absolute left-1/2 hidden -translate-x-1/2 md:flex"
        >
          <NavigationMenuList>
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    render={<Link href={link.href} />} 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "rounded-full bg-transparent hover:bg-muted dark:hover:bg-muted/50",
                      active
                        ? "font-semibold text-foreground"
                        : "font-normal text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            nativeButton={false}
            className="hidden rounded-full font-semibold text-muted-foreground hover:text-foreground sm:inline-flex"
            render={<Link href="/sign-in" />}
          >
            Sign In
          </Button>

          {/* Divider (Line 2 in the design) */}
          <div
            aria-hidden="true"
            className="hidden h-5 w-px bg-border sm:block"
          />

          <Button
            nativeButton={false}
            className="hidden rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-violet-500/25 hover:from-indigo-400 hover:to-violet-400 sm:inline-flex"
            render={<Link href="/sign-up" />}
          >
            Get Started
          </Button>

          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="rounded-full md:hidden"
                />
              }
            >
              <MenuIcon />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <Logo className="text-base" />
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Hireloop navigation menu
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon
                  const active = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors hover:bg-muted aria-expanded:hover:bg-muted dark:hover:bg-muted/50",
                        active
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              <SheetFooter className="gap-2">
                <Button
                  variant="outline"
                  nativeButton={false}
                  className="w-full rounded-full"
                  render={<Link href="/sign-in" />}
                >
                  Sign In
                </Button>
                <Button
                  nativeButton={false}
                  className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-violet-500/25 hover:from-indigo-400 hover:to-violet-400"
                  render={<Link href="/sign-up" />}
                >
                  Get Started
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
