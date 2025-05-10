import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const BASE_URL = "http://localhost:1010";

const PostDialog = ({ post, onClose, isOwnProfile }) => {
    const [newCaption, setNewCaption] = useState(post.caption);
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async () => {
        if (!post || !post.id) return;

        try {
            const response = await fetch(`${BASE_URL}/api/posts/${post.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Post deleted successfully.");

                onClose();
            } else {
                alert("Failed to delete the post.");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("An error occurred while deleting the post.");
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (newCaption.trim() === "") {
            alert("Caption cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/posts/${post.id}/caption`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ caption: newCaption }),
            });

            if (response.ok) {
                alert("Caption updated successfully.");
                setIsEditing(false);
            } else {
                alert("Failed to update the caption.");
            }
        } catch (error) {
            console.error("Error updating caption:", error);
            alert("An error occurred while updating the caption.");
        }
    };

    const imageUrl = post.mediaUrl ? `${BASE_URL}${post.mediaUrl}` : "";

    return (
        <Modal open={true} onClose={onClose}>
            <Box className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-md w-[95%] sm:w-[600px]">
                <IconButton
                    onClick={onClose}
                    className="absolute top-2 right-2"
                    color="inherit"
                >
                    <CloseIcon />
                </IconButton>

                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Post"
                        className="w-full h-90 object-cover rounded-md mb-4"
                    />
                )}

                {isEditing ? (
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Edit Caption"
                        value={newCaption}
                        onChange={(e) => setNewCaption(e.target.value)}
                        multiline
                        rows={4}
                        className="mb-4"
                    />
                ) : (
                    <p className="mb-4">{newCaption}</p>
                )}

                {isOwnProfile && (
                    <div className="flex justify-end gap-2">
                        {isEditing ? (
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Save
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={handleEdit}>
                                Edit
                            </Button>
                        )}
                        <Button variant="outlined" color="error" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                )}
            </Box>
        </Modal>
    );
};

export default PostDialog;
