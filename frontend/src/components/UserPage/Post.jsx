import React from "react";
import PostHeader from "./PostHeader";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";

const Post = ({ post }) => (
    <div className="bg-white shadow-md rounded p-4">
        <PostHeader userId={post.userId} />
        <PostBody  image={post.mediaUrl} caption={post.caption} />
        <PostFooter likes={0} comments={1} />
    </div>
);

export default Post;
