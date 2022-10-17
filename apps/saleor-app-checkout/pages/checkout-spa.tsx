import Dynamic from "next/dynamic";
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
  console.log("SIEMA");

  const checkoutApiUrl = envVars.checkoutApiUrl;
  const checkoutAppUrl = envVars.checkoutAppUrl;

  if (!checkoutApiUrl) {
    console.warn(`Missing NEXT_PUBLIC_CHECKOUT_APP_URL env variable`);
    return null;
  }
  if (!checkoutAppUrl) {
    console.warn(`Missing NEXT_PUBLIC_CHECKOUT_APP_URL env variable`);
    return null;
  }

  return <CheckoutStoreFront env={{ checkoutApiUrl, checkoutAppUrl }} />;
}
