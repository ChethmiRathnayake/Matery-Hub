import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import PostPreviewList from './PostPreviewList';

const ActivityTabs = ({ userId, isOwnProfile }) => {
    const [activeTab, setActiveTab] = useState("posts");
    const navigate = useNavigate(); // Initialize useNavigate hook for navigation

    // Function to navigate to the learning progress feed
    const navigateToLearningProgressFeed = () => {
        navigate("/progress"); // Replace with your actual learning progress feed route
    };

    return (
        <div className="mt-8 bg-neutral-100 p-6 rounded-2xl shadow-md">
            {/* My Activity Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">My Activity</h2>

            {/* Title and Tab Navigation */}
            <div className="flex border-b pb-4 mb-4">
                {["posts", "learning"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-6 py-3 text-lg font-semibold capitalize rounded-t-lg transition-all duration-300 ease-in-out ${
                            activeTab === tab
                                ? "border-b-4 border-blue-600 text-blue-600"
                                : "text-gray-600 hover:text-blue-500"
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === "posts" ? "Posts" : "Learning Progress"}
                    </button>
                ))}
            </div>

            {/* Tabs Content */}
            <div className="mt-4">
                {activeTab === "posts" ? (
                    <PostPreviewList userId={userId} isOwnProfile={isOwnProfile} />
                ) : (
                    <div className="text-center text-gray-600">
                        <p>Coming soon...</p>
                        {/* Button to navigate to learning progress feed */}
                        <button
                            onClick={navigateToLearningProgressFeed}
                            className="mt-4 px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
                        >
                            Go to Learning Progress Feed
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityTabs;
