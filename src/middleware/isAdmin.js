import db from "../config/db.js";
import path from "path";

export function CreateAdminAuth(__dirname) {
  const isAdmin = async (req, res, next) => {
    console.log("test");
    try {
      const [users] = await db.query(
        "SELECT * FROM users WHERE msal_id = ? AND admin = true",
        [req.session.profile.id]
      );
      if (users[0] == null) return next();
      return res.sendFile(path.join(__dirname, "private/admin.html"));
    } catch (e) {
      console.error("", e);
    }
  };

  return isAdmin;
}
