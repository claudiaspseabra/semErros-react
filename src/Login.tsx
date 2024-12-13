import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation after login
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./styles/Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // For error messages
    const navigate = useNavigate(); // Hook for navigation

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            // Send the username and password to get the user details from the server
            const response = await fetch("http://localhost:8080/app/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const users = await response.json();
                // Find the user with the matching username and password
                const user = users.find(
                    (u: { username: string; password: string }) =>
                        u.username === username && u.password === password
                );

                if (user) {
                    // Check if the user is an admin and navigate accordingly
                    if (user.admin) {
                        navigate("/admin");
                    } else {
                        navigate("/user");
                    }
                } else {
                    setError("Invalid username or password.");
                }
            } else {
                setError("Something went wrong. Please try again later.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again later.");
        }
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                {error && <div className="error">{error}</div>}
                <Button type="submit" disabled={!validateForm()}>
                    Login
                </Button>
            </Form>
        </div>
    );
}

export default Login;
