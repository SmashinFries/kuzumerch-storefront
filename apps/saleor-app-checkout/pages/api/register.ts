import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import * as Apl from "@/saleor-app-checkout/config/apl";

import { saleorDomainHeader } from "../../constants";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  // @todo: Allow restricting only to specific domains

  const saleorApiHost = request.headers[saleorDomainHeader];
  if (!saleorApiHost || typeof saleorApiHost !== "string") {
    console.error("Missing saleor domain token.");
    response.status(400).json({ success: false, message: `Missing ${saleorDomainHeader} header.` });
    return;
  }

  const authToken = request.body?.auth_token as string;
  if (!authToken) {
    console.error(`Missing auth token`);
    response.status(400).json({ success: false, message: "Missing auth token." });
    return;
  }

  try {
    await Apl.set({ saleorApiHost, authToken });
  } catch (error) {
    console.log("Error thrown during saving the auth data: %O", error);
    response.status(500).json({ success: false, message: "Unable to save registration data" });
    return;
  }

  response.status(200).json({ success: true });
};

export default withSentry(handler);
