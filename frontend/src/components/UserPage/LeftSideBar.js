import React from "react";


const LeftSidebar = ({ user }) => (
    <div className="bg-white shadow-md rounded p-4">
        <img src={user} alt="Profile" className="w-20 h-20 rounded-full" />
        <h2 className="text-xl font-semibold mt-2">name</h2>
        <p className="text-gray-600">bio</p>
    </div>
);

export default LeftSidebar;
