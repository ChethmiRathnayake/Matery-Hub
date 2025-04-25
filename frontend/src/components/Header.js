import React from "react";
import { Link } from 'react-router-dom';
import "./Header.css";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

const Header = () => {
    return (
        <header className="app-header">
            <div className="logo">MasteryHub</div>

            <div className="search-bar">
                <input type="text" placeholder="Search updates, plans, users..." />
                <button className="search-button">
                    <FaSearch />
                </button>
            </div>

            <div className="nav-icons">
                <FaBell className="icon" />
                <Link to="/user">
                    <FaUserCircle className="icon"/>
                </Link>
            </div>
        </header>
    );
};

export default Header;
