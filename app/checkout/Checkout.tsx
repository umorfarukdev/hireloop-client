"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Logo } from "@/components/site/logo"
import { cn } from "cn"

/* ------------------------------------------------------------------ */
/* Checkout (Figma "Public / Checkout — Stripe Payment"): order        */
/* summary with currency switch + payment form + Pay button.           */
/* The Pay / Express buttons are placeholders until Stripe Checkout    */
/* is integrated.                                                      */
/* ------------------------------------------------------------------ */

const CURRENCIES = [
  { code: "BDT", flag: "🇧🇩", price: "BDT 2,553.33" },
  { code: "USD", flag: "🇺🇸", price: "$20.00" },
] as const

const COUNTRIES = [
  "Bangladesh",
  "United States",
  "India",
  "Pakistan",
  "United Kingdom",
  "Canada",
  "Germany",
  "Australia",
]

const CARD_BRANDS = ["Visa", "Mastercard", "Amex", "Discover"]

/** "4242424242424242" → "4242 4242 4242 4242" */
const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")

const BrandPill = ({ brand }: { brand: string }) => (
  <span className="rounded border bg-muted/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
    {brand}
  </span>
)

const Checkout = () => {
  const [currency, setCurrency] = useState<string>("BDT")
  const [email, setEmail] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardholder, setCardholder] = useState("")
  const [country, setCountry] = useState("Bangladesh")
  const [saveInfo, setSaveInfo] = useState(true)

  const active =
    CURRENCIES.find((item) => item.code === currency) ?? CURRENCIES[0]
  const cardLast4 = cardNumber.replace(/\D/g, "").slice(-4) || "4242"

  // TODO: create a Stripe Checkout session server-side and redirect
  // the browser to it (stripe.redirectToCheckout / session.url).
  const handlePay = () => {}

  // TODO: same Stripe flow for the express option.
  const handleExpressCheckout = () => {}

  return (
    <div className="min-h-svh bg-muted/30">
      {/* ---------------- Header ---------------- */}
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Back to home"
              nativeButton={false}
              render={<Link href="/" />}
            >
              <ArrowLeftIcon aria-hidden="true" />
            </Button>
            <Logo />
          </div>
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            SANDBOX
          </span>
        </div>
      </header>

      {/* ---------------- Layout ---------------- */}
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-2">
        {/* ---------------- Left: order summary ---------------- */}
        <section className="h-fit space-y-4 rounded-xl border bg-card p-5">
          <p className="text-sm font-semibold">CHOOSE A CURRENCY:</p>

          <div className="grid grid-cols-2 gap-3">
            {CURRENCIES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setCurrency(item.code)}
                aria-pressed={currency === item.code}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                  currency === item.code
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-muted-foreground/40"
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span aria-hidden="true">{item.flag}</span>
                  {item.code}
                </span>
                <span className="text-lg font-semibold tracking-tight">
                  {item.price}
                </span>
              </button>
            ))}
          </div>

          <p className="text-xs italic text-muted-foreground">
            1 USD = 127.6665 BDT
          </p>

          <div className="border-t pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">Hireloop Pro Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Access to all features
                </p>
              </div>
              <span className="font-semibold">{active.price}</span>
            </div>
          </div>
        </section>

        {/* ---------------- Right: payment form ---------------- */}
        <section className="space-y-4">
          {/* Express checkout */}
          <Button
            type="button"
            onClick={handleExpressCheckout}
            className="h-11 w-full gap-2 bg-black font-semibold text-white hover:bg-black/90"
          >
            <span className="text-lg font-bold italic tracking-tight">
              link
            </span>
            <span className="text-sm font-medium">Express Checkout</span>
          </Button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              or pay with card
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Card preview */}
          <div className="flex items-center justify-between rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-bold italic">
                VISA
              </span>
              <span className="font-mono text-sm tracking-widest">
                •••• {cardLast4}
              </span>
            </div>
            <span className="text-xs text-slate-300">
              {expiry || "MM / YY"}
            </span>
          </div>

          {/* Contact information */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold">Contact information</h4>
            <Label htmlFor="checkout-email" className="text-xs text-muted-foreground">
              Email
            </Label>
            <Input
              id="checkout-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {/* Payment method */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold">Payment method</h4>

            <div className="rounded-lg border">
              {/* Selected method */}
              <div className="flex items-center gap-3 border-b px-4 py-3">
                <span
                  aria-hidden="true"
                  className="flex size-4 items-center justify-center rounded-full border-2 border-primary"
                >
                  <span className="size-2 rounded-full bg-primary" />
                </span>
                <span className="text-sm font-medium">Card</span>
                <span className="ml-auto flex gap-1.5">
                  {CARD_BRANDS.slice(0, 2).map((brand) => (
                    <BrandPill key={brand} brand={brand} />
                  ))}
                </span>
              </div>

              <div className="space-y-4 p-4">
                {/* Card information */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                    CARD INFORMATION
                  </span>
                  <div className="relative">
                    <Input
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 1234 1234 1234"
                      value={cardNumber}
                      onChange={(event) =>
                        setCardNumber(formatCardNumber(event.target.value))
                      }
                      className="pr-28"
                      aria-label="Card number"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 gap-1">
                      {CARD_BRANDS.map((brand) => (
                        <BrandPill key={brand} brand={brand} />
                      ))}
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <Input
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM / YY"
                      maxLength={5}
                      value={expiry}
                      onChange={(event) => setExpiry(event.target.value)}
                      className="rounded-r-none border-r-0"
                      aria-label="Expiry date"
                    />
                    <Input
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="CVC"
                      maxLength={4}
                      value={cvc}
                      onChange={(event) => setCvc(event.target.value)}
                      className="rounded-l-none"
                      aria-label="Security code"
                    />
                  </div>
                </div>

                {/* Cardholder name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="checkout-name"
                    className="text-xs font-semibold tracking-wide text-muted-foreground"
                  >
                    CARDHOLDER NAME
                  </Label>
                  <Input
                    id="checkout-name"
                    autoComplete="cc-name"
                    placeholder="Full name on card"
                    value={cardholder}
                    onChange={(event) => setCardholder(event.target.value)}
                  />
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                    COUNTRY OR REGION
                  </span>
                  <Select
                    value={country}
                    onValueChange={(value) => setCountry(value ?? "Bangladesh")}
                  >
                    <SelectTrigger className="w-full" aria-label="Country or region">
                      {country}
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Save info */}
                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(event) => setSaveInfo(event.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-medium">
                      Save my information for faster checkout
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Pay securely on this site and everywhere Link is
                      accepted.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Pay button */}
          <Button
            type="button"
            onClick={handlePay}
            className="h-12 w-full text-base font-semibold"
          >
            Pay {active.price}
          </Button>

          {/* Footer */}
          <div className="flex items-center justify-center gap-3 pb-4 text-xs text-muted-foreground">
            <span>
              Powered by <span className="font-semibold">Stripe</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="cursor-pointer hover:text-foreground">
              Terms
            </span>
            <span aria-hidden="true">·</span>
            <span className="cursor-pointer hover:text-foreground">
              Privacy
            </span>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Checkout
