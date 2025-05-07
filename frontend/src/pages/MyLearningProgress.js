import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import "./MyLearningProgress.css";
import { format } from 'date-fns';

const MyLearningProgress = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTag, setFilterTag] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);

    const fetchPosts = async () => {
        if (!user?.accessToken) {
            navigate("/login");
            return;
        }

        try {
            const token = `${user.tokenType} ${user.accessToken}`;
            const response = await axios.get(`/progress-updates/user/${user.id}`, {
                headers: { Authorization: token },
                params: { userId: user.id }
            });
            setPosts(response.data);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
            setError("Could not fetch your progress updates. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const token = `${user.tokenType} ${user.accessToken}`;
            await axios.delete(`/progress-updates/${postToDelete}`, {
                headers: { Authorization: token }
            });
            setPosts(prev => prev.filter(p => p.id !== postToDelete));
            setSuccessMessage("Post deleted successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Delete failed:", err);
            setError("Failed to delete post. Please try again.");
        } finally {
            setShowConfirm(false);
            setPostToDelete(null);
        }
    };

    const confirmDelete = (id) => {
        setPostToDelete(id);
        setShowConfirm(true);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Get all unique tags for filtering
    const allTags = [...new Set(posts.flatMap(post => post.tags || []))];

    // Filter posts based on search term and selected tag
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.generatedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesTag = !filterTag || (post.tags && post.tags.includes(filterTag));

        return matchesSearch && matchesTag;
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your progress...</p>
            </div>
        );
    }

    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="my-progress-container">
            <header className="progress-header">
                <div className="header-content">
                    <h1>My Learning Journey</h1>
                    <p className="subtitle">Track and manage your progress updates</p>
                </div>
                <button
                    className="primary-button new-post-button"
                    onClick={() => navigate("/progress/new")}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Update
                </button>
            </header>

            <div className="controls-section">
                <div className="search-container">
                    <svg className="search-icon" width="12" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
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

            {filteredPosts.length === 0 ? (
                <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <h3>No updates found</h3>
                    <p>{searchTerm || filterTag ? "Try adjusting your search filters" : "Start by creating your first progress update"}</p>
                    <button
                        className="primary-button"
                        onClick={() => navigate("/progress/new")}
                    >
                        Create Your First Update
                    </button>
                </div>
            ) : (
                <div className="posts-grid">
                    {filteredPosts.map(post => (
                        <div key={post.id} className="post-card">
                            <div className="post-content">
                                <p className="post-text">{post.generatedText}</p>

                                {post.mediaUrls?.length > 0 && (
                                    <div className="media-preview">
                                        {post.mediaUrls.map((url, i) => (
                                            <a
                                                key={i}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="media-link"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                                </svg>
                                                Media {i + 1}
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {post.tags?.length > 0 && (
                                    <div className="tags-container">
                                        {post.tags.map((tag, i) => (
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

                                <div className="post-meta">
                                    <span className="post-date">
                                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                                    </span>
                                </div>
                            </div>

                            <div className="post-actions">
                                <button
                                    onClick={() => navigate(`/edit-progress/${post.id}`)}
                                    className="action-button edit-button"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => confirmDelete(post.id)}
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
                        <p>Are you sure you want to delete this progress update? This action cannot be undone.</p>

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

export default MyLearningProgress;