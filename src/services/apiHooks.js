// ─── Tiny hook layer on top of the apiClient ─────────────────────────────
// Use these from any page that needs to fetch / mutate data.
//
//   const { data, loading, error, refetch } = useApi(ENDPOINTS.services.public);
//   const { execute: saveService, loading: saving } = useApiMutation(...);

import { useCallback, useEffect, useRef, useState } from "react";
import { api, call } from "./apiClient";

// GET hook — fires once on mount (and whenever `deps` change)
export function useApi(endpoint, options = {}) {
  const { deps = [], enabled = true, transform } = options || {};
  const [data, setData]     = useState(options.initialData ?? null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError]   = useState(null);
  const mounted = useRef(true);

  const fetcher = useCallback(async () => {
    if (!endpoint) return;
    setLoading(true);
    setError(null);
    try {
      const result = await call(api.get(endpoint));
      if (!mounted.current) return;
      setData(transform ? transform(result) : result);
    } catch (e) {
      if (!mounted.current) return;
      setError(e);
      // Keep previous data on error so UI doesn't blank out
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, ...deps]);

  useEffect(() => {
    mounted.current = true;
    if (enabled) fetcher();
    return () => { mounted.current = false; };
  }, [fetcher, enabled]);

  return { data, loading, error, refetch: fetcher, setData };
}

// POST/PUT/DELETE hook — returns an `execute` function.
export function useApiMutation(method = "post") {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (endpoint, body, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await call(api.request({ method, url: endpoint, data: body, ...config }));
      return result;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [method]);

  return { execute, loading, error };
}
