import type { PresetQuery, RetrievalDoc } from "@/lib/types";
import { deepFreeze } from "./freeze";

/**
 * Twelve fixed documents for the support knowledge base.
 * Each text holds one topic in the present tense and stays under 220 characters.
 */
export const RETRIEVAL_DOCS: readonly RetrievalDoc[] = deepFreeze([
  {
    id: "doc-01",
    title: "Account recovery",
    tags: ["account", "sign-in", "security"],
    text: "Use the sign-in page to reset a password. A recovery code or a verified email opens the account. Support never asks for a password.",
  },
  {
    id: "doc-02",
    title: "Billing cycles",
    tags: ["billing", "invoice", "payments"],
    text: "Billing runs on a monthly cycle from the signup date. The billing policy sets the cycle and the invoice date. A failed charge retries after three days.",
  },
  {
    id: "doc-03",
    title: "Payment methods",
    tags: ["payments", "cards", "retries"],
    text: "The account stores one default card. A declined payment retries twice before the order pauses. Update the card from the billing page.",
  },
  {
    id: "doc-04",
    title: "Shipping options",
    tags: ["shipping", "tracking", "delivery"],
    text: "Standard shipping takes three to five working days. Express shipping takes one to two days. The tracking link appears on the order page.",
  },
  {
    id: "doc-05",
    title: "Late deliveries",
    tags: ["delivery", "delays", "support"],
    text: "A parcel counts as late after the delivery window closes. The order page shows the last tracking event. Open a support request when tracking stops for two days.",
  },
  {
    id: "doc-06",
    title: "Orders and changes",
    tags: ["orders", "changes", "support"],
    text: "An order accepts changes until the packing step starts. Address and item changes use the order page. A packed order needs a return instead.",
  },
  {
    id: "doc-07",
    title: "Refunds and returns",
    tags: ["refunds", "returns", "policy"],
    text: "Refunds are available within 30 days of delivery. The item must be unused and in the original packaging. Start a return from the order page.",
  },
  {
    id: "doc-08",
    title: "Return labels",
    tags: ["labels", "returns", "shipping"],
    text: "A return label is free for returns and exchanges. Print the label or show the code at a drop-off point. The label expires after 14 days.",
  },
  {
    id: "doc-09",
    title: "Plans and seats",
    tags: ["plans", "billing", "seats"],
    text: "A plan sets the seat count and the monthly price. Add a seat from the team page and the invoice adjusts at the next cycle. Removed seats stay active until the cycle ends.",
  },
  {
    id: "doc-10",
    title: "Customs and import fees",
    tags: ["customs", "fees", "shipping"],
    text: "Customs fees depend on the destination country. The carrier collects the fee before delivery. The order total does not include these fees.",
  },
  {
    id: "doc-11",
    title: "Warranty and repairs",
    tags: ["warranty", "repairs", "support"],
    text: "A warranty claim needs the order number and a photo of the fault. Repair takes up to ten working days. Support sends a prepaid label for the return.",
  },
  {
    id: "doc-12",
    title: "Contact and hours",
    tags: ["contact", "support", "hours"],
    text: "Support answers chat from 08:00 to 20:00 on working days. Email replies arrive within one working day. The help centre lists the phone line for urgent orders.",
  },
]);

/**
 * Three fixed queries with descending sample scores.
 * The explorer uses these scores; the lesson scorer is separate.
 */
export const PRESET_QUERIES: readonly PresetQuery[] = deepFreeze([
  {
    id: "q-refund",
    query: "refund policy",
    results: [
      { docId: "doc-07", score: 0.91 },
      { docId: "doc-08", score: 0.74 },
      { docId: "doc-02", score: 0.61 },
    ],
  },
  {
    id: "q-billing",
    query: "billing",
    results: [
      { docId: "doc-02", score: 0.88 },
      { docId: "doc-03", score: 0.79 },
      { docId: "doc-09", score: 0.63 },
    ],
  },
  {
    id: "q-late",
    query: "late delivery",
    results: [
      { docId: "doc-05", score: 0.92 },
      { docId: "doc-04", score: 0.70 },
      { docId: "doc-10", score: 0.55 },
    ],
  },
]);
