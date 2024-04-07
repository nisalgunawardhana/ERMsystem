import { useEffect } from "react"
import { useUsersContext } from "../hooks/useUsersContext"

//components
import UserDetails from '../components/UserDetails'
import UserForm from '../components/UserForm'

const UserHome = () => {
    const {users, dispatch} = useUsersContext()

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:8080//users')
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_USERS', payload: json})
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