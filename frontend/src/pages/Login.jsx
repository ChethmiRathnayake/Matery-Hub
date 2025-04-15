import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:1010/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({ username, password }),
            });

            console.log((response.json()));


            if (response.ok) {
                setMessage("Login successful ✅");
            }
                // Fetch the user info after successful login
                // const userRes = await fetch("http://localhost:1010/auth/me", {
                //     method: "GET",
                //     credentials: "include"
                // });

            //     console.log(userRes);
            //     if (userRes.ok) {
            //         const userData = await userRes.json();
            //         setUser(userData); // Store user data in the parent component
            //         navigate("/home"); // Navigate after getting user data
            //     } else {
            //         setMessage("Failed to fetch user info");
            //     }
            // } else {
            //     const text = await response.text();
            //     setMessage(`Login failed: ${text}`);
            // }
        } catch (error) {
            setMessage("Login error: " + error.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input

                    placeholder="Email"

                    onChange={(e) => setUsername(e.target.value)}
                    required
                /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Login;
