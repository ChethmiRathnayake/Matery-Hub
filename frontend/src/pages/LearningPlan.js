import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import useAxios from "../hooks/useAxios";
import axios from "../api/axios";
import "./LearningPlan.css";

const LearningPlan = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { axiosFetch, error: apiError, loading } = useAxios();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: ""
    });
    const [planItems, setPlanItems] = useState([
        { topic: "", resourceLink: "", completed: false }
    ]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                navigate("/plans");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...planItems];
        newItems[index][field] = field === "completed" ? value === "true" : value;
        setPlanItems(newItems);
    };

    const addItem = () => {
        setPlanItems([...planItems, { topic: "", resourceLink: "", completed: false }]);
    };

    const removeItem = (index) => {
        if (planItems.length > 1) {
            const newItems = planItems.filter((_, i) => i !== index);
            setPlanItems(newItems);
        }
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError("Title is required");
            return false;
        }

        if (!formData.startDate || !formData.endDate) {
            setError("Start and end dates are required");
            return false;
        }

        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            setError("End date cannot be before start date");
            return false;
        }

        const emptyItems = planItems.filter(item => !item.topic.trim());
        if (emptyItems.length > 0) {
            setError("All topics must be filled in");
            return false;
        }

        setError(null);
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous messages
        setError(null);
        setSuccessMessage(null);

        // Basic validation
        if (!formData.title.trim()) {
            setError("Title is required");
            return;
        }

        try {
            const payload = {
                userId: user?.id,
                title: formData.title,
                description: formData.description,
                startDate: new Date(formData.startDate).toISOString().split('T')[0],
                endDate: new Date(formData.endDate).toISOString().split('T')[0],
                items: planItems.map(item => ({
                    topic: item.topic,
                    resourceLink: item.resourceLink,
                    completed: item.completed
                }))
            };

            const response = await axios.post('/plans', payload, {
                headers: {
                    'Authorization': `${user.tokenType} ${user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                setSuccessMessage("Plan created successfully!");
                // Reset form after 2 seconds
                setTimeout(() => {
                    setFormData({
                        title: "",
                        description: "",
                        startDate: "",
                        endDate: ""
                    });
                    setPlanItems([{ topic: "", resourceLink: "", completed: false }]);
                    navigate("/plans");
                }, 2000);
            }
        } catch (error) {
            console.error("Submission error:", error);
            const errorMsg = error.response?.data?.message ||
                "Failed to create learning plan. Please try again.";
            setError(errorMsg);
        }
    };

    return (
        <div className="learning-plan-container">
            <header className="learning-plan-header">
                <h2>Create Your Learning Plan</h2>
                <center><p className="subtitle">Organize your learning journey with clear goals and resources</p></center>
            </header>

            <form onSubmit={handleSubmit} className="learning-plan-form">
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

                <div className="plan-overview-section">
                    <div className="plan-overview-header">
                        <h3 className="plan-overview-title">Plan Overview</h3>
                    </div>

                    <div className="plan-overview-grid">
                        {/* Title Field */}
                        <div className="plan-overview-field">
                            <label className="plan-overview-label required">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g. Mastering React in 3 Months"
                                className="plan-overview-input"
                                required
                            />
                        </div>

                        {/* Description Field */}
                        <div className="plan-overview-field">
                            <label className="plan-overview-label">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Brief description of your learning goals"
                                className="plan-overview-input plan-overview-textarea"
                                rows="3"
                            />
                        </div>

                        {/* Start Date Field */}
                        <div className="plan-overview-field">
                            <label className="plan-overview-label required">Start Date</label>
                            <div className="date-input-container">
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="plan-overview-input"
                                    required
                                />
                                <svg className="date-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                                </svg>
                            </div>
                        </div>

                        {/* End Date Field */}
                        <div className="plan-overview-field">
                            <label className="plan-overview-label required">End Date</label>
                            <div className="date-input-container">
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="plan-overview-input"
                                    required
                                    min={formData.startDate}
                                />
                                <svg className="date-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <label className="form-label">Learning Items</label>
                    <div className="items-container">
                        {planItems.map((item, index) => (
                            <div key={index} className="item-card">
                                <div className="item-header">
                                    <h4>Item {index + 1}</h4>
                                    {planItems.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="remove-button"
                                            aria-label="Remove item"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                <div className="item-form">
                                    <div className="form-field">
                                        <label className="input-label">Topic*</label>
                                        <input
                                            type="text"
                                            value={item.topic}
                                            onChange={(e) => handleItemChange(index, "topic", e.target.value)}
                                            placeholder="e.g. React Hooks, State Management"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label className="input-label">Resource Link</label>
                                        <div className="input-with-icon">
                                            <svg className="link-icon" viewBox="0 0 24 24">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                            </svg>
                                            <input
                                                type="url"
                                                value={item.resourceLink}
                                                onChange={(e) => handleItemChange(index, "resourceLink", e.target.value)}
                                                placeholder="https://example.com/resource"
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label className="input-label">Status</label>
                                        <select
                                            value={item.completed ? "true" : "false"}
                                            onChange={(e) => handleItemChange(index, "completed", e.target.value)}
                                            className="form-input"
                                        >
                                            <option value="false">Not Started</option>
                                            <option value="true">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addItem}
                            className="add-button"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add Learning Item
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate("/plans")}
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
                                Creating Plan...
                            </>
                        ) : (
                            "Create Learning Plan"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LearningPlan;