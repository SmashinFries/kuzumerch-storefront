import PageHeader from "@/checkout-storefront/sections/PageHeader";
import { Summary } from "@/checkout-storefront/sections/Summary";
import { CheckoutForm } from "@/checkout-storefront/sections/CheckoutForm";
import { Suspense } from "react";
import { PageNotFound } from "@/checkout-storefront/sections/PageNotFound";
import { ErrorBoundary } from "react-error-boundary";
import { useCheckout } from "./hooks/useCheckout";
import { useAuthState } from "@saleor/sdk";
import { SummarySkeleton } from "./sections/Skeletons/SummarySkeleton";
import { CheckoutFormSkeleton } from "./sections/Skeletons/CheckoutFormSkeleton";

export const Checkout = () => {
  const { checkout, loading } = useCheckout();
  const { authenticating } = useAuthState();

  const isCheckoutInvalid = !loading && !checkout && !authenticating;

  return (
    <div>
      {isCheckoutInvalid ? (
        <PageNotFound />
      ) : (
        /* @ts-ignore React 17 <-> 18 type mismatch */
        <ErrorBoundary FallbackComponent={PageNotFound}>
          <div className="page">
            <PageHeader />
            <div className="page-content">
              <Suspense fallback={<CheckoutFormSkeleton />}>
                <CheckoutForm />
              </Suspense>
              <div className="page-divider" />
              <Suspense fallback={<SummarySkeleton />}>
                <Summary />
              </Suspense>
            </div>
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
};
