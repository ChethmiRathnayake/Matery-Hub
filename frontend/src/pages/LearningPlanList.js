import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "../api/axios";
import { format } from 'date-fns';
import "./LearningPlanList.css";

const LearningPlanList = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTag, setFilterTag] = useState("");

    const fetchPlans = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const response = await axios.get(`/plans/user/${user.id}`, {
                headers: {
                    'Authorization': `${user.tokenType} ${user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setPlans(response.data);
        } catch (err) {
            console.error("Failed to fetch plans:", err);
            if (err.response?.status === 403) {
                setError("You don't have permission to view these plans. Please log in again.");
                // Optionally clear user data and redirect to login
                // localStorage.removeItem('user');
                // navigate('/login');
            } else {
                setError("Could not fetch your learning plans. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [user]); // Added user to dependency array

    const handleDelete = async () => {
        if (!planToDelete || !user) return;
        try {
            await axios.delete(`/plans/${planToDelete}`, {
                headers: {
                    'Authorization': `${user.tokenType} ${user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setPlans(prev => prev.filter(p => p.planId !== planToDelete));
            setSuccessMessage("Plan deleted successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Delete failed:", err);
            if (err.response?.status === 403) {
                setError("You don't have permission to delete this plan.");
            } else {
                setError("Failed to delete plan. Please try again.");
            }
        } finally {
            setShowConfirm(false);
            setPlanToDelete(null);
        }
    };

    const confirmDelete = (id) => {
        setPlanToDelete(id);
        setShowConfirm(true);
    };

    const calculateProgress = (items) => {
        if (!items || items.length === 0) return 0;
        const completed = items.filter(item => item.completed).length;
        return Math.round((completed / items.length) * 100);
    };

    // Get all unique tags for filtering
    const allTags = [...new Set(plans.flatMap(plan => plan.tags || []))];

    // Filter plans based on search term and selected tag
    const filteredPlans = plans.filter(plan => {
        const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (plan.tags && plan.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesTag = !filterTag || (plan.tags && plan.tags.includes(filterTag));

        return matchesSearch && matchesTag;
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your plans...</p>
            </div>
        );
    }

    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="learning-plan-list-container">
            <header className="progress-header">
                <div className="header-content">
                    <h1>My Learning Plans</h1>
                    <p className="subtitle">Organize and track your learning goals</p>
                </div>
                <button
                    className="primary-button new-post-button"
                    onClick={() => navigate("/plans/new")}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Plan
                </button>
            </header>

            <div className="controls-section">
                <div className="search-container">
                    <svg className="search-icon" width="12" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                </div>

                <div className="filter-container">
                    <select
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Tags</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredPlans.length === 0 ? (
                <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <h3>No plans found</h3>
                    <p>{searchTerm || filterTag ? "Try adjusting your search filters" : "Start by creating your first learning plan"}</p>
                    <button
                        className="primary-button"
                        onClick={() => navigate("/plans/new")}
                    >
                        Create Your First Plan
                    </button>
                </div>
            ) : (
                <div className="plans-grid">
                    {filteredPlans.map(plan => (
                        <div key={plan.planId} className="plan-card">
                            <div className="plan-header">
                                <h3>{plan.title}</h3>
                                {plan.tags?.length > 0 && (
                                    <div className="tags-container">
                                        {plan.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="tag"
                                                onClick={() => setFilterTag(tag)}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <p className="plan-description">{plan.description || "No description provided"}</p>

                            <div className="plan-dates">
                                <span>{format(new Date(plan.startDate), 'MMM d, yyyy')}</span>
                                <span>→</span>
                                <span>{format(new Date(plan.endDate), 'MMM d, yyyy')}</span>
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

                            <div className="plan-actions">
                                <button
                                    onClick={() => navigate(`/plans/${plan.planId}/edit`)}
                                    className="action-button edit-button"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => confirmDelete(plan.planId)}
                                    className="action-button delete-button"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this learning plan? This action cannot be undone.</p>

                        <div className="modal-actions">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="secondary-button"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="danger-button"
                            >
                                Delete
                            </button>
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

export default LearningPlanList;