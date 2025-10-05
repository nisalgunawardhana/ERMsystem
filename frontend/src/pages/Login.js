import React, { useCallback, useEffect, useState } from 'react'
import { Form, Input, Button, Divider, Alert } from 'antd';
import { useNavigate } from 'react-router-dom'
import loginImage from '../images/login.jpg'
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { FcGoogle } from "react-icons/fc";
import api from '../api';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    const navigateToRole = useCallback((roleValue) => {
        switch (roleValue) {
            case 'admin':
                navigate("/");
                break;
            case 'cashier':
                navigate("/dashboard/cashier");
                break;
            case 'financial manager':
                navigate("/dashboard/finance/");
                break;
            case 'staff manager':
                navigate("/dashboard/employee");
                break;
            case 'training coordinator':
                navigate("/dashboard/trainee");
                break;
            case 'logistic manager':
                navigate("/dashboard/logistics");
                break;
            default:
                navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        // Process URL parameters on component mount
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const error = params.get("error");
        const roleParam = params.get("role");

        // Handle tokens (Google OAuth success)
        if (token) {
            localStorage.setItem("token", token);
            if (roleParam) {
                localStorage.setItem("role", roleParam);
            }
            toast.success("Successfully logged in with Google");
            navigateToRole(roleParam);
        }

        // Handle errors from OAuth flow
        if (error) {
            switch (error) {
                case 'not_registered':
                    setLoginError('This Google account is not registered in our system.');
                    break;
                case 'authentication_failed':
                    setLoginError('Authentication failed. Please try again.');
                    break;
                case 'session_expired':
                    setLoginError('Your session has expired. Please log in again.');
                    break;
                default:
                    setLoginError('An error occurred during login.');
            }
        }
        
        if (token || error || roleParam) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [navigate, navigateToRole]);

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.REACT_APP_API_ADDRESS || 'http://localhost:8080'}/auth/google`;
    };

    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            setLoginError('');
            
            // Use our API instance for consistent error handling
            const response = await api.post('/api/user/login', values);
            dispatch(hideLoading());

            if (response.data.success) {
                toast.success(response.data.message);

                // Extract role information from response data
                const role = response.data.role;
                if (role) {
                    localStorage.setItem('role', role);
                }

                // Store token in local storage
                localStorage.setItem("token", response.data.data);

                // Redirect based on the role
                navigateToRole(role);
            } else {
                setLoginError(response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            setLoginError('Login failed. Please check your credentials.');
            toast.error('Something went wrong');
            console.error('Login error:', error);
        }
    }

    return (
        <div className='login-container'>
            <div className='login-background'>
                <img src={loginImage} alt='Login Image' />
            </div>

            <div className='authentication'>
                <div className='authentication-form card p-4'>

                    <h1 className='card-topic'>Welcome Back!</h1>
                    {loginError && (
                        <Alert
                            message="Login Error"
                            description={loginError}
                            type="error"
                            showIcon
                            closable
                            className="mb-3"
                        />
                    )}
                    <br></br>
                    <Form className='' layout='vertical' onFinish={onFinish}>
                        <Form.Item label='Email' name='email'>
                            <Input className='loginginput' placeholder='Email' />
                        </Form.Item>

                        <Form.Item label='Password' name='password'>
                            <Input className='loginginput' placeholder='Password' type='password' />
                        </Form.Item>

                        <Button className='primary-button my-1 w-100' htmlType='submit'>LOGIN</Button>
                        
                        <Divider plain>Or</Divider>
                        
                        <Button 
                            onClick={handleGoogleLogin} 
                            className='google-button my-1 w-100' 
                            icon={<FcGoogle size={20} />}
                        >
                            Login with Google
                        </Button>
                    </Form>

                    <div className="mt-3 text-center">
                        <p>
                            Don't have an account? <a href="/register">Register here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
