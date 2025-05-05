import React from "react";
import { Link } from 'react-router-dom';
import "./Header.css";
import { FaSearch, FaBell, FaUserCircle, FaPlusCircle, FaClipboardList, FaCompass } from "react-icons/fa";

const Header = () => {
    return (
        <header className="app-header">
            <div className="logo">
                <Link to="/" className="logo-link">MasteryHub</Link>
            </div>

            <div className="search-bar">
                <input type="text" placeholder="Search updates, plans, users..." />
                <button className="search-button">
                    <FaSearch />
                </button>
            </div>

            <nav className="main-nav">
                <Link to="/post/new" className="nav-link">
                    <FaPlusCircle className="nav-icon" />
                    Post
                </Link>
                <Link to="/plans" className="nav-link">
                    <FaClipboardList className="nav-icon" />
                    Plans
                </Link>
                <Link to="/explore" className="nav-link">
                    <FaCompass className="nav-icon" />
                    Explore
                </Link>
                <Link to="/alerts" className="nav-link">
                    <FaBell className="nav-icon" />
                    Alerts
                </Link>
                <Link to="/profile" className="nav-link">
                    <FaUserCircle className="nav-icon" />
                    Profile
                </Link>
            </nav>

        </header>
    );
};

export default Header;
