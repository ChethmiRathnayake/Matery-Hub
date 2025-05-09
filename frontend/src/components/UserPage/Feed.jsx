import React, { useEffect, useState, useContext } from "react";
import Post from "./Post";


const Feed = () => {
    const [posts, setPosts] = useState([]);
    //const { user } = useContext(AuthContext); // To identify current user if needed


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:1010/api/posts", {

                });
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };

        fetchPosts();
    }, []);


console.log(posts)
    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
};

export default Feed;
