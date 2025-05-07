import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Avatar,
    IconButton,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "../../api/axios";
import useAxios from "../../hooks/useAxios";

const BASE_URL = "http://localhost:1010";

const EditProfilePicDialog = ({ open, onClose, user, onProfileUpdate }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
        user?.profilePictureUrl ? `${BASE_URL}${user.profilePictureUrl}` : null
    );
    const { response: profile, error, loading, axiosFetch } = useAxios();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {

            await axiosFetch({
                axiosInstance: axios,
                method: "POST",
                url: `/user-profiles/me/profile-picture`,
                data: formData,
                config: {
                    headers: {
                        "Content-Type": "multipart/form-data",

                    },
                },
            });
            onProfileUpdate();
            onClose();
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    };

    const handleRemove = async () => {
        try {
            await axiosFetch({
                axiosInstance: axios,
                method: "DELETE",
                url: user._links?.deleteProfilePicture?.href,
            });
            onProfileUpdate();
            onClose();
        } catch (error) {
            console.error("Error removing profile picture:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Edit Profile Picture</DialogTitle>
            <DialogContent>
                <Box display="flex" justifyContent="center" py={2}>
                    <Avatar
                        src={previewUrl}
                        alt="Profile Preview"
                        sx={{ width: 160, height: 160 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions
                sx={{ display: "flex", justifyContent: "space-between", px: 3, pb: 2 }}
            >
                <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={handleRemove}
                    disabled={!user?.profilePictureUrl}
                >
                    Remove
                </Button>

                <Box>
                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="upload-button-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-button-file">
                        <Button component="span" startIcon={<UploadIcon />}>
                            Choose File
                        </Button>
                    </label>
                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={!selectedFile}
                        sx={{ ml: 1 }}
                    >
                        Upload
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfilePicDialog;
