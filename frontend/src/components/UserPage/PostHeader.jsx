import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:1010";
const PostHeader = ({ userId }) => {
    const [user, setUser] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://100.120.106.127:1010/api/user-profiles/${userId}`);
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };

        fetchUser();
    }, [userId]);

    if (!user) return <div>Loading...</div>;

    const profileImageUrl = user?.profilePictureUrl
        ? `${BASE_URL}${user.profilePictureUrl}`
        : " ";
    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
                <img
                    src={profileImageUrl}
                    alt={user.username}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                    <div className="font-semibold">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-gray-500">{user.bio}</div>
                </div>
            </div>

        </div>
    );
};

export default PostHeader;
