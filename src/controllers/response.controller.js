import db from "../config/db.js";
import logger from "../utility/logger.js";

/** Retrieves responses for today's scheduled discussion */
const getResponses = async (req, res) => {
  try {
    const [discussion] = await db.query(
      "SELECT * FROM discussions WHERE active_date = CURDATE()"
    );
    if (discussion.length === 0)
      return res
        .status(404)
        .json({ error: "Unable to find scheduled discussion" });

    const [responses] = await db.query(
      "SELECT * FROM responses WHERE discussion_id = ?",
      [discussion[0].discussion_id]
    );
    if (responses.length === 0)
      return res.status(404).json({ error: "No responses found" });

    // Normalize DB rows to client-friendly shape
    const normalized = responses.map((r) => ({
      id: r.response_id ?? r.id ?? null,
      content: r.content,
      createdAt: r.created_at ?? r.createdAt ?? null,
      author: r.author || r.name || r.username || null,
      author_id: r.author_id ?? r.authorId ?? null,
      parent_id:
        r.parent_response_id ?? r.parent_response ?? r.parent_id ?? null,
      discussion_id: r.discussion_id ?? r.discussionId ?? null,
    }));

    logger.info("Responses fetched successfully");
    res.json(normalized);
  } catch (error) {
    logger.error("Error fetching responses", error);
    res.status(500).json({ error: "Database error" });
  }
};
const getReplies = async (req, res) => {
  // Support both route parameter and body parameter for flexibility
  const discussion_id = req.params.id || req.body.discussion_id;

  if (!discussion_id) {
    return res.status(400).json({ error: "Missing discussion_id" });
  }

  try {
    const [replies] = await db.query(
      "SELECT * FROM responses WHERE discussion_id = ?",
      [discussion_id]
    );
    if (replies.length === 0)
      return res.status(404).json({ error: "No replies found" });

    const normalized = replies.map((r) => ({
      id: r.response_id ?? r.id ?? null,
      content: r.content,
      createdAt: r.created_at ?? r.createdAt ?? null,
      author: r.author || r.name || r.username || null,
      author_id: r.author_id ?? r.authorId ?? null,
      parent_id:
        r.parent_response_id ?? r.parent_response ?? r.parent_id ?? null,
      discussion_id: r.discussion_id ?? r.discussionId ?? null,
    }));

    res.json(normalized);
  } catch (error) {
    console.error("Error fetching responses", error);
    res.status(500).json({ error: "Database error" });
  }
};
const getResponsesByUser = async (req, res) => {
  const { user_id, discussion_id } = req.body;
  try {
    const [responses] = await db.query(
      "SELECT * FROM responses WHERE author_id = ? and discussion_id = ?",
      [user_id, discussion_id]
    );
    if (responses.length === 0)
      return res
        .status(404)
        .json({ error: `No responses from user ${user_id}` });

    const normalized = responses.map((r) => ({
      id: r.response_id ?? r.id ?? null,
      content: r.content,
      createdAt: r.created_at ?? r.createdAt ?? null,
      author: r.author || r.name || r.username || null,
      author_id: r.author_id ?? r.authorId ?? null,
      parent_id:
        r.parent_response_id ?? r.parent_response ?? r.parent_id ?? null,
      discussion_id: r.discussion_id ?? r.discussionId ?? null,
    }));

    res.json(normalized);
  } catch (error) {
    console.error("Error fetching responses", error);
    res.status(500).json({ error: "Database error" });
  }
};
const getAllResponsesByUser = async (req, res) => {
  const { user_id } = req.body;
  try {
    const [responses] = await db.query(
      "SELECT * FROM responses WHERE author_id = ?",
      [user_id]
    );
    if (responses.length === 0)
      return res
        .status(404)
        .json({ error: `No responses from user ${user_id}` });

    const normalized = responses.map((r) => ({
      id: r.response_id ?? r.id ?? null,
      content: r.content,
      createdAt: r.created_at ?? r.createdAt ?? null,
      author: r.author || r.name || r.username || null,
      author_id: r.author_id ?? r.authorId ?? null,
      parent_id:
        r.parent_response_id ?? r.parent_response ?? r.parent_id ?? null,
      discussion_id: r.discussion_id ?? r.discussionId ?? null,
    }));

    res.json(normalized);
  } catch (error) {
    console.error("Error fetching responses", error);
    res.status(500).json({ error: "Database error" });
  }
};
const postNewResponse = async (req, res) => {
  const { author_id, discussion_id, content } = req.body ?? {};
  if (author_id === null || discussion_id === null || content === null)
    return res.status(400).json({ error: "Missing paramaters" });
  try {
    const [results] = await db.execute(
      "INSERT INTO responses (author_id, discussion_id, content) VALUES (?, ?, ?)",
      [author_id, discussion_id, content]
    );
    if (results.affectedRows === 0)
      return res.status(400).json({ error: "Unable to respond" });
    res.json(results.affectedRows);
  } catch (error) {
    console.error("Error fetching responses", error);
    res.status(500).json({ error: "Database error" });
  }
};
const postNewReply = async (req, res) => {
  const { author_id, parent_id, discussion_id, content } = req.body ?? {};
  if (author_id === null || discussion_id === null || content === null)
    return res.status(400).json({ error: "Missing paramaters" });
  try {
    const [results] = await db.execute(
      "INSERT INTO responses (author_id, parent_response_id, discussion_id, content) VALUES (?, ?, ?, ?)",
      [author_id, parent_id, discussion_id, content]
    );
    if (results.affectedRows === 0)
      return res.status(400).json({ error: "Unable to resply" });
    res.json(results.affectedRows);
  } catch (error) {
    console.error("Error posting responses", error);
    res.status(500).json({ error: "Database error" });
  }
};

const updateReactions = async (req, res) => {};

export default {
  getResponses,
  getReplies,
  getResponsesByUser,
  getAllResponsesByUser,
  postNewResponse,
  postNewReply,
};
