import React, { useState } from "react";
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

const LearningProgress = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [formData, setFormData] = useState({});

    const handleInputChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const generateMessage = () => {
        let message = selectedTemplate.body;
        selectedTemplate.placeholders.forEach((key) => {
            message = message.replace(`{${key}}`, formData[key] || "...");
        });
        return message;
    };

    const handleSubmit = () => {
        const payload = {
            userId: 1, // replace with logged-in user ID
            templateId: selectedTemplate.id,
            placeholders: formData,
            mediaUrls: [],
            tags: []
        };
        console.log("Submit Payload:", payload);
        // Use fetch or axios to POST this to your backend
    };

    return (
        <div className="learning-progress">
            <h2>Post a Learning Progress Update</h2>

            <label>Choose a Template:</label>
            <select
                onChange={(e) => {
                    const template = templates.find((t) => t.id === e.target.value);
                    setSelectedTemplate(template);
                    setFormData({});
                }}
                value={selectedTemplate.id}
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
                        <label>{key}</label>
                        <input
                            type="text"
                            value={formData[key] || ""}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                        />
                    </div>
                ))}
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
