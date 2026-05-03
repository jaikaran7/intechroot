import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

/**
 * Zustand `persist` rehydrates after the first paint. Without waiting, guards read
 * `accessToken: null` and redirect to login even though the session exists in storage.
 */
export function useAuthHydration() {
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
      const r = useAuthStore.getState().role;
      if (r) localStorage.setItem("role", r);
    });
    if (!useAuthStore.persist.hasHydrated()) {
      void useAuthStore.persist.rehydrate();
    }
    return unsub;
  }, []);

  return hydrated;
}
