import { app } from "@/saleor-app-checkout/frontend/misc/app";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { handleRedirectEvent, handleRouteChange } from "./handlers";
import { AppBridge } from "@saleor/app-sdk/app-bridge";
import { domainClient } from "@/saleor-app-checkout/frontend/misc/client";
import { Provider as ClientProvider } from "urql";

interface IAppContext {
  app?: AppBridge;
  isAuthorized: boolean;
}

export const AppContext = createContext<IAppContext>({
  app: undefined,
  isAuthorized: false,
});

const AppProvider: React.FC<{ children: ReactNode }> = (props) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(!!app?.getState()?.token);

  const client = domainClient(`https://${app?.getState().domain}/graphql/`)

  useEffect(() => {
    if (app) {
      setIsAuthorized(!!app.getState().token);

      const unsubscribe = app.subscribe("handshake", (payload) => {
        setIsAuthorized(!!payload.token);
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    if (app) {
      const unsubscribe = app?.subscribe("redirect", ({ path }) => {
        handleRedirectEvent(router, path);
      });
      router.events.on("routeChangeComplete", handleRouteChange);

      return () => {
        unsubscribe();
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, []);

  return <ClientProvider value={client}><AppContext.Provider value={{ app, isAuthorized }} {...props} /></ClientProvider>;
};
export default AppProvider;
