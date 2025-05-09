// src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "../api/axios";
import useAxios from "../hooks/useAxios";

const ProfilePage = () => {
    const { user } = useAuthContext();
    const { response: profile, error, loading, axiosFetch } = useAxios();
    const { response: follow, error:ferror, loading:floading, axiosFetch:faxiosFetch } = useAxios();
    const [profileVersion, setProfileVersion] = useState(0);

    useEffect(() => {
        if (user?.accessToken) {
            axiosFetch({
                axiosInstance: axios,
                method: "GET",
                url: `/user-profiles/${user.id}`,
                headers: {
                    Authorization: `${user.tokenType} ${user.accessToken}`,
                },
            });
        }
    }, [user]);

    useEffect(() => {
        if (user?.accessToken) {
            faxiosFetch({
                axiosInstance: axios,
                method: "GET",
                url: `/follow/stats/${user.id}`,
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
    console.log(user.id)

    return (
        <div className="flex min-h-screen">
            <div className="w-3/4 ">
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {profile && <ProfileHeader key={profileVersion} id = {user.id} user={profile} follow={follow} isOwnProfile={true} onProfileUpdate={refetchProfile} />}
            </div>
        </div>
    );
};

export default ProfilePage;
