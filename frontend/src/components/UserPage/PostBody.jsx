import React from "react";

const BASE_URL = "http://localhost:1010";

const PostBody = ({ caption, image }) => {
    const ImageUrl = image ? `${BASE_URL}${image}` : " ";

    return (
        <div>
            <p className="text-gray-700 mb-2">{caption}</p>
            {image && <img src={ImageUrl} alt="Post" className="w-full rounded" />}
        </div>
    );
};

export default PostBody;
