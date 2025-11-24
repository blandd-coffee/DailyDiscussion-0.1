const requestOnly = (req, res, next) => {
  const wantsHTML =
    req.headers.accept && req.headers.accept.includes("text/html");
  console.log("attempted access");
  if (wantsHTML) return res.redirect("/");
};

export default requestOnly;
