import React from 'react';
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Register';
import Home from './pages/Home';
import Test from './pages/test'

import UserPage from "./pages/UserPage";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import LearningProgress from "./pages/LearningProgress"; // relative path from pages/
import Layout from "./components/Layout"; //
import Unauthorized from "./pages/Unauthorized"
import Profile from "./pages/Profile";

import PostForm from "./pages/PostForm";
import PostEdit from "./pages/PostEdit";
import PostDetails from "./pages/PostDetails";
import OtherUserProfilePage from "./pages/OtherUserProfilePage";

import ForgotPassword from "./pages/ForgotPassword";
import FollowPage from "./pages/FollowPage"
import MyLearningProgress from "./pages/MyLearningProgress";
import EditLearningProgress from "./pages/EditLearningProgress";
import LearningProgressFeed from "./pages/LearningProgressFeed";


function App() {
    return (

            <Routes>
                {/* Public Route: Default home page */}
                <Route
                    path="/"
                    element={<Layout><Home /></Layout>} />

                {/* Public Route: Login page */}
                <Route path="/login" element={<SignIn />} />

                <Route path="/test" element={<Test />} />
                {/* Public Route: Sign-Up page */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/unauthorized" element={<Unauthorized/>} />
                {/* Protected Route: User Dashboard (only for logged-in users) */}
                <Route
                    path="/user"
                    element={<ProtectedRoute element={<Layout><UserPage /></Layout>} roles={['ROLE_USER']} />}
                />
                <Route
                    path="/profile/me"
                    element={<ProtectedRoute element={<Layout><Profile /></Layout>} roles={['ROLE_USER']} />}
                />

                <Route path="/profile/:profileId"
                       element={<ProtectedRoute element={<Layout><OtherUserProfilePage  /></Layout>} roles={['ROLE_USER']} />} />
                <Route
                    path="/follow"
                    element={<ProtectedRoute element={<Layout><FollowPage /></Layout>} roles={['ROLE_USER']} />}
                />
                <Route
                    path="/progress/new"
                    element={
                        <ProtectedRoute element={<Layout><LearningProgress /></Layout>} roles={['ROLE_USER']}/>}
                />
                <Route
                    path="/progress"
                    element={
                        <ProtectedRoute element={<Layout><MyLearningProgress /></Layout>} roles={['ROLE_USER']}/>}
                />
                <Route
                    path="/edit-progress/:id"
                    element={
                        <ProtectedRoute element={<Layout><EditLearningProgress /></Layout>} roles={['ROLE_USER']}/>}
                />
                <Route
                    path="/progress-feed"
                    element={
                        <ProtectedRoute element={<Layout><LearningProgressFeed /></Layout>} roles={['ROLE_USER']}/>}
                />



                      <Route path="/post/new" element={<Layout><PostForm /></Layout>} />
                      <Route path="/post/edit/:id" element={<Layout><PostEdit /></Layout>} />
                      <Route path="/post/:id" element={<Layout><PostDetails /></Layout>} />


                {/* Optionally add more protected routes for other roles (e.g., admin) */}
                {/* <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} roles={['ROLE_ADMIN']} />} /> */}
            </Routes>

    );

}

export default App;
