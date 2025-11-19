import db from "../config/db.js";

const getScheduledDiscusion = async (req, res) => {
  try {
    const [discussions] = await db.query(
      "SELECT * FROM discussions WHERE active_date = CURDATE()"
    );
    if (discussions.length === 0)
      return res
        .status(404)
        .json({ error: "No scheduled discussions available!" });
    res.status(200).json(discussions);
  } catch (error) {
    console.error("Error getting scheduled discussions", error);
    res.status(500).json({ error: "Database error: Discussions" });
  }
};

const getUnscheduledDiscussions = async (req, res) => {
  try {
    const [discussions] = await db.query(
      "SELECT * FROM discussions WHERE active_date IS NULL"
    );
    if (discussions.length === 0)
      return res.status(200).json({ error: "No unscheduled discussions!" });
    res.json(discussions);
  } catch (error) {
    console.error("Error getting scheduled discussions", error);
    res.status(500).json({ error: "Database error: Discussions" });
  }
};

const getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [discussion] = await db.query(
      "SELECT * FROM discussions WHERE discussion_id = ?",
      [id]
    );
    if (discussion.length === 0)
      return res
        .status(404)
        .json({ error: `No discussion with ID ${id} found` });
    res.json(discussion[0]);
  } catch (error) {
    console.error("Error getting scheduled discussions", error);
    res.status(500).json({ error: "Database error: Discussions" });
  }
};

const getAllScheduledDiscussions = async (req, res) => {
  console.log("test1");
  try {
    const [discussions] = await db.query(
      "SELECT * FROM discussions WHERE active_date >= CURDATE() ORDER BY active_date ASC"
    );
    console.log(discussions);
    res.status(200).json(discussions);
  } catch (error) {
    console.error("Error getting all scheduled discussions", error);
    res.status(500).json({ error: "Database error: Discussions" });
  }
};

const postDiscussion = async (req, res) => {
  const { title, content, active } = req.body;
  try {
    console.log("yes");
    if (active === undefined)
      await db.query("INSERT INTO discussions (title, content) VALUES (?, ?)", [
        title,
        content,
      ]);
    else
      await db.query(
        "INSERT INTO discussions (title, content, active_date) VALUES (?, ?, ?)",
        [title, content, active]
      );
    res.status(200).json({ message: "New discussion created successfully" });
  } catch (error) {
    console.error("Error getting scheduled discussions", error);
    res.status(500).json({ error: "Database error: Discussions" });
  }
};
const updateDiscussion = async (req, res) => {
  console.log("updateDiscussion");
  const { id, title, content, active } = req.body ?? {};

  if (id == null) {
    return res.status(400).json({ error: "id is required" });
  }

  const set = [];
  const params = [];

  if (title !== undefined) {
    set.push("title = ?");
    params.push(title);
  }

  if (content !== undefined) {
    set.push("content = ?");
    params.push(content);
  }

  // allow updating / clearing active_date
  if (active !== undefined) {
    if (active === null || active === "") {
      // explicitly clear the date
      set.push("active_date = NULL");
    } else {
      set.push("active_date = ?");
      params.push(active);
    }
  }

  if (set.length === 0) {
    return res.status(400).json({ error: "no fields to update" });
  }

  params.push(id);

  try {
    const [results] = await db.execute(
      `UPDATE discussions SET ${set.join(", ")} WHERE discussion_id = ?`,
      params
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    res.json({ updated: results.affectedRows });
  } catch (error) {
    console.error("Error updating discussion", error);
    res.status(500).json({ error: "Database error: Discussions" });
  }
};

export default {
  getScheduledDiscusion,
  getUnscheduledDiscussions,
  getDiscussionById,
  getAllScheduledDiscussions,
  updateDiscussion,
  postDiscussion,
};
