import React, { useState, useEffect } from "react";
import { Avatar, Button, Typography, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Edit as EditIcon, CameraAlt as CameraIcon } from "@mui/icons-material";
import EditBannerDialog from "./EditBannerDialog";
import EditProfilePicDialog from "./EditProfilPicDialog";
import EditProfileInfoDialog from "./EditProfileInfoDialog";
import emptyBanner from "../../assets/bannerTemplates/emptyBanner.png"
import ContactInfoViewDialog from "./ContactInfoViewDialog"
import ContactInfoEditDialog from "./EditContactInfoDialog";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:1010";
const PLACEHOLDER_BANNER = emptyBanner;

const ProfileHeader = ({ user, id,isOwnProfile,follow, onProfileUpdate }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openBannerDialog, setOpenBannerDialog] = useState(false);
    const [profileData, setProfileData] = useState(user);
    const [openProfilePicDialog, setOpenProfilePicDialog] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [followDialogOpen, setFollowDialogOpen] = useState(false);
    const navigate = useNavigate();



console.log(id)


console.log(follow)

    const profileImageUrl = profileData?.profilePictureUrl
        ? `${BASE_URL}${profileData.profilePictureUrl}`
        : " ";

    const bannerImageUrl = profileData?.bannerImageUrl
        ? `${BASE_URL}${profileData.bannerImageUrl}`
        : PLACEHOLDER_BANNER;

    const handleProfileUpdate = () => {
        if (onProfileUpdate) {
            console.log(("inhere"))
            onProfileUpdate(); // This will call the refetchProfile from ProfilePage
        }
    };

    return (
        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-neutral-100">
            {/* Banner */}
            <div
                className="h-64 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${bannerImageUrl})` }}
            >
                {isOwnProfile && (
                    <Tooltip title={user?.bannerImageUrl ? "Edit Banner" : "Upload Banner"}>
                        <IconButton
                            size="small"
                            sx={{ position: "absolute", top: 10, right: 10, bgcolor: "white" }}
                            onClick={() => setOpenBannerDialog(true)}
                        >
                            {user?.bannerImageUrl ? (
                                <EditIcon fontSize="small" />
                            ) : (
                                <CameraIcon fontSize="small" />
                            )}
                        </IconButton>
                    </Tooltip>
                )}
            </div>

            {/* Avatar */}
            <div className="absolute top-36 left-6">
                <div className="relative">
                    <Avatar
                        alt={profileData.firstName}
                        src={profileImageUrl}
                        sx={{
                            width: 220,
                            height: 220,
                            border: "4px solid white",
                        }}
                    />
                    {isOwnProfile && (
                        <Tooltip title="Edit Profile Picture">
                            <IconButton
                                size="small"
                                sx={{
                                    position: "absolute",
                                    bottom: 10,
                                    right: 10,
                                    bgcolor: "white"
                                }}
                                onClick={() => setOpenProfilePicDialog(true)}
                            >
                                <CameraIcon fontSize="small" />
                            </IconButton>

                        </Tooltip>
                    )}
                </div>
            </div>

            {/* Info */}
            {/* Info Section */}
            <div className="mt-28 ml-[60px] pr-6 pb-6 pt-2 relative space-y-2">


                <div className="flex items-center gap-2 relative">
                    <Typography variant="h4" sx={{fontWeight: 700, color: "#1a202c"}}>
                        {profileData.firstName} {profileData.lastName}
                    </Typography>
                    {isOwnProfile && (
                        <Tooltip title="Edit Info">
                            <IconButton
                                size="small"
                                sx={{
                                    bgcolor: "white",
                                    position: "absolute",
                                    top: -100, // Adjust vertical position below the banner
                                    right: -2, // Adjust horizontal position to the right
                                    zIndex: 10
                                }}
                                onClick={() => setOpenEditDialog(true)}
                            >
                                <EditIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    )}
                </div>

                {/* Bio */}
                {profileData.bio && (
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: "1rem",
                            fontWeight: 400,
                            color: "#4A5568",
                            lineHeight: 1.5,
                        }}
                    >
                        {profileData.bio}
                    </Typography>
                )}

                {/* Location */}
                {profileData.location && (
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "0.95rem",
                            color: "#718096",
                        }}
                    >
                        {profileData.location}
                    </Typography>
                )}

                {/* Contact Info Button */}
                <Button
                    variant="outlined"
                    size="small"
                    sx={{
                        textTransform: "none",
                        fontSize: "0.85rem",
                        borderRadius: "8px",
                        mt: 1
                    }}
                    onClick={() => setViewDialogOpen(true)}
                >
                    Contact Info
                </Button>

                {/* Follower/Following - Side by Side */}
                <div className="flex items-center gap-4 mt-2">
                    <div
                        onClick={() =>
                            navigate("/follow", {
                                state: {
                                    userId: id,
                                    initialTab: "following"
                                }
                            })
                        }
                        className="cursor-pointer hover:underline"
                    >
                        <Typography variant="body2" sx={{ fontWeight: 500, color: "#3182CE" }}>
                            {(follow?.followingCount ?? 0)} Following
                        </Typography>
                    </div>

                    <div
                        onClick={() =>
                            navigate("/follow", {
                                state: {
                                    userId: id,
                                    initialTab: "followers"
                                }
                            })
                        }
                        className="cursor-pointer hover:underline"
                    >
                        <Typography variant="body2" sx={{ fontWeight: 500, color: "#3182CE" }}>
                            {(follow?.followersCount ?? 0)} Followers
                        </Typography>
                    </div>
                </div>


            </div>


            <ContactInfoViewDialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                profile={profileData}
                isOwnProfile={isOwnProfile}
                onEditClick={() => {
                    setViewDialogOpen(false);
                    setEditDialogOpen(true);
                }}
            />

            <ContactInfoEditDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                profile={profileData}
                onProfileUpdate={handleProfileUpdate}
                // your axios wrapper
            />

            {/* Edit Banner Dialog */}
            <EditBannerDialog
                open={openBannerDialog}
                onClose={() => setOpenBannerDialog(false)}
                user={profileData}
                onProfileUpdate={handleProfileUpdate}
            />


            <EditProfilePicDialog
                open={openProfilePicDialog}
                onClose={() => setOpenProfilePicDialog(false)}
                user={profileData}
                onProfileUpdate={handleProfileUpdate}
            />

            <EditProfileInfoDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                user={profileData}
                onProfileUpdate={handleProfileUpdate}
            />
        </div>
    );
};

export default ProfileHeader;
