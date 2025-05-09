import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./LearningProgressFeed.css";
import { format } from 'date-fns';
import { FiSearch, FiHeart, FiMessageSquare, FiShare2, FiMoreHorizontal } from 'react-icons/fi';

const LearningProgressFeed = () => {
    const { user } = useContext(AuthContext);
    const [progressUpdates, setProgressUpdates] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTag, setFilterTag] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:1010/api/progress-updates");
                const data = await response.json();
                setProgressUpdates(data);
            } catch (error) {
                console.error("Failed to fetch progress updates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUpdates();
    }, []);

    // Get all unique tags for filtering
    const allTags = [...new Set(progressUpdates.flatMap(update => update.tags || []))];

    // Filter updates based on search term and selected tag
    const filteredUpdates = progressUpdates.filter(update => {
        const matchesSearch = update.generatedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (update.tags && update.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesTag = !filterTag || (update.tags && update.tags.includes(filterTag));

        return matchesSearch && matchesTag;
    });

    const formatDate = (dateStr) => {
        return format(new Date(dateStr), 'MMM d, yyyy, h:mm a');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading updates...</p>
            </div>
        );
    }

    return (
        <div className="user-page">
            <header className="page-header">
                <h1 className="page-title">MasteryHub</h1>
                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search updates, plans, users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </header>

            <main className="main-content">
                <div className="feed-controls">
                    <h2 className="feed-title">Learning Progress Feed</h2>
                    <div className="filter-container">
                        <select
                            value={filterTag}
                            onChange={(e) => setFilterTag(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Tags</option>
                            {allTags.map(tag => (
                                <option key={tag} value={tag}>#{tag}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {filteredUpdates.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No updates found</h3>
                        <p>{searchTerm || filterTag ? "Try adjusting your search filters" : "Be the first to share your progress!"}</p>
                    </div>
                ) : (
                    <div className="feed-list">
                        {filteredUpdates.map((update) => (
                            <div key={update.progressId} className="update-card">
                                <div className="card-header">
                                    <div className="user-info">
                                        <div className="avatar">{update.username?.charAt(0).toUpperCase() || 'A'}</div>
                                        <div>
                                            <p className="username">@{update.username || "anonymous"}</p>
                                            <p className="post-date">{formatDate(update.createdAt)}</p>
                                        </div>
                                    </div>
                                    <button className="more-button">
                                        <FiMoreHorizontal />
                                    </button>
                                </div>

                                <div className="card-body">
                                    <p className="update-text">{update.generatedText}</p>

                                    {update.mediaUrls?.length > 0 && (
                                        <div className="media-links">
                                            {update.mediaUrls.map((url, i) => (
                                                <a
                                                    key={i}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="media-link"
                                                >
                                                    <FiShare2 className="link-icon" />
                                                    <span>{url}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="card-footer">
                                    <div className="tags-container">
                                        {update.tags?.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="tag"
                                                onClick={() => setFilterTag(tag)}
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="action-buttons">
                                        <button className="action-button">
                                            <FiHeart />
                                            <span>Like</span>
                                        </button>
                                        <button className="action-button">
                                            <FiMessageSquare />
                                            <span>Comment</span>
                                        </button>
                                        <button className="action-button">
                                            <FiShare2 />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default LearningProgressFeed;