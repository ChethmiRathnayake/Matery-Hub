import React from "react";

const PostFooter = ({ likes, comments }) => (
    <div className="flex justify-between mt-3 text-gray-600 text-sm">
        <button>👍 Like ({likes})</button>
        <button>💬 Comment ({comments})</button>
    </div>
);

export default PostFooter;
