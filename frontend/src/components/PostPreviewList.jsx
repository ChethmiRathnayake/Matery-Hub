import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import PostDialog from "./PostDialog";

const BASE_URL = "http://localhost:1010";

const PostPreviewList = ({ userId, isOwnProfile }) => {
    const [posts, setPosts] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`/posts/user/${userId}`);
                setPosts(res.data || []);
            } catch (err) {
                console.error("Failed to fetch posts", err);
            }
        };
        fetchPosts();
    }, [userId]);

    const recentPosts = showAll ? posts : posts.slice(0, 3);

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentPosts.map((post) => {
                    const mediaUrl = post.mediaUrl ? `${BASE_URL}${post.mediaUrl}` : "";
                    const isVideo = post.mediaUrl && /\.(mp4|webm|ogg)$/i.test(post.mediaUrl);
                    const createdDate = new Date(post.createdAt).toLocaleDateString();

                    return (
                        <div
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="cursor-pointer"
                        >
                            {isVideo ? (
                                <video
                                    src={mediaUrl}
                                    className="w-full h-40 object-cover rounded-md"
                                    muted
                                    autoPlay
                                    loop
                                />
                            ) : (
                                <img
                                    src={mediaUrl}
                                    alt="Post"
                                    className="w-full h-40 object-cover rounded-md"
                                />
                            )}
                            <p className="mt-2 text-sm">{post.caption}</p>
                            <p className="text-xs text-gray-500">{createdDate}</p>
                        </div>
                    );
                })}
            </div>

            {posts.length > 3 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-4 text-blue-500 hover:underline"
                >
                    {showAll ? "Show Less" : "Show More"}
                </button>
            )}

            {selectedPost && (
                <PostDialog
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    isOwnProfile={isOwnProfile}
                />
            )}
        </div>
    );
};

export default PostPreviewList;
