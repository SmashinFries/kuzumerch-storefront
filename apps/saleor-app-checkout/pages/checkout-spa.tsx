import Dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { envVars } from "../constants";

const CheckoutStoreFront = Dynamic(
  async () => {
    const { Root } = await import("@saleor/checkout-storefront");
    return Root;
  },
  {
    ssr: false,
    loading: () => null,
  }
);

export default function CheckoutSpa() {
  const {
    query: { saleorApiHost },
  } = useRouter();
  const checkoutApiUrl = envVars.checkoutApiUrl;
  const checkoutAppUrl = envVars.checkoutAppUrl;

  if (!saleorApiHost || typeof saleorApiHost !== "string") {
    console.warn(`Missing saleorApiHost query param`);
    return null;
  }
  if (!checkoutApiUrl) {
    console.warn(`Missing NEXT_PUBLIC_CHECKOUT_APP_URL env variable`);
    return null;
  }
  if (!checkoutAppUrl) {
    console.warn(`Missing NEXT_PUBLIC_CHECKOUT_APP_URL env variable`);
    return null;
  }

  return (
    <CheckoutStoreFront
      env={{ apiUrl: `https://${saleorApiHost}/graphql/`, checkoutApiUrl, checkoutAppUrl }}
    />
  );
}
