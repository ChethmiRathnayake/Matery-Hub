import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import "./Header.css";
import {
    FaSearch, FaUserCircle, FaPlusCircle, FaClipboardList,
    FaCompass, FaBell, FaSignOutAlt, FaUser, FaCog
} from "react-icons/fa";

const Header = () => {
    const { user} = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();

    const { logout } = useLogout();


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    return (
        <header className="app-header">
            <div className="logo">
                <Link to="/" className="logo-link">MasteryHub</Link>
            </div>

            {user && (
                <div className="search-bar">
                    <input type="text" placeholder="Search updates, plans, users..." />
                    <button className="search-button">
                        <FaSearch />
                    </button>
                </div>
            )}

            <nav className="main-nav">
                {user ? (
                    <>
                        <Link to="/post/new" className="nav-link">
                            <FaPlusCircle className="nav-icon" />
                            Post
                        </Link>
                        <Link to="/plan" className="nav-link">
                            <FaClipboardList className="nav-icon" />
                            Plan
                        </Link>
                        <Link to="/explore" className="nav-link">
                            <FaCompass className="nav-icon" />
                            Explore
                        </Link>
                        <Link to="/alerts" className="nav-link">
                            <FaBell className="nav-icon" />
                            Alerts
                        </Link>


                        <div className="profile-dropdown" ref={dropdownRef}>
                            <div className="avatar-button" onClick={() => setShowDropdown(prev => !prev)}>
                                <FaUserCircle className="nav-icon" />
                                Profile
                            </div>

                            {showDropdown && (
                                <div className="dropdown-box">
                                    <Link to="/profile/me" className="dropdown-item">
                                        <FaUser className="dropdown-icon" />
                                        View Profile
                                    </Link>
                                    <Link to="/settings" className="dropdown-item">
                                        <FaCog className="dropdown-icon" />
                                        Settings
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item">
                                        <FaSignOutAlt className="dropdown-icon" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Sign In</Link>
                        <Link to="/signup" className="nav-link">Sign Up</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
