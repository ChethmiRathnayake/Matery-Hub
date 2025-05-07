import React, { useEffect, useState } from "react";
import axios from "../api/axios";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      {posts.map(post => (
        <div key={post.id}>
          <p>{post.caption}</p>
          {post.imageUrl && <img src={post.imageUrl} alt="Post" style={{ width: "200px" }} />}
        </div>
      ))}
    </div>
  );
}
