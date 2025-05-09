import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuthContext } from "../hooks/useAuthContext";
import useAxios from "../hooks/useAxios";
import "./LearningProgress.css";

const templates = [
    {
        id: "completed_tutorial",
        title: "Completed Tutorial",
        placeholders: ["Tutorial Name", "Platform", "Topic", "Experience"],
        body: "I just completed {Tutorial Name} on {Platform}. I learned about {Topic} and found it {Experience}."
    },
    {
        id: "faced_challenge",
        title: "Faced a Challenge",
        placeholders: ["Topic", "Problem", "Solution"],
        body: "While learning {Topic}, I struggled with {Problem}. I solved it by {Solution}."
    },
    {
        id: "new_skill_learned",
        title: "Learned a New Skill",
        placeholders: ["Skill", "Resource", "Use Case"],
        body: "Today I learned how to {Skill} using {Resource}. I feel confident applying it to {Use Case}."
    }
];

const EditLearningProgress = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { axiosFetch, loading } = useAxios();

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({});
    const [mediaUrls, setMediaUrls] = useState([""]);
    const [tags, setTags] = useState([""]);
    const [editableMessage, setEditableMessage] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [urlErrors, setUrlErrors] = useState({});

    const generateMessage = useCallback(() => {
        if (!selectedTemplate) return "";
        return selectedTemplate.placeholders.reduce((msg, key) => {
            return msg.replace(new RegExp(`{${key}}`, "g"), formData[key] || "...");
        }, selectedTemplate.body);
    }, [selectedTemplate, formData]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = `${user.tokenType} ${user.accessToken}`;
                const response = await axios.get(`/progress-updates/${id}`, {
                    headers: { Authorization: token },
                });

                const data = response.data;
                const template = templates.find(t => t.id === data.templateId);

                setSelectedTemplate(template);
                setFormData(data.placeholders || {});
                setEditableMessage(data.generatedText);
                setMediaUrls(data.mediaUrls.length ? data.mediaUrls : [""]);
                setTags(data.tags.length ? data.tags : [""]);
            } catch (err) {
                setError("Failed to fetch post for editing.");
                console.error(err);
            }
        };

        if (user?.accessToken) {
            fetchPost();
        }
    }, [id, user]);

    useEffect(() => {
        if (selectedTemplate) {
            setEditableMessage(generateMessage());
        }
    }, [selectedTemplate, formData, generateMessage]);

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
        const updated = [...mediaUrls];
        updated[index] = value;
        setMediaUrls(updated);

        const isValid = /^https?:\/\/.+/.test(value.trim());
        setUrlErrors(prev => ({
            ...prev,
            [index]: value.trim() && !isValid ? "Invalid URL format" : null,
        }));
    };

    const addMediaUrl = () => setMediaUrls(prev => [...prev, ""]);
    const removeMediaUrl = (index) => {
        setMediaUrls(prev => prev.filter((_, i) => i !== index));
        setUrlErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[index];
            return newErrors;
        });
    };

    const handleTagChange = (index, value) => {
        const updated = [...tags];
        updated[index] = value;
        setTags(updated);
    };

    const addTag = () => setTags(prev => [...prev, ""]);
    const removeTag = (index) => setTags(prev => prev.filter((_, i) => i !== index));

    const validateForm = () => {
        if (!selectedTemplate) return false;

        const missingFields = selectedTemplate.placeholders.filter(
            key => !formData[key]?.trim()
        );

        if (missingFields.length > 0) {
            setError(`Please fill in: ${missingFields.join(", ")}`);
            return false;
        }

        const invalids = mediaUrls
            .map((url, i) => ({ index: i, url }))
            .filter(({ url }) => url.trim() && !/^https?:\/\/.+/.test(url));

        if (invalids.length > 0) {
            setUrlErrors(prev => {
                const updated = { ...prev };
                invalids.forEach(({ index }) => {
                    updated[index] = "Invalid URL format";
                });
                return updated;
            });
            setError("Please correct the highlighted URL fields.");
            return false;
        }

        setUrlErrors({});
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const token = `${user.tokenType} ${user.accessToken}`;
        const payload = {
            templateId: selectedTemplate.id,
            placeholders: formData,
            generatedText: editableMessage,
            mediaUrls: mediaUrls.filter(url => url.trim()),
            tags: tags.filter(tag => tag.trim()),
        };

        try {
            const response = await axiosFetch({
                axiosInstance: axios,
                method: "PUT",
                url: `/progress-updates/${id}`,
                data: payload,
                headers: { Authorization: token },
            });

            console.log("✅ Edit successful:", response?.data);
            setSuccessMessage("Post updated successfully!");
            setTimeout(() => navigate("/progress"), 2000);
        } catch (err) {
            console.error("❌ Edit failed:", err);
            setError(err.response?.data?.message || "Failed to update the post.");
        }
    };

    if (!selectedTemplate) {
        return (
            <div className="learning-container">
                <div className="loading-spinner">Loading post data...</div>
            </div>
        );
    }

    return (
        <div className="learning-container">
            <header className="learning-header">
                <h1>MasteryHub</h1>
                <h2>Edit Your Learning Progress</h2>
                <p className="subtitle">Update your learning journey with the community</p>
            </header>

            <div className="progress-form">
                {(error) && (
                    <div className="alert error">
                        {error}
                        {error?.includes("Session expired") && (
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
                    <label className="form-label">Template</label>
                    <div className="template-card active">
                        <h3>{selectedTemplate.title}</h3>
                        <p className="template-preview">
                            {selectedTemplate.body.replace(/{[^}]+}/g, "[...]")}
                        </p>
                    </div>
                </div>

                <div className="form-grid">
                    {selectedTemplate.placeholders.map(key => (
                        <div key={key} className="form-field">
                            <label className="input-label">
                                {key.split(/(?=[A-Z])/).join(' ')}
                            </label>
                            <input
                                type="text"
                                value={formData[key] || ""}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                placeholder={`e.g. ${key === 'experience' ? 'challenging/rewarding' : 'Enter ' + key}`}
                                className="form-input"
                            />
                        </div>
                    ))}
                </div>

                <div className="form-section">
                    <label className="form-label">Media Attachments</label>
                    <div className="media-container">
                        {mediaUrls.map((url, index) => (
                            <div key={index} className="media-input-group">
                                <div className="input-with-icon">
                                    <svg className="link-icon" viewBox="0 0 24 24">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                                        placeholder="https://example.com/screenshot.jpg"
                                        className={`form-input ${urlErrors[index] ? 'error' : ''}`}
                                    />
                                    {mediaUrls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMediaUrl(index)}
                                            className="remove-button"
                                            aria-label="Remove media URL"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                {urlErrors[index] && (
                                    <span className="error-message">{urlErrors[index]}</span>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addMediaUrl}
                            className="add-button"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add Another URL
                        </button>
                    </div>
                </div>

                <div className="form-section">
                    <label className="form-label">Tags</label>
                    <div className="tags-container">
                        {tags.map((tag, index) => (
                            <div key={index} className="tag-input-group">
                                <div className="input-with-icon">
                                    <svg className="tag-icon" viewBox="0 0 24 24">
                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                        <line x1="7" y1="7" x2="7.01" y2="7" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={tag}
                                        onChange={(e) => handleTagChange(index, e.target.value)}
                                        placeholder="e.g. JavaScript, React"
                                        className="form-input"
                                    />
                                    {tags.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTag(index)}
                                            className="remove-button"
                                            aria-label="Remove tag"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addTag}
                            className="add-button"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add Another Tag
                        </button>
                    </div>
                </div>

                <div className="form-section">
                    <label className="form-label">Your Progress Message</label>
                    <div className="message-preview">
                        <textarea
                            value={editableMessage}
                            onChange={(e) => setEditableMessage(e.target.value)}
                            rows={4}
                            className="message-textarea"
                            placeholder="Your learning story will appear here..."
                        />
                        <div className="character-count">
                            {editableMessage.length}/500 characters
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="submit-button"
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Updating Your Post...
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                            Update Post
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default EditLearningProgress;