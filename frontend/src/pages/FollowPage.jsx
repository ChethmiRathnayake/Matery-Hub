import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import UserCard from '../components/UserCard';

const FollowPage = () => {
    const location = useLocation();
    const { userId, initialTab } = location.state || {};
    const [tabIndex, setTabIndex] = useState(initialTab === 'following' ? 1 : 0);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:1010/api/follow/followers/${userId}`)
            .then((res) => setFollowers(res.data));
        axios
            .get(`http://localhost:1010/api/follow/following/${userId}`)
            .then((res) => setFollowing(res.data));
    }, [userId]);

    return (
        <Box className="flex justify-center items-start min-h-screen bg-gray-50 py-10">
            <Box className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
                <Tabs
                    value={tabIndex}
                    onChange={(e, newValue) => setTabIndex(newValue)}
                    centered
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="Followers" />
                    <Tab label="Following" />
                </Tabs>

                <Box className="mt-6 space-y-4">
                    {tabIndex === 0 &&
                        followers.map((user) => (
                            <UserCard key={user._id} user={user} />
                        ))}

                    {tabIndex === 1 &&
                        following.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                showUnfollowButton={true}
                                onUnfollow={() =>
                                    axios
                                        .get(`http://localhost:1010/api/follow/following/${userId}`)
                                        .then((res) => setFollowing(res.data))
                                }
                            />
                        ))}
                </Box>
            </Box>
        </Box>
    );
};

export default FollowPage;
