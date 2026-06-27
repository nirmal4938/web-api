export const tenantMiddleware = (req, res, next) => {
  try {
    const host = req.headers.host || "";

    // Remove port (localhost:5000 → localhost)
    const cleanHost = host.split(":")[0];

    const parts = cleanHost.split(".");

    let subdomain = null;

    // CASE 1: root domain (syncware.fun)
    if (parts.length === 2) {
      subdomain = "syncware";
    }

    // CASE 2: subdomain (mobile.syncware.fun)
    if (parts.length >= 3) {
      subdomain = parts[0];
    }

    const isCore = subdomain === "syncware";

    req.tenant = {
      host: cleanHost,
      subdomain,
      isCore,
      tenantType: isCore ? "core" : "business",
      apiTarget: isCore ? "core" : `api.${subdomain}.syncware.fun`,
    };

    next();
  } catch (err) {
    console.error("Tenant middleware error:", err);

    req.tenant = {
      subdomain: null,
      isCore: true,
      tenantType: "core",
      apiTarget: "core",
    };

    next();
  }
};
