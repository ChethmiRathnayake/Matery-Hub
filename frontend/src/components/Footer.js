import React from "react";
import "./Footer.css";

const Footer = () => (
    <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} MasteryHub. All rights reserved.</p>
    </footer>
);
export default Footer;