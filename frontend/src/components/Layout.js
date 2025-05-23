import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";

const Layout = ({ children }) => (
    <div className="app-layout">
        <Header />
        <main className="app-main-content">{children}</main>
        <Footer />
    </div>
);
export default Layout;