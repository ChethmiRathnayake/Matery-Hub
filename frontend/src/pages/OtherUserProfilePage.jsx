// src/pages/OtherUserProfilePage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import useAxios from "../hooks/useAxios";
import ProfileHeader from "../components/profile/ProfileHeader";
import ActivityTabs from "../components/ActivityTabs";
import { useAuthContext } from "../hooks/useAuthContext";
import SkillsSection from "../components/profile/SkillsSection";
import InterestsSection from "../components/profile/InterestsSection";

const OtherUserProfilePage = () => {
    const { profileId } = useParams();
    const { user } = useAuthContext(); // current logged in user

    const { response: profile, error, loading, axiosFetch } = useAxios();
    const { response: follow, error: ferror, loading: floading, axiosFetch: faxiosFetch } = useAxios();

    useEffect(() => {
        if (user?.accessToken) {
            axiosFetch({
                axiosInstance: axios,
                method: "GET",
                url: `/user-profiles/${profileId}`,
                headers: {
                    Authorization: `${user.tokenType} ${user.accessToken}`,
                },
            });
        }
    }, [profileId]);

    useEffect(() => {
        if (user?.accessToken) {
            faxiosFetch({
                axiosInstance: axios,
                method: "GET",
                url: `/follow/stats/${profileId}`,
                headers: {
                    Authorization: `${user.tokenType} ${user.accessToken}`,
                },
            });
        }
    }, [profileId]);

    return (
        <div className="flex min-h-screen">
            <div className="w-3/4 ">
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {profile && (
                    <ProfileHeader
                        id={profileId}
                        user={profile}
                        follow={follow}
                        isOwnProfile={false} // ✅ read-only mode
                        onProfileUpdate={() => {}}
                    />
                )}

                <ActivityTabs userId={profileId} isOwnProfile={false} />

                {profile && (
                    <>
                        <SkillsSection
                            skills={profile.skills}
                            isOwnProfile={false}
                            onUpdate={() => {}}
                        />
                        <InterestsSection
                            interests={profile?.interests || []}
                            isOwnProfile={false}
                            onUpdate={() => {}}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default OtherUserProfilePage;
