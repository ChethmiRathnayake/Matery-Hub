import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../components/PostForm.css"; // Make sure the path is correct

export default function PostForm() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const validateForm = () => {
    if (!caption.trim()) {
      setLocalError("Caption cannot be empty");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.accessToken) {
      setLocalError("You need to be logged in to post updates");
      return;
    }

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("caption", caption);
    if (image) formData.append("image", image);

    const token = `${user.tokenType || "Bearer"} ${user.accessToken}`;

    try {
      await axios.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      setSuccessMessage("Post created successfully!");
      setCaption("");
      setImage(null);
      navigate("/profile");
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.statusText ||
        "An error occurred while posting the update.";
      setLocalError(errMsg);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="post-form">
        <h2>Create a Post</h2>
        {localError && <p className="text-red-500">{localError}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <label>Caption:</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />

        <label>Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
