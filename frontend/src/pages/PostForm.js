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
        caption: "",
        image: null,   // Handle the image upload
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                navigate("/post");
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
        <div className="post-body">
            <form onSubmit={handleSubmit} className="post-form">
                {error && <div className="alert error">{error}</div>}
                {successMessage && <div className="alert success">{successMessage}</div>}

                <div>
                    <label htmlFor="caption">Caption</label>
                    <textarea
                        id="caption"
                        name="caption"
                        value={formData.caption}
                        onChange={handleInputChange}
                        placeholder="What are you thinking?"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        required
                    />
                </div>

                {formData.image && (
                    <div className="post-image-preview">
                        <img src={URL.createObjectURL(formData.image)} alt="Preview" />
                    </div>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Creating Post..." : "Create Post"}
                </button>
            </form>
        </div>
    );

};

export default PostCreate;