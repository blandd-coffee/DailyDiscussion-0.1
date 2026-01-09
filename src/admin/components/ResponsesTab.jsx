import React, { useState, useEffect } from "react";
import { useResponses } from "../hooks/useAdminApi";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const ResponsesTab = () => {
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingDiscussions, setLoadingDiscussions] = useState(true);
  const {
    responses,
    loading: loadingResponses,
    error,
    refetch,
  } = useResponses(selectedDiscussionId);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      setLoadingDiscussions(true);
      const response = await axios.get(`${API_BASE_URL}/discussions`);
      setDiscussions(response.data);
      if (response.data.length > 0 && !selectedDiscussionId) {
        setSelectedDiscussionId(response.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching discussions:", err);
    } finally {
      setLoadingDiscussions(false);
    }
  };

  const filteredResponses = responses.filter(
    (response) =>
      response.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="admin-section active">
      <div className="card glass">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="fw-semibold">Responses</span>
          <div className="d-flex gap-2 flex-wrap">
            <select
              value={selectedDiscussionId || ""}
              onChange={(e) =>
                setSelectedDiscussionId(parseInt(e.target.value))
              }
              className="form-select form-select-sm"
              style={{ maxWidth: "200px" }}
              disabled={loadingDiscussions}
            >
              <option value="">Select Discussion</option>
              {discussions.map((discussion) => (
                <option key={discussion.id} value={discussion.id}>
                  {discussion.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ maxWidth: "200px" }}
              placeholder="Search responses…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={refetch}
              className="btn btn-outline-light btn-sm"
              disabled={loadingResponses || !selectedDiscussionId}
            >
              {loadingResponses ? "Loading..." : "Reload"}
            </button>
          </div>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="vstack gap-3">
            {filteredResponses.length === 0 ? (
              <div className="text-center text-secondary py-4">
                {loadingResponses
                  ? "Loading responses..."
                  : "No responses found"}
              </div>
            ) : (
              filteredResponses.map((response) => (
                <div
                  key={response.id}
                  className="p-3"
                  style={{
                    background: "rgba(31, 41, 55, 0.9)",
                    borderRadius: "0.75rem",
                    borderLeft: "3px solid #38bdf8",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong className="text-white">
                        {response.author || "Anonymous"}
                      </strong>
                      <small className="text-secondary ms-2">
                        {new Date(response.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <span className="badge text-bg-info">#{response.id}</span>
                  </div>
                  <p className="mb-0 text-secondary">{response.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
