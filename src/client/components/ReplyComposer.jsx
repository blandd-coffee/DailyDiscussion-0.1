import React, { useState, useRef, useEffect } from "react";
import { usePostResponse } from "../hooks/useApi";

export const ReplyComposer = ({ discussionId, onReplyPosted }) => {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);
  const { postResponse, loading: isSubmitting, error } = usePostResponse();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [content]);

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);
    setIsExpanded(value.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await postResponse(discussionId, content.trim());
      setContent("");
      setIsExpanded(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      onReplyPosted?.();
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`reply-wrap mt-auto ${isExpanded ? "is-expanded" : ""}`}
    >
      <div className="d-flex flex-column gap-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          className="form-control bg-transparent text-white border-secondary"
          rows="1"
          placeholder="Write a reply…"
          aria-label="Reply to discussion"
        />
        <div className="d-flex justify-content-end gap-2 align-items-center">
          <small
            className={`text-secondary ${content.length === 0 ? "d-none" : ""}`}
          >
            {content.length} characters
          </small>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className={`btn btn-primary btn-sm ${
              content.length === 0 ? "d-none" : ""
            }`}
          >
            {isSubmitting ? "Posting..." : "Reply"}
          </button>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger mt-2 py-1 px-2">{error}</div>
      )}
    </form>
  );
};
