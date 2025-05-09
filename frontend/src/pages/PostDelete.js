import React from "react";
import { useUser } from "../context/UserContext";
import axios from "../api/axios";

export default function PostDelete({ postId, onDelete }) {
  const { user } = useUser();

  const handleDelete = async () => {
    if (!user?.accessToken) {
      alert("Unauthorized");
      return;
    }

    try {
      await axios.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `${user.tokenType} ${user.accessToken}`,
        },
      });
      onDelete(); // callback to refresh list
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete post");
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500">Delete</button>
  );
}
