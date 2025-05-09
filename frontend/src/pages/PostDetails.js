import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axios"; // Adjusted relative import
import { AuthContext } from "../context/AuthContext"; // Adjusted context import

export default function PostDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext); // Use AuthContext directly
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = `${user.tokenType} ${user.accessToken}`;
        const response = await axios.get(`/posts/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        setPost(response.data);
      } catch (err) {
        console.error("Error fetching post", err);
      }
    };

    if (user?.accessToken) {
      fetchPost();
    }
  }, [id, user]);

  const handleDelete = async () => {
    try {
      const token = `${user.tokenType} ${user.accessToken}`;
      await axios.delete(`/posts/${id}`, {
        headers: { Authorization: token },
      });
      navigate("/profile"); // or back to UserPosts
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <img src={post.imageUrl} alt="Post" className="w-full h-auto mb-4" />
      <p className="text-lg mb-4">{post.caption}</p>

      {user?.id === post.userId && (
        <div className="flex gap-4">
          <Link
            to={`/posts/edit/${post.id}`}
            className="bg-yellow-500 text-white py-2 px-4 rounded"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
