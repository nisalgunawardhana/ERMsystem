import React from 'react'
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
import registerImage from '../images/register.jpg'
import axios from "axios"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { showLoading, hideLoading } from '../redux/alertsSlice';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async(values) => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/user/register', values)
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message)
                toast("Redirecting to Admin Dashboard")
                navigate("/login")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error('Something went wrong')
        }
    }

    return (
        <div className='register-container'>
            {/*register page background image*/}
            <div className='register-background'>
                <img src={registerImage} alt='Register Image'/>   
            </div>

            <div className='authentication'>
                <div className='authentication-form card p-4'>
                <h1 className='card-topic'>New System User</h1>
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item label='First Name' name='first_name'>
                        <Input placeholder='First Name'/>
                    </Form.Item>
                    
                    <Form.Item label='Last Name' name='last_name'>
                        <Input placeholder='Last Name'/>
                    </Form.Item>

                    <Form.Item label='Email' name='email'>
                        <Input placeholder='Email'/>
                    </Form.Item>

                    <Form.Item label='Password' name='password'>
                        <Input placeholder='Password' type='password'/>
                    </Form.Item>

                    <Button className='primary-button my-1' htmlType='submit'>Create User</Button>
                
                    <Link to='/login' className='anchor mt-1'>CLICK HERE TO LOGIN</Link>
                </Form>
                </div>
            </div>
        </div>
    )
}

export default Register