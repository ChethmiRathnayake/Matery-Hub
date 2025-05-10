import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "../api/axios";
import useAxios from "../hooks/useAxios";
import UserPosts from "./UserPosts";
import ActivityTabs from "../components/ActivityTabs";
import SkillsSection from "../components/profile/SkillsSection"; // Importing SkillsSection
import InterestsSection from "../components/profile/InterestsSection"; // Importing InterestsSection

const ProfilePage = () => {
    const { user } = useAuthContext();
    const { response: profile, error, loading, axiosFetch } = useAxios();
    const { response: follow, error: ferror, loading: floading, axiosFetch: faxiosFetch } = useAxios();
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
        axiosFetch({
            axiosInstance: axios,
            method: "GET",
            url: "/user-profiles/me",
            headers: {
                Authorization: `${user.tokenType} ${user.accessToken}`,
            },
        }).then(() => {
            setProfileVersion((prev) => prev + 1); // Force re-render
        });
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-3/4">
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {profile && (
                    <ProfileHeader
                        key={profileVersion}
                        id={user.id}
                        user={profile}
                        follow={follow}
                        isOwnProfile={true}
                        onProfileUpdate={refetchProfile}
                    />
                )}

                <ActivityTabs userId={user.id} isOwnProfile={true} />

                {/* Add Skills and Interests Sections */}
                {profile && (
                    <>
                        <SkillsSection
                            skills={profile.skills}
                            isOwnProfile={true}
                            onUpdate={refetchProfile}
                        />
                        <InterestsSection
                            interests={profile?.interests || []}
                            isOwnProfile={true}
                            onUpdate={refetchProfile}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
