import React, { useState, useEffect, useCallback } from "react";
import "./LearningProgress.css";
import axios from "../api/axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";

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
    const [urlErrors, setUrlErrors] = useState({});

    const generateMessage = useCallback(() => {
        return selectedTemplate.placeholders.reduce((msg, key) => {
            return msg.replace(new RegExp(`{${key}}`, "g"), formData[key] || "...");
        }, selectedTemplate.body);
    }, [selectedTemplate, formData]);

    useEffect(() => {
        setEditableMessage(generateMessage());
    }, [generateMessage]);

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
        const newUrls = [...mediaUrls];
        newUrls[index] = value;
        setMediaUrls(newUrls);

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
        const newTags = [...tags];
        newTags[index] = value;
        setTags(newTags);
    };

    const addTag = () => setTags(prev => [...prev, ""]);
    const removeTag = (index) => setTags(prev => prev.filter((_, i) => i !== index));

    const validateForm = () => {
        const missingFields = selectedTemplate.placeholders.filter(
            key => !formData[key]?.trim()
        );

        if (missingFields.length > 0) {
            setLocalError(`Please fill in: ${missingFields.join(", ")}`);
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
            setLocalError("Please correct the highlighted URL fields.");
            return false;
        }

        setUrlErrors({});
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
            userId: user.id,
            templateId: selectedTemplate.id,
            generatedText: editableMessage,
            placeholders: formData,
            mediaUrls: mediaUrls.filter(url => url.trim()),
            tags: tags.filter(tag => tag.trim()),
        };

        console.log(payload)
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

            navigate("/progress");
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
        <div className="learning-container">
            <header className="learning-header">
                <h2>Share Your Learning Journey</h2>
                <p className="subtitle">Document and celebrate your progress with the community</p>
            </header>

            <div className="progress-form">
                {(localError || apiError) && (
                    <div className="alert error">
                        {localError || apiError}
                        {(localError?.includes("Session expired") || apiError?.includes("Session expired")) && (
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
                    <label className="form-label">Template Selection</label>
                    <div className="template-selector">
                        {templates.map(template => (
                            <button
                                key={template.id}
                                className={`template-card ${selectedTemplate.id === template.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedTemplate(template);
                                    setFormData({});
                                }}
                            >
                                <h3>{template.title}</h3>
                                <p className="template-preview">
                                    {template.body.replace(/{[^}]+}/g, "[...]")}
                                </p>
                            </button>
                        ))}
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
                                placeholder={`e.g. ${key === 'Experience' ? 'Challenging/Rewarding' : 'Enter ' + key}`}
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
                            Sharing Your Progress...
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                            Share With Community
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default LearningProgress;