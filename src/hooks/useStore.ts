import { useState, useEffect } from "react";
import { store, subscribeStore } from "../store";

/** Drop-in hook: re-renders the component every time store state changes. */
export function useStore() {
  const [, tick] = useState(0);
  useEffect(() => {
    return subscribeStore(() => tick((n) => n + 1));
  }, []);
  return store.get();
}
