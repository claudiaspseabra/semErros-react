import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './styles/Login.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/app/users', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const users = await response.json();
                const user = users.find(
                    (u: { username: string; password: string }) =>
                        u.username === username && u.password === password
                );

                if (user) {
                    if (user.admin) {
                        navigate('/admin/' + user.userId);
                    } else {
                        navigate("/user/" + user.userId);
                    }
                } else {
                    setError('Username ou password inválido.');
                }
            } else {
                setError('Ocorreu um erro. Tente novamente mais tarde.');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError('Ocorreu um erro. Tente novamente mais tarde.');
        }
    }

    return (
        <div className='Login'>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                {error && <div className='error'>{error}</div>}
                <Button type="submit" disabled={!validateForm()}>
                    Login
                </Button>
            </Form>
        </div>
    );
}

export default Login;