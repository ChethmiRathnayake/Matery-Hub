// src/pages/ProfilePage.js
import React, { useEffect } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "../api/axios";
import useAxios from "../hooks/useAxios";
import UserPosts from "./UserPosts";


const ProfilePage = () => {
    const { user } = useAuthContext();
    const { response: profile, error, loading, axiosFetch } = useAxios();

    useEffect(() => {
        if (user?.accessToken) {
            axiosFetch({
                axiosInstance: axios,
                method: "GET",
                url: "/user-profiles/me",
                headers: {
                    Authorization: `${user.tokenType} ${user.accessToken}`,
                },
            });
        }
    }, [user]);
    console.log(profile)

    return (
        <div className="flex min-h-screen">
            <div className="w-3/4 bg-neutral-300">
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {profile && <ProfileHeader user={profile} />}
                <UserPosts/>
            </div>
        </div>
    );


};



export default ProfilePage;
