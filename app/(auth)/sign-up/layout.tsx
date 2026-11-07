import type { Metadata } from "next"

// Sign-up is a Client Component, and Next.js forbids exporting "metadata"
// from client files. The route group's layout restores the page metadata.
export const metadata: Metadata = {
  title: "Sign Up — Hireloop",
  description: "Create your Hireloop account and land your next role faster.",
}

const SignUpLayout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default SignUpLayout
