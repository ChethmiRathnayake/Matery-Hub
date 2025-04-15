import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Home() {
    const { user } = useContext(AuthContext);
    console.log(user)
    return (
        <div>
            <h1>Welcome, {user?.username}</h1>
            <p>Email: {user?.email}</p>
        </div>
    );
}

export default Home;
