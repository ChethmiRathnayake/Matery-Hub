import React, { useState } from 'react';
import PostPreviewList from './PostPreviewList';

const ActivityTabs = ({ userId, isOwnProfile }) => {
    const [activeTab, setActiveTab] = useState("posts");

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
                    <div className="text-center text-gray-600">Coming soon...</div>
                )}
            </div>
        </div>
    );
};

export default ActivityTabs;
