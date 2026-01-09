import { ConfidentialClientApplication } from "@azure/msal-node";
import { msalConfig, authParams } from "../config/authConfig.js";
import axios from "axios";
import { userExists } from "../utility/userExists.js";
import logger from "../utility/logger.js";

let cca = null;

// Initialize CCA only if Azure credentials are provided
const initializeCCA = () => {
  if (!cca && msalConfig.auth.clientSecret) {
    cca = new ConfidentialClientApplication(msalConfig);
  }
  return cca;
};

/** Handles Microsoft OAuth login flow redirection */
const login = async (req, res, next) => {
  try {
    const ccaInstance = initializeCCA();
    if (!ccaInstance) {
      return res
        .status(501)
        .json({ error: "Azure authentication not configured" });
    }
    const url = await ccaInstance.getAuthCodeUrl({
      redirectUri: authParams.redirectUri,
      scopes: authParams.scopes,
      prompt: "select_account",
      state: req.query.state || "",
    });
    res.redirect(url);
  } catch (e) {
    logger.error("Login failed:", e);
    next(e);
  }
};

/**
 * Handles Microsoft OAuth callback and processes authentication.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const redirect = async (req, res, next) => {
  try {
    const ccaInstance = initializeCCA();
    if (!ccaInstance) {
      return res
        .status(501)
        .json({ error: "Azure authentication not configured" });
    }
    const token = await ccaInstance.acquireTokenByCode({
      redirectUri: authParams.redirectUri,
      code: req.query.code,
      scopes: authParams.scopes,
    });

    // persist minimal identity + token cache
    req.session.account = token.account;
    req.session.tokenCache = ccaInstance.getTokenCache().serialize();

    // optional: fetch profile once and cache
    const { accessToken } = token;
    const me = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    req.session.profile = {
      id: me.data.id,
      displayName: me.data.displayName,
      userPrincipalName: me.data.userPrincipalName,
    };
    userExists(me.data.id, me.data.userPrincipalName, me.data.displayName);

    logger.info("User authenticated successfully");
    res.redirect(req.query.state || "/");
  } catch (e) {
    logger.error("Authentication failed:", e);
    next(e);
  }
};

const me = async (req, res, next) => {
  try {
    if (!req.session.account)
      return res.status(401).json({ error: "not_authenticated" });

    const ccaInstance = initializeCCA();
    if (!ccaInstance) {
      return res
        .status(501)
        .json({ error: "Azure authentication not configured" });
    }

    // rehydrate cache so msal can refresh silently
    if (req.session.tokenCache)
      ccaInstance.getTokenCache().deserialize(req.session.tokenCache);

    const silent = await ccaInstance.acquireTokenSilent({
      account: req.session.account,
      scopes: ["User.Read"],
    });

    // keep cache fresh in session
    req.session.tokenCache = ccaInstance.getTokenCache().serialize();
    userExists(req.session.userPrincipalName, req.session.displayName);

    res.json({
      account: {
        homeAccountId: req.session.account.homeAccountId,
        username: req.session.account.username,
        name: req.session.profile?.displayName,
      },
      tokenExpiresOn: silent.expiresOn?.toISOString?.() || null,
    });
  } catch (e) {
    // token invalid -> clear session
    req.session.destroy(() =>
      res.status(401).json({ error: "not_authenticated" })
    );
  }
};

const logout = async (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};

export default {
  login,
  redirect,
  me,
  logout,
};
