"use client";

import { useEffect } from "react";

const COOLDOWN_PERIOD = 5 * 60 * 1000;

export function CatalogPrefetch() {
  useEffect(() => {
    const checkAndFetchCatalog = async () => {
      try {
        const lastCheck = localStorage.getItem("catalog:lastCheck");
        const now = Date.now();

        if (lastCheck && now - parseInt(lastCheck) < COOLDOWN_PERIOD) {
          console.log("⏭️ Skipping check (cooldown)");
          return;
        }

        localStorage.setItem("catalog:lastCheck", now.toString());

        const localChecksum = localStorage.getItem("catalog:checksum") || "";
        const checksumRes = await fetch("/api/catalog/checksum");
        const { checksum: serverChecksum } = await checksumRes.json();

        if (localChecksum === serverChecksum) {
          console.log("✅ Catalog up to date");
          return;
        }

        console.log("🔄 Fetching catalog...");
        const catalogRes = await fetch("/api/catalog");
        const catalogData = await catalogRes.json();

        localStorage.setItem("catalog:data", JSON.stringify(catalogData.data));
        localStorage.setItem("catalog:checksum", catalogData.checksum);

        // ✅ Trigger custom event for same-tab updates
        window.dispatchEvent(new Event("catalog-updated"));

        console.log("✅ Catalog updated!");
      } catch (error) {
        console.error("❌ Error:", error);
      }
    };

    checkAndFetchCatalog();
  }, []);

  return null;
}
