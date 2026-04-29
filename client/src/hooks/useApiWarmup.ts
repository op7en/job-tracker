import { useEffect, useState } from "react";
import { warmUpApi } from "../api/axios";

let warmedUp = false;
let warmupPromise: Promise<void> | null = null;

const requestApiWarmup = () => {
  if (warmedUp) return Promise.resolve();

  if (!warmupPromise) {
    warmupPromise = warmUpApi()
      .then(() => {
        warmedUp = true;
      })
      .finally(() => {
        warmupPromise = null;
      });
  }

  return warmupPromise;
};

export const useApiWarmup = () => {
  const [isWarmingUp, setIsWarmingUp] = useState(!warmedUp);
  const [warmupFailed, setWarmupFailed] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (warmedUp) {
      return;
    }

    requestApiWarmup()
      .then(() => {
        if (mounted) setWarmupFailed(false);
      })
      .catch(() => {
        if (mounted) setWarmupFailed(true);
      })
      .finally(() => {
        if (mounted) setIsWarmingUp(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { isWarmingUp, warmupFailed };
};
