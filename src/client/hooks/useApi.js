import { useState, useEffect } from "react";
import axios from "axios";

// In production, use relative URLs. In dev, use explicit URL.
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:8080/api");

export const useDiscussion = () => {
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/discussions`);
      // If response is an array, get the first item (today's discussion)
      const data = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      setDiscussion(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch discussion");
      console.error("Error fetching discussion:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussion();
  }, []);

  return { discussion, loading, error, refetch: fetchDiscussion };
};

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

export const usePostResponse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postResponse = async (discussionId, content) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/responses`, {
        discussionId,
        content,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to post response";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postResponse, loading, error };
};
