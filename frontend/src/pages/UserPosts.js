import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ Correct context used in your app

export default function UserPosts() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext); // ✅ Use AuthContext, not UserContext

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = `${user.tokenType} ${user.accessToken}`;
        const response = await axios.get("/posts", {
          headers: {
            Authorization: token,
          },
        });
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching user posts", err);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Posts</h2>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Link
            to={`/posts/${post.id}`}
            key={post.id}
            className="border p-4 rounded shadow hover:bg-gray-100"
          >
            <img src={post.imageUrl} alt="Post" className="h-48 w-auto object-cover" />
            <p>{post.caption}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
