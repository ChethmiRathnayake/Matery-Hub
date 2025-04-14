import React, { useEffect, useState } from 'react';

const App = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '' });

    // Load users
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch('http://localhost:1010/api/users');
        const data = await res.json();
        setUsers(data);
    };

    const handleCreate = async () => {
        await fetch('http://localhost:1010/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        setForm({ name: '', email: '' });
        fetchUsers();
    };

    const handleDelete = async (id) => {
        await fetch(`http://localhost:1010/api/users/${id}`, {
            method: 'DELETE',
        });
        fetchUsers();
    };

    return (
        <div>
            <h2>User CRUD</h2>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <button onClick={handleCreate}>Add User</button>

            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} ({user.email}) <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
