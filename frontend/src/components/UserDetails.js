const UserDetails = ({ user }) => {
    return (
        <div className="user-Details">
            <h4>{user.first_name}</h4>
            <p>okay bye</p>
            <p><strong>First Name: </strong>{user.first_name}</p>
            <p><strong>Last Name: </strong>{user.last_name}</p>
            <p><strong>Email: </strong>{user.email}</p>
            <p>{user.createdAt}</p>
        </div>
    )
}

export default UserDetails