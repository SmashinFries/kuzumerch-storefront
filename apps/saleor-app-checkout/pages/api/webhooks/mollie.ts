import { createDebug } from "./../../../utils/debug";
import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import { verifyPayment } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { updateOrCreateTransaction } from "@/saleor-app-checkout/backend/payments/updateOrCreateTransaction";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";
import invariant from "ts-invariant";

const debug = createDebug("api/webhooks/mollie");

/**
  Webhooks endpoint for mollie payment gateway.
  It's called after any change in the payment (paid, expired, failed, refunded, etc.)
  https://docs.mollie.com/overview/webhooks
*/
async function handler(req: NextApiRequest, res: NextApiResponse) {
  debug("Received event");
  const domain = req.query.domain;

  if (!domain) {
    debug("Can't return settings - missing domain");
    res.status(400).json({ error: "Missing domain query" });
    return;
  }
  if ("id" in req.body) {
    const { id } = req.body;
    invariant(typeof id === "string", "id must be a string");
    const [paymentError, paymentData] = await unpackPromise(verifyPayment(id));

    if (paymentError) {
      debug("Payment error: %O", paymentError);
      console.error("Error while validating payment", { paymentError });
      res.status(500).json({ error: "error while validating payment" });
      return;
    }

    debug("No payment errors");
    // Save transaction id from mollie in Saleor
    // Check if transaction was already created in Saleor
    // If status of that transaction changed, update transaction in Saleor

    if (paymentData) {
      debug("Updating transaction based on payment data");
      await updateOrCreateTransaction(paymentData.id, paymentData, domain as string);
      debug("Updated");
      res.status(200).send("ok");
      return;
    }
  }
  debug("Invalid event body");
  res.status(400).json({ error: "invalid request body" });
}

export default withSentry(handler);
