import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 1023px)";

const subscribe = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia(MOBILE_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
};

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;

export const useIsMobile = () => {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
