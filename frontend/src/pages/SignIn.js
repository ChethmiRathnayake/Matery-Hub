import {useEffect, useState} from "react";
import {useLogin} from "../hooks/useLogin";
import { useNavigate} from "react-router-dom";
import {useAuthContext} from "../hooks/useAuthContext";

const SignIn= () => {
    const navigate = useNavigate();
    const {login,error,isLoading}=useLogin()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {user} = useAuthContext()




const handleLogin = async (e) => {
    e.preventDefault();

    await login(username, password)
    console.log("cam in here")
    console.log(error)
    if (!error) {
        setUsername("");
        setPassword("");

    }
}


// Redirect after login success
    useEffect(() => {
        if (user) {
            const roles = user.roles;

            console.log(roles)
            console.log(roles.includes('ROLE_USER'))
            if (roles.includes('ROLE_ADMIN')) {
                navigate('/admin');
            } else if (roles.includes('ROLE_USER')) {
                navigate('/home');
            } else {
                navigate('/'); // fallback
            }
        }
    }, [user, navigate]);



    // try {
    //     const response = await fetch("http://localhost:1010/auth/login", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //
    //         body: JSON.stringify({ username, password }),
    //     });
    //
    //     console.log((response.json()));
    //     console.log((response.headers));
    //
    //     if (response.ok) {
    //         setMessage("Login successful ✅");
    //     }
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
//     } catch (error) {
//         setMessage("Login error: " + error.message);
//     }
// };


    return (
        <div className="login-container" style={styles.container}>
            <form onSubmit={handleLogin} style={styles.form}>
                <h2 style={styles.heading}>Login</h2>

                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={styles.input}
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <button disabled={isLoading} style={styles.button}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>

                {error && <div style={styles.error}>{error}</div>}
            </form>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '100px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        padding: '30px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
    },
    heading: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    input: {
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    button: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginTop: '10px',
        textAlign: 'center',
    },
}

export default SignIn;


