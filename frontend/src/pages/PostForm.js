import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import useAxios from "../hooks/useAxios";
import axios from "../api/axios";
import "../components/PostForm.css";

const PostCreate = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { axiosFetch, error: apiError, loading } = useAxios();
    const [formData, setFormData] = useState({
        caption: "",  // Caption is the main field for your post
        image: null,   // Handle the image upload
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                navigate("/post");  // After successful post creation, navigate to posts page
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, image: file }));
    };

    const validateForm = () => {
        if (!formData.caption.trim()) {
            setError("Caption is required");
            return false;
        }

        if (!formData.image) {
            setError("An image is required");
            return false;
        }

        setError(null);
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.accessToken) {
            setError("You need to be logged in to create a post");
            return;
        }

        if (!validateForm()) return;

        console.log(formData)
        const formDataToSend = new FormData();
        formDataToSend.append("caption", formData.caption);
        formDataToSend.append("image", formData.image);
        formDataToSend.append("userId", user.id);

        try {
            console.log(formDataToSend)
            const response = await axiosFetch({
                axiosInstance: axios,
                method: "POST",
                url: "/posts",
                data: formDataToSend,
               config: {
                                   headers: {
                                       "Content-Type": "multipart/form-data",
                                   },
                               },
            });

            setSuccessMessage("Post created successfully!");
            setFormData({
                caption: "",
                image: null,
            });
            navigate("/profile/me");
        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                error?.response?.statusText ||
                "An error occurred while creating the post.";
            setError(errMsg);
        }
    };

    return (
        <div className="post-create-container">
            <header className="post-create-header">
                <h2>Create a New Post</h2>
                <p className="subtitle">Share your thoughts with the world!</p>
            </header>

            <form onSubmit={handleSubmit} className="post-create-form">
                {(error || apiError) && (
                    <div className="alert error">
                        {error || apiError}
                        {(error?.includes("Session expired") || apiError?.includes("Session expired")) && (
                            <button onClick={() => navigate("/login")} className="text-button">
                                Go to Login
                            </button>
                        )}
                    </div>
                )}

                {successMessage && (
                    <div className="alert success">
                        {successMessage}
                    </div>
                )}

                <div className="form-section">
                    <label className="form-label">Post Details</label>
                    <div className="form-grid">
                        <div className="form-field">
                            <label className="input-label">Caption*</label>
                            <textarea
                                name="caption"
                                value={formData.caption}
                                onChange={handleInputChange}
                                placeholder="What are you thinking?"
                                className="form-input"
                                rows="3"
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label className="input-label">Image*</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate("/post")}
                        className="secondary-button"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="primary-button"
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creating Post...
                            </>
                        ) : (
                            "Create Post"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostCreate;
