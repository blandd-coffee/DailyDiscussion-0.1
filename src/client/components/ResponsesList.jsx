import React from "react";

export const ResponseItem = ({ response }) => {
  return (
    <div className="list-group-item bg-transparent border-secondary text-white mb-2">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <p className="fw-semibold mb-1">{response.author || "Anonymous"}</p>
          <p className="mb-0">{response.content}</p>
        </div>
      </div>
      <small className="text-secondary">
        {new Date(response.createdAt).toLocaleDateString()}{" "}
        {new Date(response.createdAt).toLocaleTimeString()}
      </small>
    </div>
  );
};

export const ResponsesList = ({ responses, loading, onReload }) => {
  if (loading && responses.length === 0) {
    return (
      <div className="card glass text-white card-main card-responses">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span className="fw-semibold">Responses</span>
          <div className="d-flex align-items-center gap-2">
            <div className="badge text-bg-primary d-none"></div>
            <button className="btn btn-outline-light btn-sm">Reload</button>
          </div>
        </div>
        <div className="card-body">
          <div className="responses-scroll">
            <div className="py-2 placeholder-glow">
              <div className="placeholder col-5"></div>
              <div className="placeholder col-8"></div>
            </div>
            <div className="py-2 placeholder-glow">
              <div className="placeholder col-4"></div>
              <div className="placeholder col-9"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card glass text-white card-main card-responses">
      <div className="card-header d-flex align-items-center justify-content-between">
        <span className="fw-semibold">Responses</span>
        <div className="d-flex align-items-center gap-2">
          {responses.length > 0 && (
            <div className="badge text-bg-primary">{responses.length}</div>
          )}
          <button
            onClick={onReload}
            disabled={loading}
            className="btn btn-outline-light btn-sm"
          >
            {loading ? "Loading..." : "Reload"}
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="responses-scroll">
          <div className="responses list-group list-group-flush">
            {responses.length === 0 ? (
              <div className="text-center text-secondary py-4">
                <p>No responses yet. Be the first to reply!</p>
              </div>
            ) : (
              responses.map((response) => (
                <ResponseItem key={response.id} response={response} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
