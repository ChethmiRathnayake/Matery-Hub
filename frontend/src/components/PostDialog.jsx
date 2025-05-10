import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const BASE_URL = "http://localhost:1010";

const PostDialog = ({ post, onClose, isOwnProfile }) => {
    const handleDelete = async () => {
        alert("Deleting post... (implement logic)");
        onClose();
    };

    const handleEdit = () => {
        alert("Editing post... (implement logic)");
        onClose();
    };

    const mediaUrl = post.mediaUrl ? `${BASE_URL}${post.mediaUrl}` : "";
    const isVideo = post.mediaUrl && /\.(mp4|webm|ogg)$/i.test(post.mediaUrl);

    return (
        <Modal open={true} onClose={onClose}>
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-md w-[90%] sm:w-[400px]">
                {mediaUrl && (
                    isVideo ? (
                        <video
                            src={mediaUrl}
                            controls
                            className="w-full h-64 object-cover rounded-md mb-4"
                        />
                    ) : (
                        <img
                            src={mediaUrl}
                            alt="Post"
                            className="w-full h-64 object-cover rounded-md mb-4"
                        />
                    )
                )}
                <p className="mb-4">{post.caption}</p>

                {isOwnProfile && (
                    <div className="flex justify-end gap-2">
                        <Button variant="contained" color="primary" onClick={handleEdit}>Edit</Button>
                        <Button variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
                    </div>
                )}
            </Box>
        </Modal>
    );
};

export default PostDialog;
