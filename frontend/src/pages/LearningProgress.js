import React, { useState } from "react";
import "./LearningProgress.css";
import axios from "axios";

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
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [formData, setFormData] = useState({});
    const [mediaUrls, setMediaUrls] = useState([""]);
    const [tags, setTags] = useState([""]);

    // Handle dynamic inputs for placeholders
    const handleInputChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    // Handle media URLs array inputs
    const handleMediaUrlChange = (index, value) => {
        const newMediaUrls = [...mediaUrls];
        newMediaUrls[index] = value;
        setMediaUrls(newMediaUrls);
    };

    const addMediaUrl = () => {
        setMediaUrls((prev) => [...prev, ""]);
    };

    const removeMediaUrl = (index) => {
        setMediaUrls((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle tags array inputs
    const handleTagChange = (index, value) => {
        const newTags = [...tags];
        newTags[index] = value;
        setTags(newTags);
    };

    const addTag = () => {
        setTags((prev) => [...prev, ""]);
    };

    const removeTag = (index) => {
        setTags((prev) => prev.filter((_, i) => i !== index));
    };

    // Generate message by replacing placeholders in body
    const generateMessage = () => {
        let message = selectedTemplate.body;
        selectedTemplate.placeholders.forEach((key) => {
            const val = formData[key] || "...";
            message = message.replace(new RegExp(`{${key}}`, "g"), val);
        });
        return message;
    };

    const handleSubmit = async () => {
        const payload = {
            userId: 1, // Replace with actual user id
            templateId: selectedTemplate.id,
            placeholders: formData,
            mediaUrls: mediaUrls.filter((url) => url.trim() !== ""),
            tags: tags.filter((tag) => tag.trim() !== ""),
        };

        try {
            const response = await axios.post("http://localhost:1010/api/progress-updates", payload);
            console.log("Successfully posted:", response.data);
            alert("Learning progress update posted successfully!");

            setFormData({});
            setMediaUrls([""]);
            setTags([""]);
        } catch (error) {
            console.error("Post error:", error.response || error.message);
            alert(
                "Failed to post progress update: " +
                (error.response?.data?.message || error.message)
            );
        }
    };




    // Reset form data when template changes
    const handleTemplateChange = (e) => {
        const template = templates.find((t) => t.id === e.target.value);
        setSelectedTemplate(template);
        setFormData({});
    };

    return (
        <div className="learning-progress">
            <h2>Post a Learning Progress Update</h2>

            <label htmlFor="template-select">Choose a Template:</label>
            <select
                id="template-select"
                value={selectedTemplate.id}
                onChange={handleTemplateChange}
            >
                {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                        {template.title}
                    </option>
                ))}
            </select>

            <div className="input-group">
                {selectedTemplate.placeholders.map((key) => (
                    <div key={key} className="form-field">
                        <label htmlFor={`placeholder-${key}`}>{key}</label>
                        <input
                            type="text"
                            id={`placeholder-${key}`}
                            value={formData[key] || ""}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <div className="media-urls">
                <label>Media URLs:</label>
                {mediaUrls.map((url, index) => (
                    <div key={index} className="form-field-row">
                        <input
                            type="text"
                            value={url}
                            placeholder="Enter media URL"
                            onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                        />
                        <button type="button" onClick={() => removeMediaUrl(index)}>
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addMediaUrl}>
                    Add Media URL
                </button>
            </div>

            <div className="tags">
                <label>Tags:</label>
                {tags.map((tag, index) => (
                    <div key={index} className="form-field-row">
                        <input
                            type="text"
                            value={tag}
                            placeholder="Enter tag"
                            onChange={(e) => handleTagChange(index, e.target.value)}
                        />
                        <button type="button" onClick={() => removeTag(index)}>
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addTag}>
                    Add Tag
                </button>
            </div>

            <div className="generated-message">
                <label>Generated Message:</label>
                <p>{generateMessage()}</p>
            </div>

            <button onClick={handleSubmit}>Post Update</button>
        </div>
    );
};

export default LearningProgress;
