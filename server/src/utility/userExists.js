import db from "../config/db.js";

export const userExists = async (id, gmail, name) => {
  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? AND disabled = false",
      [gmail]
    );
    console.log(users);
    if (!users[0]) {
      const [response] = await db.execute(
        "INSERT INTO users (msal_id, name, username, email) VALUES (?, ?, ?, ?)",
        [id, name, null, gmail]
      );
      console.log("A new user has been made!");
    } else return;
  } catch (e) {
    console.error("", e);
  }
};
