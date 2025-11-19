const requireAuth = (req, res, next) => {
  if (req.session && req.session.account) return next();
  const wantsHTML =
    req.headers.accept && req.headers.accept.includes("text/html");
  if (wantsHTML)
    return res.redirect(
      `/auth/login?state=${encodeURIComponent(req.originalUrl)}`
    );
  return res.status(401).json({ error: "not_authenticated" });
};

export default requireAuth;
