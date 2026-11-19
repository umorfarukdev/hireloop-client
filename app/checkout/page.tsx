import { Logo } from "@/components/site/logo";
import CheckoutForm from "./checkout-form";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Logo />
          <span className="text-xs font-bold text-amber-600">
            SANDBOX
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {canceled === "true" && (
          <p className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700">
            Payment canceled. Please try again.
          </p>
        )}

        <CheckoutForm />
      </main>
    </div>
  );
}