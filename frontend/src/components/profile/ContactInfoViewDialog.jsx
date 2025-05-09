import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Box,
    Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useAuthContext } from "../../hooks/useAuthContext"

const ContactInfoViewDialog = ({ open, onClose, profile, isOwnProfile, onEditClick }) => {
    const { phone, email, socialLinks = {} } = profile || {};
    const {user}= useAuthContext();

    console.log(user);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Contact Information
                {isOwnProfile && (
                    <IconButton
                        onClick={onEditClick}
                        sx={{ float: "right" }}
                        aria-label="edit"
                    >
                        <EditIcon />
                    </IconButton>
                )}
            </DialogTitle>

            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    {user.id && (
                        <Typography>
                            <strong>Profile:</strong>{" "}
                            <a href={`/profile/me`}>
                                {`/profile/me`}
                            </a>
                        </Typography>
                    )}
                    <Typography><strong>Phone:</strong> {phone || "Not provided"}</Typography>
                    <Typography><strong>Email:</strong> {user.email|| "Not provided"}</Typography>

                    {Object.entries(socialLinks).map(([platform, url]) => (
                        <Typography key={platform}>
                            <strong>{platform}:</strong>{" "}
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                {url}
                            </a>
                        </Typography>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactInfoViewDialog;
