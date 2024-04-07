import React, { useState } from "react";

const UserForm = () => {
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = { first_name, last_name, email, password }; // Define the user object here

        try {
            const response = await fetch('/userRoutes', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const json = await response.json();
                setError(json.error);
            } else {
                const json = await response.json();
                setFirst_name('');
                setLast_name('');
                setEmail('');
                setPassword('');
                setError(null);
                console.log('New User Added', json);
            }
        } catch (error) {
            setError('An error occurred while processing your request.');
            console.error('Error:', error);
        }
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add New System User</h3>

            <label>First Name : </label>
            <input
                type="text"
                onChange={(e) => setFirst_name(e.target.value)}
                value={first_name}
            />

            <label>Last Name : </label>
            <input
                type="text"
                onChange={(e) => setLast_name(e.target.value)}
                value={last_name}
            />

            <label>Email : </label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />

            <label>Password : </label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />

            <button type="submit">Add User</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default UserForm;