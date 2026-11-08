"use client"

import { signUp } from "@/lib/auth-client"
import type { AuthFormData } from "@/type/type"

import { AuthForm } from "@/components/site/auth-form"
import { useRouter } from "next/navigation"

const SignUpPage = () => {
  const router = useRouter()
  const handleSignUp = async (data: AuthFormData) => {
    const { data: signUpResponse, error } = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    })
    console.log("signUpResponse", signUpResponse, "error", error)

    if(!error) {
      router.push("/")
    }
  }

  return <AuthForm mode="signup" onSubmit={handleSignUp} />
}

export default SignUpPage
