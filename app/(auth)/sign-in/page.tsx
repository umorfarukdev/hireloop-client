"use client"

import { AuthForm } from "@/components/site/auth-form"
import { AuthFormData } from "@/type/type"
import { signIn } from "@/lib/auth-client"


const SignInPage = () => {

    const handleSignIn = async (data: AuthFormData) => {
      const { data: signInResponse, error } = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/",
      })
      console.log("signInResponse", signInResponse, "error", error)
    }
  
  return <AuthForm mode="signin" onSubmit={handleSignIn} />
}

export default SignInPage
