import React, { useState } from "react";
import { useDiscussion, useResponses } from "./hooks/useApi";
import { DiscussionCard } from "./components/DiscussionCard";
import { ResponsesList } from "./components/ResponsesList";
import { ReplyComposer } from "./components/ReplyComposer";
import "./App.css";

function App() {
  const {
    discussion,
    loading: discussionLoading,
    error: discussionError,
    refetch: refetchDiscussion,
  } = useDiscussion();
  const {
    responses,
    loading: responsesLoading,
    error: responsesError,
    refetch: refetchResponses,
  } = useResponses(discussion?.id);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleReplyPosted = () => {
    setToastMessage("Reply posted successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    refetchResponses();
  };

  const handleRefresh = () => {
    refetchDiscussion();
    refetchResponses();
    setToastMessage("Refreshed!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      {/* Duck background */}
      <div className="bg-sprites" id="bgSprites"></div>

      <header className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 page-title-wrap">
          <div className="text-white">
            <h1 className="display-5 fw-semibold mb-1">Today's Topic</h1>
            <p className="lead text-opacity-75 mb-0">
              Join the thread. Share a response.
            </p>
          </div>
          <button
            id="refreshBtn"
            onClick={handleRefresh}
            className="btn btn-light btn-sm"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="container">
        <div className="row g-4">
          <section className="col-12 col-lg-7">
            <DiscussionCard
              discussion={discussion}
              loading={discussionLoading}
              onReload={refetchDiscussion}
            >
              {discussion && (
                <ReplyComposer
                  discussionId={discussion.id}
                  onReplyPosted={handleReplyPosted}
                />
              )}
            </DiscussionCard>
            {discussionError && (
              <div className="alert alert-danger mt-2">{discussionError}</div>
            )}
          </section>

          <section className="col-12 col-lg-5">
            <ResponsesList
              responses={responses}
              loading={responsesLoading}
              onReload={refetchResponses}
            />
            {responsesError && (
              <div className="alert alert-danger mt-2">{responsesError}</div>
            )}
          </section>
        </div>
      </main>

      {/* Toast notification */}
      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1080 }}
      >
        <div
          className={`toast align-items-center text-bg-success border-0 ${
            showToast ? "show" : ""
          }`}
          role="alert"
          style={{ display: showToast ? "flex" : "none" }}
        >
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowToast(false)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
