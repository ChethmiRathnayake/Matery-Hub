import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:1010";

const PostHeader = ({ userId }) => {
    const { user: loggedInUser } = useAuthContext();
    const [user, setUser] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const[fuser,setFuser]=useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://100.120.106.127:1010/api/follow/following/${loggedInUser.id}`);
                const data = await res.json();
                setUser(data);


                const followingList = data || [];
                console.log(followingList)
                const isUserFollowed = followingList.some(f => f.id === userId);

                setIsFollowing(isUserFollowed);
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };

        fetchUser();
    }, [userId, loggedInUser]);

    useEffect(() => {
        const xfetchUser = async () => {
            try {
                const res = await fetch(`http://100.120.106.127:1010/api/user-profiles/${userId}`);
                const data = await res.json();
                setFuser(data);
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };

        xfetchUser();
    }, [userId]);



    const handleFollowToggle = async () => {
        try {
            if (!isFollowing) {
                const res = await fetch(
                    `http://100.120.106.127:1010/api/follow/${loggedInUser.id}/${userId}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            // Add auth header if needed
                        },
                    }
                );

                if (res.ok) {
                    setIsFollowing(true);
                } else {
                    console.error("Failed to follow user");
                }
            } else {
                // Optional: if you have an unfollow endpoint
                //console.log("Unfollow not yet implemented");
                await fetch(
                    `http://100.120.106.127:1010/api/follow/${loggedInUser.id}/${userId}`,
                    { method: "DELETE" }
                );
                setIsFollowing(false);
            }
        } catch (error) {
            console.error("Error during follow request:", error);
        }
    };


    if (!user) return <div>Loading...</div>;
    console.log(user.username + isFollowing)

    const profileImageUrl = fuser?.profilePictureUrl
        ? `${BASE_URL}${fuser.profilePictureUrl}`
        : "";

    return (
        <div className="flex justify-between items-center mb-4">
            <Link
                to={loggedInUser.id === userId ? "/profile/me" : `/profile/${userId}`}
                className="flex items-center"
            >
                <img
                    src={profileImageUrl}
                    alt={fuser?.username}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                    <div className="font-semibold">{fuser?.firstName} {fuser?.lastName}</div>
                    <div className="text-sm text-gray-500">{fuser?.bio}</div>
                </div>
            </Link>

            {loggedInUser?.id !== userId && (
                <button
                    onClick={handleFollowToggle}
                    className={`px-4 py-1 rounded text-white ${
                        isFollowing ? "bg-gray-500" : "bg-blue-500"
                    }`}
                >
                    {isFollowing ? "Following" : "Follow"}
                </button>
            )}
        </div>
    );
};

export default PostHeader;
