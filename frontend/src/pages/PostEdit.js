import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext"; // use AuthContext directly

export default function PostEdit() {
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // useContext directly

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`, {
          headers: {
            Authorization: `${user.tokenType} ${user.accessToken}`,
          },
        });
        setCaption(response.data.caption);
      } catch (err) {
        console.error("Failed to fetch post", err);
        setError("Could not load post data.");
      }
    };

    if (user?.accessToken) {
      fetchPost();
    }
  }, [id, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user?.accessToken) {
      setError("Unauthorized");
      return;
    }

    try {
      await axios.put(`/posts/${id}`, { caption }, {
        headers: {
          Authorization: `${user.tokenType} ${user.accessToken}`,
        },
      });
      navigate("/post");
    } catch (err) {
      console.error("Failed to update post", err);
      setError("Failed to update post");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="p-4 max-w-xl mx-auto">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <label className="block mb-2">Edit Caption:</label>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border rounded p-2 mb-4"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update
      </button>
    </form>
  );
}
