import React from 'react'
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
import loginImage from '../images/login.jpg'
import { toast } from "react-hot-toast"
import axios from "axios"
import { useDispatch } from "react-redux"
import { hideLoading, showLoading } from '../redux/alertsSlice';
import './Login.css'

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async(values) => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/user/login', values)
            dispatch(hideLoading())

            if (response.data.success) {
                toast.success(response.data.message)
                toast("Redirecting to Homepage")
                //putting the information gettting from the backend to the local storage
                localStorage.setItem("token", response.data.data)
                navigate("/")
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            dispatch(hideLoading())
            toast.error('Something went wrong')
        }
    }

    return (
        <div className='login-container'>
            <div className='login-background'>
                <img src={loginImage} alt='Login Image'/>   
            </div>

            <div className='authentication'>
                <div className='authentication-form card p-4'>
                
                <h1 className='card-topic'>Welcome Back!</h1>
                <br></br>
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item label='Email' name='email'>
                        <Input placeholder='Email'/>
                    </Form.Item>

                    <Form.Item label='Password' name='password'>
                        <Input placeholder='Password' type='password'/>
                    </Form.Item>

                    <Button className='primary-button my-1' htmlType='submit'>LOGIN</Button>

                    <Link to='/register' className='anchor mt-1'>CLICK HERE TO REGISTER FOR ATTENDANCE</Link>
                </Form>
                </div>
            </div>
        </div>
    )
}

export default Login