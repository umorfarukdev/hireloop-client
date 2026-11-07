"use client"

import { signUp } from "@/lib/auth-client"
import type { AuthFormData } from "@/type/type"

import { AuthForm } from "@/components/site/auth-form"

// Client component so we can call better-auth from the browser.
// The page's role is just wiring: page metadata lives in layout.tsx
// because "use client" pages cannot export "metadata".
const SignUpPage = () => {
  const handleSignUp = async (data: AuthFormData) => {
    const { data: signUpResponse, error } = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/",
    })
    console.log("signUpResponse", signUpResponse, "error", error)
    // Returning the shape lets AuthForm display `error.message` inline.
    return error ? { error } : undefined
  }

  return <AuthForm mode="signup" onSubmit={handleSignUp} />
}

export default SignUpPage
