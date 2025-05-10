import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { FiExternalLink, FiCalendar, FiCheckCircle } from "react-icons/fi";
import { format } from 'date-fns';
import "./LearningPlanDetails.css";

const LearningPlanDetails = () => {
    const { user } = useAuthContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(`http://localhost:1010/api/plans/${id}`, {
                    headers: {
                        'Authorization': `${user.tokenType} ${user.accessToken}`,
                    },
                    timeout: 5000
                });
                setPlan(res.data);
            } catch (err) {
                console.error("Failed to fetch plan details", err);
                setError(err.response?.data?.message || "Failed to load plan details");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPlan();
        }
    }, [id, user]);

    const handleCheckboxChange = async (itemId, currentStatus) => {
        try {
            const response = await axios.patch(
                `http://localhost:1010/api/plans/${id}/items/${itemId}`,
                { completed: !currentStatus },
                {
                    headers: {
                        'Authorization': `${user.tokenType} ${user.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update local state
            setPlan(prevPlan => ({
                ...prevPlan,
                items: prevPlan.items.map(item =>
                    item.itemId === itemId ? { ...item, completed: !currentStatus } : item
                )
            }));
        } catch (error) {
            console.error("Failed to update item status:", error);
            // Show error to user
            setError("Failed to update item status. Please try again.");
        }
    };

// Helper function
    const calculateCompletionPercentage = (items) => {
        if (!items || items.length === 0) return 0;
        const completed = items.filter(item => item.completed).length;
        return Math.round((completed / items.length) * 100);
    };

    const calculateProgress = () => {
        if (!plan?.items || plan.items.length === 0) return 0;
        const completed = plan.items.filter(item => item.completed).length;
        return Math.round((completed / plan.items.length) * 100);
    };

    const progress = calculateProgress();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading plan details...</p>
            </div>
        );
    }

    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="learning-plan-detail-container">
            {plan && (
                <div className="plan-card">
                    <div className="plan-header">
                        <h2>{plan.title}</h2>
                        <button
                            className="back-button"
                            onClick={() => navigate(-1)}
                        >
                            ← Back to Plans
                        </button>
                    </div>

                    <div className="plan-body">
                        <p className="plan-description">{plan.description}</p>

                        <div className="date-container">
                            <div className="date-item">
                                <FiCalendar className="date-icon" />
                                <span><strong>Start:</strong> {format(new Date(plan.startDate), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="date-item">
                                <FiCalendar className="date-icon" />
                                <span><strong>End:</strong> {format(new Date(plan.endDate), 'MMM d, yyyy')}</span>
                            </div>
                        </div>

                        <div className="progress-section">
                            <div className="progress-header">
                                <h4>Progress</h4>
                                <span className="progress-badge">
                  {plan.items.filter(item => item.completed).length}/{plan.items.length} completed
                </span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progress}%` }}
                                >
                                    {progress}%
                                </div>
                            </div>
                        </div>

                        <h4 className="plan-items-title">Learning Items</h4>
                        <div className="plan-items-list">
                            {plan.items.map((item, index) => (
                                <div
                                    key={item.itemId}
                                    className={`plan-item ${item.completed ? 'completed' : ''}`}
                                >
                                    <div className="item-content">
                                        <input
                                            type="checkbox"
                                            checked={item.completed || false}
                                            onChange={() => handleCheckboxChange(item.itemId, item.completed)}
                                            className="item-checkbox"
                                        />
                                        <div className="item-details">
                                            <div className="item-title">
                                                <h5 className={item.completed ? 'completed' : ''}>
                                                    {item.topic}
                                                </h5>
                                                {item.completed && (
                                                    <FiCheckCircle className="check-icon" />
                                                )}
                                            </div>
                                            {item.resourceLink && (
                                                <a
                                                    href={item.resourceLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="resource-link"
                                                >
                                                    <FiExternalLink className="link-icon" />
                                                    Resource Link
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="notification success">
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default LearningPlanDetails;