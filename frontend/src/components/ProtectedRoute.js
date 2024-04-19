import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { hideLoading, showLoading } from "../redux/alertsSlice";


function ProtectedRoute(props) {
    //getting the email to the header
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getUser = async() => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/user/get-user-info-by-id',
                { token : localStorage.getItem('token') },
            {
                headers: {
                    Authorization : `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(hideLoading());
            if(response.data.success) {
                dispatch(setUser(response.data.data));
            } else {
                localStorage.clear();
                navigate("/login"); //if there is any token mistake
            }
        } catch (error){
            dispatch(hideLoading());
            localStorage.clear();
            navigate("/login"); //if there is any token mistake
        }
    }
    useEffect(() => {
        if (!user) {
            getUser()
        }
    }, [user])
    
    if(localStorage.getItem('token')) {
        return props.children
    } else {
        //when there is no token, it will always navigate to the login page
        return <Navigate to="/login"/>
    }
}

export default ProtectedRoute