import { createClient } from "urql";

interface ClientParams {
  saleorApiUrl: string;
  appToken: string;
}

export const getClientForAuthData = ({ saleorApiUrl, appToken }: ClientParams) => {
  return createClient({
    url: saleorApiUrl,
    requestPolicy: "network-only", // On SSR, Vercel uses client cache in consecutive requests, so we need network-only to always return fresh data from Saleor
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    },
  });
};
