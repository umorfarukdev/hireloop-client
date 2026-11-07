import type { Metadata } from "next"

import { AuthForm } from "@/components/site/auth-form"

export const metadata: Metadata = {
  title: "Sign In — Hireloop",
  description: "Sign in to your Hireloop account.",
}

const SignInPage = () => {
  
  return <AuthForm mode="signin" />
}

export default SignInPage
