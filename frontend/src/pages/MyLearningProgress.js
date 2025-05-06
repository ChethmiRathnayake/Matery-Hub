import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import "./MyLearningProgress.css";

const MyLearningProgress = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

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
            setError("Could not fetch progress updates.");
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
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete post.");
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

    if (loading) return <p>Loading your progress...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="my-progress">
            <h2>Your Progress Updates</h2>
            {posts.length === 0 ? (
                <p>No updates yet. Go post something awesome!</p>
            ) : (
                <ul className="progress-list">
                    {posts.map(post => (
                        <li key={post.id} className="progress-item">
                            <p className="generated-text">{post.generatedText}</p>
                            {post.mediaUrls?.map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                    [Media {i + 1}]
                                </a>
                            ))}
                            {post.tags?.length > 0 && (
                                <div className="tags">
                                    {post.tags.map((tag, i) => (
                                        <span key={i} className="tag">{tag}</span>
                                    ))}
                                </div>
                            )}
                            <div className="actions">
                                <button onClick={() => navigate(`/edit-progress/${post.id}`)}>Edit</button>
                                <button onClick={() => confirmDelete(post.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>Are you sure you want to delete this post?</p>
                        <div className="modal-actions">
                            <button onClick={handleDelete} className="btn confirm">Yes, Delete</button>
                            <button onClick={() => setShowConfirm(false)} className="btn cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

};

export default MyLearningProgress;
