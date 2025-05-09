import React, { useContext } from "react";
//import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import Feed from "../components/UserPage/Feed"
import LeftSidebar from "../components/UserPage/LeftSideBar";
import RightSidebar from "../components/UserPage/RightSidebar"

const UserPage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            {/* Common navbar */}
            <div className="user-dashboard">
                <div className="flex">
                    <div className="w-1/4 p-4">
                        <LeftSidebar user={user}/>
                    </div>
                    <div className="w-2/4 p-4">
                        <Feed/>
                    </div>
                    <div className="w-1/4 p-4">
                        <RightSidebar/>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default UserPage;
