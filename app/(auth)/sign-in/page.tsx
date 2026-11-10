"use client"

import { AuthForm } from "@/components/site/auth-form"
import { AuthFormData } from "@/type/type"
import { signIn } from "@/lib/auth-client"


const SignInPage = () => {

    const handleSignIn = async (data: AuthFormData) => {
      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/",
      })
      // Surface better-auth errors inline (AuthForm's `{ error }` contract).
      return { error }
    }
  
  return <AuthForm mode="signin" onSubmit={handleSignIn} />
}

export default SignInPage
