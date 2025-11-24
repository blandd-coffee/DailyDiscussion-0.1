import db from "../config/db.js";

/** Gets a single user by ID */
const getUsersByID = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      id,
    ]);
    if (users.length === 0)
      return res.status(404).json({ error: "user not found" });
    res.json(users[0]);
  } catch (error) {
    console.error(`Database error fetching user ${req.params.id}`);
    res.status(500).json({ error: "Database error" });
  }
};

/**
 * Gets all users (excluding disabled users)
 * @returns
 */
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE disabled = false"
    );
    if (users.length === 0)
      return res.status(200).json({ error: "No users found" });
    res.json(users);
  } catch (error) {
    console.error("Database error fetching all users", error);
    res.status(500).json({ error: "Database error" });
  }
};

/**
 * Gets a single user by name value (NOT USERNAME)
 * @param {String} name
 * @returns
 */
const getUserByName = async (req, res) => {
  try {
    const { name } = req.query;
    const [users] = await db.query("SELECT * FROM users WHERE name = ?", [
      name,
    ]);
    if (users.length === 0)
      return res.status(404).json({ error: `User ${name} not found` });
    res.json(users[0]);
  } catch (error) {
    console.error(`Database error fetching user ${req.body.name}`, error);
    res.status(500).json({ error: "Database error" });
  }
};

const getCurrentUser = async (req, res) => {
  console.log("attempting to get current user");
  try {
    if (!req.session || !req.session.profile.id)
      return res.status(404).json({ error: "Unable to find user" });
    console.log(req.session.profile.id);
    const [users] = await db.query("SELECT * FROM users WHERE msal_id = ?", [
      req.session.profile.id,
    ]);
    if (!users[0])
      return res.status(404).json({ error: "Unable to find current user(?)" });
    res.json(users[0]);
  } catch (e) {
    console, error("", e);
  }
};

/**
 * Deletes a user by ID
 * @param {Number} id
 */
const disableUser = async (req, res) => {
  try {
    const { id } = req.body;
    const [result] = await db.query(
      "UPDATE users SET disabled = true WHERE user_id = ?",
      [id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });
    res.status(500).json({ message: "User successfully disabled" });
  } catch (error) {
    console.error(`Error deleting user ${req.body.id}`, error);
    res.status(500).json({ error: "Database error" });
  }
};

export default {
  getUsersByID,
  getUserByName,
  getAllUsers,
  getCurrentUser,
  disableUser,
};
