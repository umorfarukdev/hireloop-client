"use client"

import Link from "next/link"
import { useState } from "react"
import {
  BriefcaseBusinessIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldCheckIcon,
  UserRoundIcon,
  type LucideIcon,
} from "lucide-react"

import { AuthFormData, UserRole } from "@/type/type"
import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "cn"

type Mode = "signin" | "signup"

const ROLES: Array<{ value: UserRole; label: string; icon: LucideIcon }> = [
  { value: "seeker", label: "Seeker", icon: UserRoundIcon },
  { value: "recruiter", label: "Recruiter", icon: BriefcaseBusinessIcon },
  { value: "admin", label: "Admin", icon: ShieldCheckIcon },
]

// Optional hook for real auth logic (e.g. better-auth). Receives the
// collected form values. Return better-auth's `{ error }` shape or
// throw to surface an inline error message on the form.
export type AuthSubmitHandler = (
  data: AuthFormData
) => Promise<unknown> | unknown

const COPY: Record<
  Mode,
  {
    title: string
    subtitle: string
    cta: string
    loadingCta: string
    toggleText: string
    toggleHref: string
    toggleAction: string
  }
> = {
  signin: {
    title: "Welcome back",
    subtitle: "Sign in to keep exploring top job opportunities.",
    cta: "Sign In",
    loadingCta: "Signing in…",
    toggleText: "Don't have an account?",
    toggleHref: "/sign-up",
    toggleAction: "Sign Up",
  },
  signup: {
    title: "Create your account",
    subtitle: "Join HireLoop and land your next role faster.",
    cta: "Sign Up",
    loadingCta: "Creating account…",
    toggleText: "Already have an account?",
    toggleHref: "/sign-in",
    toggleAction: "Sign In",
  },
}

export function AuthForm({
  mode,
  onSubmit,
}: {
  mode: Mode
  onSubmit?: AuthSubmitHandler
}) {
  const copy = COPY[mode]
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole>("seeker")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as AuthFormData

    if (!onSubmit) {
      // No handler wired yet — just surface the collected data.
      console.log("form data", formData)
      setLoading(true)
      setTimeout(() => setLoading(false), 600)
      return
    }

    setError(null)
    setLoading(true)
    try {
      const result = await onSubmit(formData)
      // better-auth resolves with `{ data, error }` instead of throwing
      const authError = (
        result as { error?: { message?: string } } | undefined
      )?.error
      if (authError) {
        setError(authError.message ?? "Something went wrong. Please try again.")
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Logo className="text-lg" />

        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="text-2xl font-heading font-bold tracking-tight">
            {copy.title}
          </h1>
          <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 rounded-2xl border bg-card/70 p-6 shadow-lg shadow-black/5 backdrop-blur-md"
        >
          {mode === "signup" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className="h-10 rounded-xl sm:h-10"
              />
            </div>
          )}

          {/* Role picker (sign-up only) */}
          {mode === "signup" && (
            <div
              role="radiogroup"
              aria-label="Account role"
              className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1"
            >
              {ROLES.map((option) => {
                const Icon = option.icon
                const selected = role === option.value
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors outline-none",
                      selected
                        ? "bg-card text-foreground shadow-sm ring-1 ring-ring/20"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={selected}
                      onChange={() => setRole(option.value)}
                      className="sr-only"
                    />
                    <Icon className="size-3.5" aria-hidden="true" />
                    {option.label}
                  </label>
                )
              })}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="h-10 rounded-xl sm:h-10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === "signin" && (
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                minLength={mode === "signup" ? 8 : undefined}
                placeholder={
                  mode === "signup" ? "At least 8 characters" : "Enter your password"
                }
                className="h-10 rounded-xl pr-10 sm:h-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-base font-semibold text-white shadow-md shadow-violet-500/25 hover:from-indigo-400 hover:to-violet-400"
          >
            {loading ? copy.loadingCta : copy.cta}
          </Button>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              {error}
            </p>
          )}
        </form>

        <p
          className={cn(
            "text-sm text-muted-foreground",
            mode === "signup" && "text-center"
          )}
        >
          {copy.toggleText}{" "}
          <Link
            href={copy.toggleHref}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {copy.toggleAction}
          </Link>
        </p>
      </div>
    </div>
  )
}
