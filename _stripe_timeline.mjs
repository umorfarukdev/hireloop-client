import { config } from "dotenv"
config({ path: ".env" })
import Stripe from "stripe"
const s = new Stripe(process.env.STRIPE_SECRET_KEY)

const ses = await s.checkout.sessions.list({ limit: 20 })
console.log("SESSION TIMELINE (UTC):")
ses.data
  .slice()
  .sort((a, b) => a.created - b.created)
  .forEach((x) => {
    console.log(
      " ",
      new Date(x.created * 1000).toISOString().slice(11, 19),
      x.status + "/" + x.payment_status,
      x.id.slice(0, 26),
      "pm:",
      x.payment_method_types.join(","),
      "pi:",
      typeof x.payment_intent === "string" ? x.payment_intent.slice(0, 20) : x.payment_intent?.id?.slice(0, 20) ?? "none"
    )
  })

// detail on the paid one
const paid = ses.data.find((x) => x.payment_status === "paid")
if (paid) {
  const full = await s.checkout.sessions.retrieve(paid.id, { expand: ["payment_intent", "payment_intent.latest_charge"] })
  console.log("\nPAID SESSION:", paid.id)
  console.log("  success_url:", full.success_url)
  console.log("  customer_email:", full.customer_details?.email)
  const pi = full.payment_intent
  console.log("  PI status:", pi.status, "| charge paid:", pi.latest_charge?.paid)
}
