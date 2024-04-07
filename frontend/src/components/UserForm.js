import { useState } from "react"

const UserForm = () => {

    const [first_name, setFirst_name] = useState('')
    const [last_name, setLast_name] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return(
        <form className="create">
            <h3>Add New User</h3>

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

            <button>Add User</button>
        </form>
    )
}