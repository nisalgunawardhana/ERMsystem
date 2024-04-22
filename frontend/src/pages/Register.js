import React from 'react'
import { Form, Input, Button, Select, Col, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { showLoading, hideLoading } from '../redux/alertsSlice';
import '../User.css'
import Layout from '../components/Layout';

const { Option } = Select;

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const onFinish = async(values) => {
        //to make sure all the fields are filled
        if (!values.first_name) {
            toast.error('Enter the first name');
            return;
        } else if (!values.last_name) {
            toast.error('Enter the last name');
            return;
        } else if (!values.email) {
            toast.error('Enter the email');
            return;
        } else if (!values.password) {
            toast.error('Enter a password');
            return;
        }

        try {
            dispatch(showLoading())
            const response = await axios.post('/api/user/register', values)
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/users")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error('Something went wrong')
        }
    }

    return (
        <Layout>
        <div className='register-container'>
            <div className='authentication'>
                <div className='authentication-form  p-5'>
                    <h1 className='card-topic'>Add New System User</h1>
                    <br/>
                    <Form layout='vertical' onFinish={onFinish}> 
                        <Row gutter={[50, 13]}>
                            <Col span={12}>
                                <Form.Item required label='First Name' name='first_name' >
                                    <Input placeholder='First Name'/>
                                </Form.Item> 
                            </Col>
                            
                            <Col span={12}>
                                <Form.Item required  label='Last Name' name='last_name'>
                                    <Input placeholder='Last Name'/>
                                </Form.Item>   
                            </Col>
                        </Row>     

                        <Row gutter={[50, 13]}>  
                            <Col span={12}>
                                <Form.Item required label='Email' name='email'>
                                    <Input placeholder='Email' type='email'/>
                                </Form.Item>
                            </Col>
                            
                            <Col span={12}>
                                <Form.Item required label='Password' name='password'>
                                    <Input placeholder='Password' type='password'/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item required label='Role' name='role'>
                            <Select placeholder="Select a role">
                                <Option value="admin">Admin</Option>
                                <Option value="cashier">Cashier</Option>
                                <Option value="financial_manager">Financial Manager</Option>
                                <Option value="logistic_manager">Logistic Manager</Option>
                                <Option value="staff_training_coordinator">Staff Training Coordinator</Option>
                                <Option value="staff_manager">Staff Manager</Option>
                            </Select>
                        </Form.Item>

                        <br/>
                        <Button className='register-button my-2' htmlType='submit'>Create User</Button>
                    </Form>
                </div>
            </div>
        </div>
    </Layout>
        
    )
}

export default Register