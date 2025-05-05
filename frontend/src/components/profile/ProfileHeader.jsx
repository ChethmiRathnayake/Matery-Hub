// src/components/profile/ProfileHeader.js
import React from "react";
import { Avatar, Button, Typography } from "@mui/material";

const BASE_URL = "http://localhost:1010";

const ProfileHeader = ({ user }) => {
    const profileImageUrl = user?.profilePictureUrl ? `${BASE_URL}${user.profilePictureUrl}` : "";
    const bannerImageUrl = user?.bannerImageUrl ? `${BASE_URL}${user.bannerImageUrl}` : "";

    return (
        <div className="relative w-full">
            {/* Banner */}
            <div
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${bannerImageUrl})` }}
            ></div>

            {/* Avatar */}
            <div className="absolute top-36 left-6">
                <Avatar
                    alt={user.firstName}
                    src={profileImageUrl}
                    sx={{
                        width: 200,
                        height: 200,
                        border: "4px solid white",
                    }}
                />
            </div>

            {/* Info */}
            <div className="mt-28 pl-32 pr-4 pb-4">
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {user.bio}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {user.location}
                </Typography>

                <div className="mt-3">
                    <Button variant="outlined">Edit Profile</Button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
