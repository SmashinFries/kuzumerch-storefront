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
  const router = useRouter()
  const domainFromUrl = router.query.domain
  const apiUrl = domainFromUrl ? `https://${router.query.domain}/graphql/` : envVars.apiUrl;
  const checkoutApiUrl = envVars.checkoutApiUrl;
  const checkoutAppUrl = envVars.checkoutAppUrl;

  if (!apiUrl) {
    console.warn(`Missing NEXT_PUBLIC_SALEOR_API_URL env variable`);
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

  return <CheckoutStoreFront env={{ apiUrl, checkoutApiUrl, checkoutAppUrl }} />;
}
