import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import useAxios from "../hooks/useAxios";
import axios from "../api/axios";
import "./LearningPlanList.css";

const LearningPlanList = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { axiosFetch, error: apiError, loading } = useAxios();
    const [plans, setPlans] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (!user?.id) return;

        const fetchPlans = async () => {
            try {
                const response = await axiosFetch({
                    axiosInstance: axios,
                    method: "GET",
                    url: `/api/plans/user/${user.id}`,
                    headers: {
                        Authorization: `${user.tokenType} ${user.accessToken}`,
                    },
                });
                setPlans(response.data);
            } catch (error) {
                console.error("Failed to fetch plans:", error);
            }
        };

        fetchPlans();
    }, [user, axiosFetch]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleDelete = async (planId) => {
        if (window.confirm("Are you sure you want to delete this plan?")) {
            try {
                await axiosFetch({
                    axiosInstance: axios,
                    method: "DELETE",
                    url: `/api/plans/${planId}`,
                    headers: {
                        Authorization: `${user.tokenType} ${user.accessToken}`,
                    },
                });
                setPlans(plans.filter(plan => plan.planId !== planId));
                setSuccessMessage("Plan deleted successfully");
            } catch (error) {
                console.error("Failed to delete plan:", error);
            }
        }
    };

    const calculateProgress = (items) => {
        if (!items || items.length === 0) return 0;
        const completed = items.filter(item => item.completed).length;
        return Math.round((completed / items.length) * 100);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="learning-plan-list-container">
            <header className="learning-plan-header">
                <h2>Your Learning Plans</h2>
                <p className="subtitle">Track and manage your learning journeys</p>
                <button
                    onClick={() => navigate("/plans/new")}
                    className="create-button"
                >
                    + Create New Plan
                </button>
            </header>

            {successMessage && (
                <div className="alert success">
                    {successMessage}
                </div>
            )}

            {apiError && (
                <div className="alert error">
                    {apiError}
                </div>
            )}

            {loading && plans.length === 0 ? (
                <div className="loading-spinner">
                    <span className="spinner"></span>
                    Loading your plans...
                </div>
            ) : plans.length === 0 ? (
                <div className="empty-state">
                    <svg viewBox="0 0 24 24" width="48" height="48">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <h3>No Learning Plans Yet</h3>
                    <p>Start by creating your first learning plan to organize your goals</p>
                    <button
                        onClick={() => navigate("/plans/new")}
                        className="primary-button"
                    >
                        Create Your First Plan
                    </button>
                </div>
            ) : (
                <div className="plans-grid">
                    {plans.map(plan => (
                        <div key={plan.planId} className="plan-card">
                            <div className="plan-header">
                                <h3>{plan.title}</h3>
                                <div className="plan-actions">
                                    <button
                                        onClick={() => navigate(`/plans/${plan.planId}/edit`)}
                                        className="icon-button"
                                        title="Edit"
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan.planId)}
                                        className="icon-button"
                                        title="Delete"
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p className="plan-description">{plan.description || "No description"}</p>
                            <div className="plan-dates">
                                <span>{formatDate(plan.startDate)}</span>
                                <span>→</span>
                                <span>{formatDate(plan.endDate)}</span>
                            </div>
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${calculateProgress(plan.items)}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">
                                    {calculateProgress(plan.items)}% Complete
                                </span>
                            </div>
                            <div className="plan-footer">
                                <span className="items-count">
                                    {plan.items?.length || 0} learning items
                                </span>
                                <Link
                                    to={`/plans/${plan.planId}`}
                                    className="view-link"
                                >
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LearningPlanList;