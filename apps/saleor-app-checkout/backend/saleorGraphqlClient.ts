import { createClient } from "urql";

interface ClientParams {
  apiUrl: string;
  appToken: string;
}

export const getClientForAuthData = ({ apiUrl, appToken }: ClientParams) => {
  return createClient({
    url: apiUrl,
    requestPolicy: "network-only", // On SSR, Vercel uses client cache in consecutive requests, so we need network-only to always return fresh data from Saleor
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    },
  });
};
