import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDiscussions } from "../hooks/useAdminApi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const DiscussionsTab = () => {
  const { discussions, loading, error, refetch } = useDiscussions();
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSelectDiscussion = (discussion) => {
    setSelectedDiscussion(discussion);
    setFormData({
      title: discussion.title || "",
      content: discussion.content || "",
      date: discussion.date || new Date().toISOString().split("T")[0],
    });
  };

  const handleNewDiscussion = () => {
    setSelectedDiscussion(null);
    setFormData({
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDiscussion = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const endpoint = selectedDiscussion
        ? `${API_BASE_URL}/discussions/${selectedDiscussion.id}`
        : `${API_BASE_URL}/discussions`;
      const method = selectedDiscussion ? "put" : "post";

      await axios[method](endpoint, {
        title: formData.title,
        content: formData.content,
        date: formData.date,
      });

      await refetch();
      setSelectedDiscussion(null);
      setFormData({ title: "", content: "", date: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save discussion");
      console.error("Error saving discussion:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-section active">
      <div className="row g-4">
        {/* Discussions List */}
        <div className="col-lg-6">
          <div className="card glass">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Discussions</span>
              <button
                onClick={refetch}
                className="btn btn-outline-light btn-sm"
                disabled={loading}
              >
                {loading ? "Loading..." : "Reload"}
              </button>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              {error && (
                <div className="alert alert-danger py-2 px-3">{error}</div>
              )}
              <div className="vstack gap-2">
                {discussions.map((discussion) => (
                  <button
                    key={discussion.id}
                    onClick={() => handleSelectDiscussion(discussion)}
                    className={`btn btn-sm text-start ${
                      selectedDiscussion?.id === discussion.id
                        ? "btn-primary"
                        : "btn-outline-light"
                    }`}
                  >
                    <div className="fw-semibold">{discussion.title}</div>
                    <small className="text-secondary">
                      {new Date(discussion.date).toLocaleDateString()}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="col-lg-6">
          <div className="card glass">
            <div className="card-header">
              <span className="fw-semibold">
                {selectedDiscussion ? "Edit Discussion" : "New Discussion"}
              </span>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveDiscussion} className="vstack gap-3">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="Discussion title"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleFormChange}
                    className="form-control"
                    rows="6"
                    placeholder="Discussion content"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="form-control"
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary flex-grow-1"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  {selectedDiscussion && (
                    <button
                      type="button"
                      onClick={handleNewDiscussion}
                      className="btn btn-outline-light"
                    >
                      New
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
