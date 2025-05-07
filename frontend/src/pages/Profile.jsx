// src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "../api/axios";
import useAxios from "../hooks/useAxios";

const ProfilePage = () => {
    const { user } = useAuthContext();
    const { response: profile, error, loading, axiosFetch } = useAxios();
    const [profileVersion, setProfileVersion] = useState(0);

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



    const refetchProfile = () => {
        console.log("inside refetch ");
        axiosFetch({
            axiosInstance: axios,
            method: "GET",
            url: "/user-profiles/me",
            headers: {
                Authorization: `${user.tokenType} ${user.accessToken}`,
            },
        }).then(() => {
            setProfileVersion(prev => prev + 1); // Force re-render
        });
    };
    console.log(profile)

    return (
        <div className="flex min-h-screen">
            <div className="w-3/4 ">
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {profile && <ProfileHeader key={profileVersion} user={profile}  isOwnProfile={true} onProfileUpdate={refetchProfile} />}
            </div>
        </div>
    );
};

export default ProfilePage;
