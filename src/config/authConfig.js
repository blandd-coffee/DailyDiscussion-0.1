import "dotenv/config";

export const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${
      process.env.AZURE_TENANT_ID || ""
    }`,
    clientSecret: process.env.AZURE_CLIENT_SECRET || "",
  },
  system: { loggerOptions: { loggerCallback() {} } },
};

export const authParams = {
  // Default redirect URI should point to the auth callback route
  redirectUri:
    process.env.REDIRECT_URI ||
    (process.env.HOST_ORIGIN || "http://localhost:8080") + "/auth/redirect",
  scopes: (process.env.SCOPES || "").split(" ").filter(Boolean),
};
