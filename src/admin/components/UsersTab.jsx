import React, { useState } from "react";
import { useUsers } from "../hooks/useAdminApi";

export const UsersTab = () => {
  const { users, loading, error, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="admin-section active">
      <div className="card glass">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Users</span>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ maxWidth: "200px" }}
              placeholder="Search users…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={refetch}
              className="btn btn-outline-light btn-sm"
              disabled={loading}
            >
              {loading ? "Loading..." : "Reload"}
            </button>
          </div>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive">
            <table className="table table-light-glass table-sm align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-secondary py-4">
                      {loading ? "Loading users..." : "No users found"}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="fw-semibold">{user.name || "N/A"}</td>
                      <td>{user.email || "N/A"}</td>
                      <td>
                        <span className="badge badge-soft">
                          {user.role || "user"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            user.active
                              ? "text-bg-success"
                              : "text-bg-secondary"
                          }`}
                        >
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
