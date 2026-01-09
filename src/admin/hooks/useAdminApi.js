import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:8080/api");

// Users hook
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};

// Discussions hook
export const useDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/discussions`);
      setDiscussions(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch discussions";
      setError(errorMessage);
      console.error("Error fetching discussions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return { discussions, loading, error, refetch: fetchDiscussions };
};

// Create/Update discussion hook
export const useCreateDiscussion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createDiscussion = async (title, content, date) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/discussions`, {
        title,
        content,
        date,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create discussion";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createDiscussion, loading, error };
};

// Get responses hook
export const useResponses = (discussionId) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResponses = async () => {
    if (!discussionId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API_BASE_URL}/responses/discussion/${discussionId}`
      );
      setResponses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch responses");
      console.error("Error fetching responses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [discussionId]);

  return { responses, loading, error, refetch: fetchResponses };
};
