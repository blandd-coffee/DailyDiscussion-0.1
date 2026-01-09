import React from "react";

export const DiscussionCard = ({ discussion, loading, onReload, children }) => {
  if (loading && !discussion) {
    return (
      <div className="card glass text-white card-main card-discussion">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span className="fw-semibold">Discussion</span>
          <span className="badge text-bg-secondary d-none">#</span>
        </div>
        <div className="card-body">
          <div className="discussion-scroll mb-2">
            <h2 className="h3 placeholder-glow">
              <span className="placeholder col-6"></span>
            </h2>
            <p className="placeholder-glow mb-3">
              <span className="placeholder col-12"></span>
              <span className="placeholder col-10"></span>
              <span className="placeholder col-8"></span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card glass text-white card-main card-discussion">
      <div className="card-header d-flex align-items-center justify-content-between">
        <span className="fw-semibold">Discussion</span>
        {discussion?.id && (
          <span className="badge text-bg-secondary">#{discussion.id}</span>
        )}
      </div>
      <div className="card-body">
        <div className="discussion-scroll mb-2">
          <h2 id="discussion-title" className="h3">
            {discussion?.title || "No Discussion"}
          </h2>
          <p id="discussion-text" className="mb-3">
            {discussion?.content || "No content available"}
          </p>
          <div className="d-flex gap-2 mb-2">
            <button onClick={onReload} className="btn btn-outline-light btn-sm">
              Reload Discussion
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
