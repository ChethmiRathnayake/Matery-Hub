import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Box,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import axios from "../../api/axios";
import useAxios from "../../hooks/useAxios";
import {useAuthContext} from "../../hooks/useAuthContext";

const ContactInfoEditDialog = ({ open, onClose, profile, onProfileUpdate }) => {
    const [phone, setPhone] = useState("");

    const [socialLinks, setSocialLinks] = useState({});
    const [originalData, setOriginalData] = useState({});

    const [newPlatform, setNewPlatform] = useState("");
    const [customPlatform, setCustomPlatform] = useState("");
    const { response: prof, error, loading, axiosFetch } = useAxios();
    const {user}= useAuthContext();

    useEffect(() => {
        if (profile) {
            setPhone(profile.phone || "");

            setSocialLinks(profile.socialLinks || {});
            setOriginalData({
                phone: profile.phone || "",

                socialLinks: profile.socialLinks || {}
            });
        }
    }, [profile]);

    const handleSocialLinkChange = (platform, value) => {
        setSocialLinks((prev) => ({
            ...prev,
            [platform]: value
        }));
    };

    const handleRemovePlatform = (platform) => {
        const updated = { ...socialLinks };
        delete updated[platform];
        setSocialLinks(updated);
    };

    const isChanged = () => {
        return (
            phone !== originalData.phone ||

            JSON.stringify(socialLinks) !== JSON.stringify(originalData.socialLinks)
        );
    };

    const handleSave = async () => {
        const updatedData = {

            socialLinks
        };

        try {
            console.log("Sending update to:", profile._links?.update?.href);
            console.log("Payload:", updatedData);

            await axiosFetch({
                axiosInstance: axios,
                method: "PUT",
                url: profile._links?.update?.href,
                data: updatedData,
            });
            onProfileUpdate();
            onClose();
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Edit Contact Information
                <IconButton
                    onClick={onClose}
                    sx={{ float: "right" }}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={3}>
                    <TextField
                        label="Email"
                        value={user.email}

                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                    />
                    <TextField
                        label="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                    />

                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <strong>Social Links</strong>
                        </Box>

                        {/* Platform Selector */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Select Platform</InputLabel>
                            <Select
                                value={newPlatform}
                                label="Select Platform"
                                onChange={(e) => {
                                    setNewPlatform(e.target.value);
                                    setCustomPlatform("");
                                }}
                            >
                                <MenuItem value="GitHub">GitHub</MenuItem>
                                <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                                <MenuItem value="Twitter">Twitter</MenuItem>
                                <MenuItem value="Facebook">Facebook</MenuItem>
                                <MenuItem value="Instagram">Instagram</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>

                        {newPlatform === "Other" && (
                            <TextField
                                fullWidth
                                label="Custom Platform Name"
                                value={customPlatform}
                                onChange={(e) => setCustomPlatform(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                        )}

                        <Button
                            variant="outlined"
                            onClick={() => {
                                const platformToAdd = newPlatform === "Other" ? customPlatform : newPlatform;
                                if (platformToAdd && !socialLinks[platformToAdd]) {
                                    setSocialLinks((prev) => ({
                                        ...prev,
                                        [platformToAdd]: ""
                                    }));
                                    setNewPlatform("");
                                    setCustomPlatform("");
                                }
                            }}
                            disabled={!newPlatform || (newPlatform === "Other" && !customPlatform)}
                            sx={{ mb: 2 }}
                        >
                            Add Platform
                        </Button>

                        <Grid container spacing={2}>
                            {Object.entries(socialLinks).map(([platform, url]) => (
                                <Grid item xs={12} key={platform}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <TextField
                                            label={platform}
                                            value={url}
                                            onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                                            fullWidth
                                        />
                                        <IconButton onClick={() => handleRemovePlatform(platform)}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSave}
                    disabled={!isChanged()}
                    variant="contained"
                    color="primary"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactInfoEditDialog;
