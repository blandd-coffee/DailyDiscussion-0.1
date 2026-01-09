import React, { useState } from "react";
import { UsersTab } from "./components/UsersTab";
import { DiscussionsTab } from "./components/DiscussionsTab";
import { ResponsesTab } from "./components/ResponsesTab";
import "./admin.css";

function AdminApp() {
  const [activeTab, setActiveTab] = useState("discussions");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      {/* Background overlay */}
      <div className="bg-overlay"></div>
      <div className="bg-sprites" id="bgSprites"></div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-admin">
        <div className="container">
          <a className="navbar-brand" href="#">
            Admin Dashboard
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "users" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("users")}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  Users
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "discussions" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("discussions")}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  Discussions
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "responses" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("responses")}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  Responses
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-4">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "discussions" && <DiscussionsTab />}
        {activeTab === "responses" && <ResponsesTab />}
      </main>
    </>
  );
}

export default AdminApp;
