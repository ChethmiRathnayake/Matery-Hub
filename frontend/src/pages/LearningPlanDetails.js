// src/pages/LearningPlanDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {useAuthContext} from "../hooks/useAuthContext";

const LearningPlanDetails = () => {
    const { user } = useAuthContext();
    const { id } = useParams(); // planId from URL
    const [plan, setPlan] = useState(null);
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`/plans/${id}`, {
                    headers: { 'Authorization': `${user.tokenType} ${user.accessToken}`, },
                });
                setPlan(res.data);
                // Initialize all items as unchecked
                const initialChecks = {};
                res.data.planItems.forEach((_, i) => {
                    initialChecks[i] = false;
                });
                setCheckedItems(initialChecks);
            } catch (err) {
                console.error("Failed to fetch plan details", err);
            }
        };

        fetchPlan();
    }, [id]);

    const handleCheck = (index) => {
        setCheckedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const totalItems = plan?.planItems.length || 0;
    const completedItems = Object.values(checkedItems).filter(Boolean).length;
    const progress = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;

    return (
        <div className="container mt-5">
            {plan ? (
                <div>
                    <h2>{plan.title}</h2>
                    <p>{plan.description}</p>
                    <p><strong>Created On:</strong> {new Date(plan.createdAt).toLocaleDateString()}</p>

                    <h4>Plan Items:</h4>
                    <ul className="list-group">
                        {plan.planItems.map((item, index) => (
                            <li key={index} className="list-group-item d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    className="form-check-input me-2"
                                    checked={checkedItems[index] || false}
                                    onChange={() => handleCheck(index)}
                                />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4">
                        <label htmlFor="progressBar">Progress: {progress}%</label>
                        <div className="progress">
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${progress}%` }}
                                aria-valuenow={progress}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {progress}%
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading plan...</p>
            )}
        </div>
    );
};

export default LearningPlanDetails;
