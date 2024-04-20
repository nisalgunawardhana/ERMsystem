import React from 'react'
import { Navigate } from "react-router-dom"

function PublicRoute(props) {
    //when theres a token already, it will always navigate to the homepage
    if(localStorage.getItem('token')) {
        return <Navigate to="/"/>
    } else {
        return props.children
    }
}

export default PublicRoute;