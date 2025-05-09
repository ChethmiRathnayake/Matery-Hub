// components/UserCard.jsx
import React from 'react';
import {
    Box,
    Avatar,
    Typography,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "../api/axios";
import useAxios from "../hooks/useAxios";
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user, onUnfollow,  showUnfollowButton = false  }) => {
    const { response: profile, error, loading, axiosFetch } = useAxios();
    const { user :cuser } = useAuthContext();
    const navigate = useNavigate();
    console.log(cuser)
    console.log(user.id)
    const handleUnfollow = async () => {
        console.log("in unfollow")
        // console.log(cuser.id)
        // console.log(user.id)
        try {
            await axiosFetch({
                axiosInstance: axios,
                method: "DELETE",
                url: `/follow/${cuser.id}/${user.id}`,

            });

            if (onUnfollow) onUnfollow(); // trigger refresh
        } catch (error) {
            console.error('Unfollow failed:', error);
        }
    };
    const BASE_URL = "http://localhost:1010";

    const profileImageUrl = user.userProfile?.profilePictureUrl
        ? `${BASE_URL}${user.userProfile.profilePictureUrl}`
        : " ";

    console.log(user)
    const handleCardClick = () => {
        navigate(`/profile/${user.id}`);
    };

    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 3,
                boxShadow: 2,
                cursor: 'pointer', // makes it clear it's clickable
            }}
            onClick={handleCardClick}
        >
            <Box display="flex" alignItems="center">
                <Avatar
                    src={profileImageUrl}
                    sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                    <Typography variant="subtitle1">
                        {user.username || user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {`${user.userProfile.firstName} ${user.userProfile.lastName}`}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {user.userProfile.bio || 'No bio available'}
                    </Typography>
                </Box>
            </Box>

            {showUnfollowButton && (
                <Button
                    variant="outlined"
                    color="error"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent card click
                        handleUnfollow();
                    }}
                    sx={{ minWidth: 100 }}
                >
                    Unfollow
                </Button>
            )}
        </Card>

    );
};
export default UserCard;
