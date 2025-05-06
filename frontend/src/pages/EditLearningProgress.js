import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuthContext } from "../hooks/useAuthContext";
import useAxios from "../hooks/useAxios";
import "./LearningProgress.css";

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

    const handleInputChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleMediaUrlChange = (index, value) => {
        const updated = [...mediaUrls];
        updated[index] = value;
        setMediaUrls(updated);
    };

    const addMediaUrl = () => setMediaUrls(prev => [...prev, ""]);
    const removeMediaUrl = (index) => setMediaUrls(prev => prev.filter((_, i) => i !== index));

    const handleTagChange = (index, value) => {
        const updated = [...tags];
        updated[index] = value;
        setTags(updated);
    };

    const addTag = () => setTags(prev => [...prev, ""]);
    const removeTag = (index) => setTags(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = async () => {
        if (!selectedTemplate) return;

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
            setError("Failed to update the post.");
        }
    };

    if (!selectedTemplate) return <div>Loading template...</div>;

    return (
        <div className="learning-progress">
            <h2>Edit Your Progress Post</h2>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {selectedTemplate.placeholders.map(key => (
                <div key={key} className="form-field">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <input
                        type="text"
                        value={formData[key] || ""}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                </div>
            ))}

            <div className="form-group">
                <label>Media URLs:</label>
                {mediaUrls.map((url, index) => (
                    <div key={index} className="form-field-row">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                        />
                        {mediaUrls.length > 1 && (
                            <button type="button" onClick={() => removeMediaUrl(index)}>×</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addMediaUrl}>+ Add Media URL</button>
            </div>

            <div className="form-group">
                <label>Tags:</label>
                {tags.map((tag, index) => (
                    <div key={index} className="form-field-row">
                        <input
                            type="text"
                            value={tag}
                            onChange={(e) => handleTagChange(index, e.target.value)}
                        />
                        {tags.length > 1 && (
                            <button type="button" onClick={() => removeTag(index)}>×</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addTag}>+ Add Tag</button>
            </div>

            <div className="form-group preview">
                <label>Edit Message:</label>
                <textarea
                    rows={5}
                    value={editableMessage}
                    onChange={(e) => setEditableMessage(e.target.value)}
                    rows={5}
                    className="editable-preview"
                    placeholder="Your message..."
                />
            </div>

            <button onClick={handleSubmit} disabled={loading} className={`submit-btn ${loading ? 'loading' : ''}`}>
                {loading ? 'Updating...' : 'Update Post'}
            </button>
        </div>
    );
};

export default EditLearningProgress;