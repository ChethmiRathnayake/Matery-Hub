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

        if (!user?.accessToken) {
            setError("You need to be logged in to create a plan");
            return;
        }

        if (!validateForm()) return;

        const payload = {
            userId: user.id,
            title: formData.title,
            description: formData.description,
            startDate: formData.startDate,
            endDate: formData.endDate,
            items: planItems.map(item => ({
                topic: item.topic,
                resourceLink: item.resourceLink,
                completed: item.completed
            }))
        };

        try {
            const response = await axiosFetch({
                axiosInstance: axios,
                method: "POST",
                url: "/plans",
                data: payload,
                headers: {
                    Authorization: `${user.tokenType} ${user.accessToken}`,
                },
            });

            setSuccessMessage("Learning plan created successfully!");
            setFormData({
                title: "",
                description: "",
                startDate: "",
                endDate: ""
            });
            setPlanItems([{ topic: "", resourceLink: "", completed: false }])
            navigate("/plans");
        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                error?.response?.statusText ||
                "An error occurred while creating the plan.";
            setError(errMsg);
        }
    };

    return (
        <div className="learning-plan-container">
            <header className="learning-plan-header">
                <h2>Create Your Learning Plan</h2>
                <p className="subtitle">Organize your learning journey with clear goals and resources</p>
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

                <div className="form-section">
                    <label className="form-label">Plan Overview</label>
                    <div className="form-grid">
                        <div className="form-field">
                            <label className="input-label">Title*</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g. Mastering React in 3 Months"
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label className="input-label">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Brief description of your learning goals"
                                className="form-input"
                                rows="3"
                            />
                        </div>
                        <div className="form-field">
                            <label className="input-label">Start Date*</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label className="input-label">End Date*</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
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