import React from "react";

const BASE_URL = "http://localhost:1010";

const PostBody = ({ caption, image }) => {
    const fileUrl = image ? `${BASE_URL}${image}` : "";

    // Check if it's a video based on the file extension
    const isVideo = image && /\.(mp4|webm|ogg)$/i.test(image);

    return (
        <div>
            <p className="text-gray-700 mb-2">{caption}</p>
            {image && (
                isVideo ? (
                    <video
                        src={fileUrl}
                        controls
                        className="w-full rounded"
                    />
                ) : (
                    <img
                        src={fileUrl}
                        alt="Post"
                        className="w-full rounded"
                    />
                )
            )}
        </div>
    );
};

export default PostBody;
