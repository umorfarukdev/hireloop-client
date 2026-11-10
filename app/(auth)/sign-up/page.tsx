"use client"

import { signUp } from "@/lib/auth-client"
import type { AuthFormData } from "@/type/type"

import { AuthForm } from "@/components/site/auth-form"
import { useRouter } from "next/navigation"

const SignUpPage = () => {
  const router = useRouter()
  const handleSignUp = async (data: AuthFormData) => {
    const { error } = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    })

    if (!error) {
      router.push("/")
    }
    // Surface better-auth errors inline (AuthForm's `{ error }` contract).
    return { error }
  }

  return <AuthForm mode="signup" onSubmit={handleSignUp} />
}

export default SignUpPage
