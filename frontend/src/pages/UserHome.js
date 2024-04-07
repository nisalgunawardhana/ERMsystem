import { useEffect, useState } from "react"

//components
import UserDetails from '../components/UserDetails'

const UserHome = () => {
    const [users, setUsers] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/users')
            const json = await response.json()

            if (response.ok) {
                setUsers(json)
            }
        }

        fetchUsers()
    }, []) //only fire once - (when the component first renders)

    return (
        <div className="userHome">
            <h2>System Users</h2>
            <div className="users">
               {users && users.map((user) => (
                    <UserDetails key={user._id} user={user}/>
               ))} 
            </div> 
        </div>
    )
}

export default UserHome