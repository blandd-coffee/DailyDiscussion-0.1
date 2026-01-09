import db from "../config/db.js";
import logger from "../utility/logger.js";

/** Retrieves scheduled discussions for today */
const getScheduledDiscusion = async (req, res) => {
  try {
    const [discussions] = await db.query(
      "SELECT * FROM discussions WHERE active_date = CURDATE()"
    );
    if (discussions.length === 0)
      return res
        .status(404)
        .json({ error: "No scheduled discussions available!" });
    logger.info("Scheduled discussions fetched successfully");
    const normalized = discussions.map((d) => ({
      id: d.discussion_id ?? d.id ?? null,
      title: d.title,
      content: d.content,
      activeDate: d.active_date ?? d.activeDate ?? null,
    }));
    res.status(200).json(normalized);
  } catch (error) {
    logger.error("Error getting scheduled discussions", error);
    res.status(500).json({ error: "Database error: Discussions" });
  }
};

/**
 * Retrieves unscheduled discussions.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getUnscheduledDiscussions = async (req, res) => {
  try {
    const [discussions] = await db.query(
      "SELECT * FROM discussions WHERE active_date IS NULL"
    );
    if (discussions.length === 0)
      return res.status(200).json({ error: "No unscheduled discussions!" });
    logger.info("Unscheduled discussions fetched successfully");
    const normalized = discussions.map((d) => ({
      id: d.discussion_id ?? d.id ?? null,
      title: d.title,
      content: d.content,
      activeDate: d.active_date ?? d.activeDate ?? null,
    }));
    res.json(normalized);
  } catch (error) {
    logger.error("Error getting unscheduled discussions", error);
    res.status(500).json({ error: "Database error: Discussions" });
  }
};

/**
 * Retrieves a discussion by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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
    logger.info(`Discussion with ID ${id} fetched successfully`);
    const d = discussion[0];
    res.json({
      id: d.discussion_id ?? d.id ?? null,
      title: d.title,
      content: d.content,
      activeDate: d.active_date ?? d.activeDate ?? null,
    });
  } catch (error) {
    logger.error("Error getting discussion by ID", error);
    res.status(500).json({ error: "Database error: Discussions" });
  }
};

/**
 * Retrieves all scheduled discussions.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAllScheduledDiscussions = async (req, res) => {
  try {
    const [discussions] = await db.query(
      "SELECT * FROM discussions WHERE active_date >= CURDATE() ORDER BY active_date ASC"
    );
    logger.info("All scheduled discussions fetched successfully");
    const normalized = discussions.map((d) => ({
      id: d.discussion_id ?? d.id ?? null,
      title: d.title,
      content: d.content,
      activeDate: d.active_date ?? d.activeDate ?? null,
    }));
    res.status(200).json(normalized);
  } catch (error) {
    logger.error("Error getting all scheduled discussions", error);
    res.status(500).json({ error: "Database error: Discussions" });
  }
};

/**
 * Creates a new discussion.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const postDiscussion = async (req, res) => {
  const { title, content, active } = req.body;
  try {
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
    logger.info("New discussion created successfully");
    res.status(200).json({ message: "New discussion created successfully" });
  } catch (error) {
    logger.error("Error creating discussion", error);
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
