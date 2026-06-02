// Helper hook for site-config drill-down pages.
// Each Global page calls useSiteConfigForm() and gets:
//   - data, dirty, saving, saved, set, setAll, save
// The save() function PUTs the entire siteConfig document to /api/v1/site-config
// (the backend supports partial updates and merges automatically).

import { useEffect } from "react";
import { siteConfigApi } from "./api";
import { useFormState } from "../Components/UI/FormPrimitives";

export function useSiteConfigForm(initial, { section } = {}) {
  const ctl = useFormState(initial, {
    onSave: async (data) => {
      // Send only the relevant section + the full doc
      const payload = section ? { [section]: data } : data;
      await siteConfigApi.update(payload);
    },
  });

  useEffect(() => {
    siteConfigApi.get()
      .then((cfg) => {
        if (!cfg || typeof cfg !== "object") return;
        const slice = section && cfg[section] ? cfg[section] : cfg;
        ctl.setAll({ ...initial, ...slice });
      })
      .catch(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ctl;
}
