import React, { useState, useEffect } from "react";
import "./LearningProgress.css";
import axios from "../api/axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";

const templates = [
    {
        id: "completed_tutorial",
        title: "Completed Tutorial",
        placeholders: ["tutorialName", "platform", "topic", "experience"],
        body: "I just completed {tutorialName} on {platform}. I learned about {topic} and found it {experience}."
    },
    {
        id: "faced_challenge",
        title: "Faced a Challenge",
        placeholders: ["topic", "problem", "solution"],
        body: "While learning {topic}, I struggled with {problem}. I solved it by {solution}."
    },
    {
        id: "new_skill_learned",
        title: "Learned a New Skill",
        placeholders: ["skill", "resource", "useCase"],
        body: "Today I learned how to {skill} using {resource}. I feel confident applying it to {useCase}."
    }
];

const LearningProgress = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { axiosFetch, error: apiError, loading } = useAxios();
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [formData, setFormData] = useState({});
    const [mediaUrls, setMediaUrls] = useState([""]);
    const [tags, setTags] = useState([""]);
    const [localError, setLocalError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [editableMessage, setEditableMessage] = useState("");

    useEffect(() => {
        // Sync editable message with generated content
        setEditableMessage(generateMessage());
    }, [selectedTemplate, formData]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleInputChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleMediaUrlChange = (index, value) => {
        const newMediaUrls = [...mediaUrls];
        newMediaUrls[index] = value;
        setMediaUrls(newMediaUrls);
    };

    const addMediaUrl = () => setMediaUrls(prev => [...prev, ""]);
    const removeMediaUrl = (index) => setMediaUrls(prev => prev.filter((_, i) => i !== index));

    const handleTagChange = (index, value) => {
        const newTags = [...tags];
        newTags[index] = value;
        setTags(newTags);
    };

    const addTag = () => setTags(prev => [...prev, ""]);
    const removeTag = (index) => setTags(prev => prev.filter((_, i) => i !== index));

    const generateMessage = () => {
        return selectedTemplate.placeholders.reduce((msg, key) => {
            return msg.replace(new RegExp(`{${key}}`, "g"), formData[key] || "...");
        }, selectedTemplate.body);
    };

    const validateForm = () => {
        const missingFields = selectedTemplate.placeholders.filter(
            key => !formData[key]?.trim()
        );

        if (missingFields.length > 0) {
            setLocalError(`Please fill in: ${missingFields.join(", ")}`);
            return false;
        }

        const invalidUrls = mediaUrls
            .filter(url => url.trim())
            .filter(url => !url.match(/^https?:\/\/.+/));

        if (invalidUrls.length > 0) {
            setLocalError("Please enter valid HTTP/HTTPS URLs");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!user?.accessToken) {
            const msg = "You need to be logged in to post updates";
            setLocalError(msg);
            console.error(msg);
            return;
        }

        if (!validateForm()) return;

        setLocalError(null);

        const payload = {
            user: {
                id: user.id,
            },
            templateId: selectedTemplate.id,
            generatedText: editableMessage,
            placeholders: formData,
            mediaUrls: mediaUrls.filter(url => url.trim()),
            tags: tags.filter(tag => tag.trim()),
        };

        const token = `${user.tokenType} ${user.accessToken}`;
        console.log("🔐 Token being sent:", token);

        try {
            const response = await axiosFetch({
                axiosInstance: axios,
                method: "POST",
                url: "/progress-updates",
                data: payload,
                headers: {
                    Authorization: token,
                },
            });

            console.log("✅ Submission success:", response?.data);
            setSuccessMessage("Progress update posted successfully!");
            setFormData({});
            setMediaUrls([""]);
            setTags([""]);
            setEditableMessage("");

            // Navigate to another page after posting
            navigate("/progress-feed");
        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                error?.response?.statusText ||
                "An error occurred while posting the update.";

            console.error("❌ Submission error:", error);
            setLocalError(errMsg);
            setSuccessMessage(null);
        }
    };

    const handleTemplateChange = (e) => {
        const template = templates.find(t => t.id === e.target.value);
        if (template) {
            setSelectedTemplate(template);
            setFormData({});
            setLocalError(null);
        }
    };

    return (
        <div className="learning-progress">
            <h2>Post a Learning Progress Update</h2>

            {(localError || apiError) && (
                <div className="error-message">
                    {localError || apiError}
                    {(localError?.includes("Session expired") || apiError?.includes("Session expired")) && (
                        <button
                            onClick={() => navigate('/login')}
                            className="login-redirect-btn"
                        >
                            Go to Login
                        </button>
                    )}
                </div>
            )}

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="template-select">Choose a Template:</label>
                <select
                    id="template-select"
                    value={selectedTemplate.id}
                    onChange={handleTemplateChange}
                    className="template-select"
                >
                    {templates.map(template => (
                        <option key={template.id} value={template.id}>
                            {template.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                {selectedTemplate.placeholders.map(key => (
                    <div key={key} className="form-field">
                        <label htmlFor={`placeholder-${key}`}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </label>
                        <input
                            type="text"
                            id={`placeholder-${key}`}
                            value={formData[key] || ""}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            placeholder={`Enter ${key}`}
                            required
                        />
                    </div>
                ))}
            </div>

            <div className="form-group">
                <label>Media URLs:</label>
                {mediaUrls.map((url, index) => (
                    <div key={index} className="form-field-row">
                        <input
                            type="url"
                            value={url}
                            placeholder="https://example.com"
                            onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                            pattern="https?://.+" />
                        {mediaUrls.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeMediaUrl(index)}
                                className="remove-btn"
                                aria-label="Remove media URL"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addMediaUrl}
                    className="add-btn"
                >
                    + Add Media URL
                </button>
            </div>

            <div className="form-group">
                <label>Tags:</label>
                {tags.map((tag, index) => (
                    <div key={index} className="form-field-row">
                        <input
                            type="text"
                            value={tag}
                            placeholder="Enter tag"
                            onChange={(e) => handleTagChange(index, e.target.value)}
                        />
                        {tags.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="remove-btn"
                                aria-label="Remove tag"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addTag}
                    className="add-btn"
                >
                    + Add Tag
                </button>
            </div>

            <div className="form-group preview">
                <label>Edit Your Message:</label>
                <textarea
                    value={editableMessage}
                    onChange={(e) => setEditableMessage(e.target.value)}
                    rows={5}
                    className="editable-preview"
                    placeholder="Your message..."
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`submit-btn ${loading ? 'loading' : ''}`}
            >
                {loading ? (
                    <>
                        <span className="spinner"></span>
                        Posting...
                    </>
                ) : (
                    "Post Update"
                )}
            </button>
        </div>
    );
};

export default LearningProgress;
