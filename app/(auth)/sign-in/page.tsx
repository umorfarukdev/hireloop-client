"use client"

import { AuthForm } from "@/components/site/auth-form"
import { AuthFormData } from "@/type/type"
import { signIn } from "@/lib/auth-client"
import { useSearchParams } from "next/navigation"


const SignInPage = () => {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? "/"

  console.log("redirect to:", redirectTo);

    const handleSignIn = async (data: AuthFormData) => {
      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: redirectTo,
      })
      // Surface better-auth errors inline (AuthForm's `{ error }` contract).
      return { error }
    }
  
  return <AuthForm mode="signin" onSubmit={handleSignIn} />
}

export default SignInPage
