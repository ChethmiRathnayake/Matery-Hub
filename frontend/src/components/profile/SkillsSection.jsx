// src/components/profile/SkillsSection.js
import React, { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "../../api/axios";

const SkillsSection = ({ skills = [], isOwnProfile, onUpdate }) => {
    const { user } = useAuthContext();
    const [editMode, setEditMode] = useState(false);
    const [editedSkills, setEditedSkills] = useState([...skills]);
    const [newSkill, setNewSkill] = useState("");

    const handleAdd = () => {
        if (newSkill.trim() === "") return;
        const updated = [...editedSkills, newSkill.trim()];
        updateSkills(updated);
        setNewSkill("");
    };

    const handleDelete = (index) => {
        const updated = editedSkills.filter((_, i) => i !== index);
        updateSkills(updated);
    };

    const updateSkills = async (updatedList) => {
        try {
            const response = await axios.put(
                "/user-profiles/me",
                { skills: updatedList },
                {
                    headers: {
                        Authorization: `${user.tokenType} ${user.accessToken}`,
                    },
                }
            );
            setEditedSkills(response.data.skills);
            onUpdate?.();
        } catch (error) {
            console.error("Failed to update skills:", error);
        }
    };

    return (
        <div className="bg-neutral-100 rounded-2xl shadow p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Skills</h2>
                {isOwnProfile && (
                    <button onClick={() => setEditMode(!editMode)} className="text-blue-500 hover:text-blue-700">
                        <Pencil size={18} />
                    </button>
                )}
            </div>

            <ul className="flex flex-wrap gap-3">
                {editedSkills.map((skill, index) => (
                    <li key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-sm">
                        {skill}
                        {editMode && (
                            <button onClick={() => handleDelete(index)} className="ml-2 text-red-500 hover:text-red-700">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {editMode && (
                <div className="flex items-center mt-4 gap-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="border rounded px-3 py-1 w-1/3"
                        placeholder="Add new skill"
                    />
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-1 bg-grey-100 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
            )}
        </div>
    );
};

export default SkillsSection;
