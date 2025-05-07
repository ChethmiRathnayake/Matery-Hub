import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import axios from "../../api/axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    Typography,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { styled } from "@mui/system";
import template1 from "../../assets/bannerTemplates/template1.jpg";
import template2 from "../../assets/bannerTemplates/template3.jpeg";
import template3 from "../../assets/bannerTemplates/template4.jpg";
import emptyBanner from "../../assets/bannerTemplates/emptyBanner.png";

const BASE_URL = "http://localhost:1010";
const PLACEHOLDER_BANNER = emptyBanner;
const TEMPLATE_IMAGES = [template1, template2, template3];

const Input = styled("input")({
    display: "none",
});

const EditBannerDialog = ({ open, onClose, user, onProfileUpdate }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const { response: profile, error, loading, axiosFetch } = useAxios();
    const [bannerImageUrl, setBannerImageUrl] = useState(user?.bannerImageUrl);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Set preview when selected file or template changes
    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);

            // Cleanup the object URL when component unmounts or file changes
            return () => URL.revokeObjectURL(objectUrl);
        } else if (selectedTemplate) {
            setPreviewUrl(selectedTemplate);
        } else {
            setPreviewUrl(null);
        }
    }, [selectedFile, selectedTemplate]);

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to remove the banner image?");
        if (confirmed) {
            try {
                await axiosFetch({
                    axiosInstance: axios,
                    method: "DELETE",
                    url: user._links?.deleteBannerImage?.href,
                });
                onProfileUpdate();
                setBannerImageUrl("");
                onClose();
            } catch (error) {
                console.error("Error removing banner:", error);
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile && !selectedTemplate) return;

        const formData = new FormData();
        if (selectedFile) {
            formData.append("file", selectedFile);
        } else if (selectedTemplate) {
            const response = await fetch(selectedTemplate);
            const blob = await response.blob();
            const fileName = selectedTemplate.split("/").pop();
            formData.append("file", blob, fileName);
        }

        try {
            await axiosFetch({
                axiosInstance: axios,
                method: "POST",
                url: user._links?.uploadBannerImage?.href,
                data: formData,
                config: {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            });


            onProfileUpdate();
            onClose();
        } catch (err) {
            console.error("Upload failed", err);
            alert("Error occurred while uploading.");
        }
    };

    const hasBanner = Boolean(user?.bannerImageUrl);
    const bannerUrl = hasBanner ? `${BASE_URL}${user.bannerImageUrl}` : PLACEHOLDER_BANNER;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                {hasBanner ? "Edit Banner Image" : "Upload Banner Image"}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box className="flex justify-center mb-4">
                    <img
                        src={previewUrl || bannerUrl}
                        alt="Banner Preview"
                        className="rounded-lg shadow max-h-64 object-cover"
                    />
                </Box>

                <Box className="flex justify-between items-center px-1 mb-2">
                    {hasBanner && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                        >
                            Remove Banner
                        </Button>
                    )}

                    <label htmlFor="banner-upload">
                        <Input
                            id="banner-upload"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) => {
                                setSelectedFile(e.target.files[0]);
                                setSelectedTemplate(null);
                            }}
                        />
                        <Button variant="contained" component="span" startIcon={<UploadIcon />}>
                            {hasBanner ? "Change Image" : "Upload Image"}
                        </Button>
                    </label>
                </Box>

                {!hasBanner && (
                    <Box>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Or choose a template:
                        </Typography>
                        <Box className="flex gap-3">
                            {TEMPLATE_IMAGES.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Template ${idx + 1}`}
                                    onClick={() => {
                                        setSelectedTemplate(url);
                                        setSelectedFile(null);
                                    }}
                                    className={`h-24 rounded cursor-pointer border-4 ${
                                        selectedTemplate === url ? "border-blue-500" : "border-transparent"
                                    }`}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={!selectedFile && !selectedTemplate}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditBannerDialog;
