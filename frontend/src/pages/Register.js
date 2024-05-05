import React, { useState, useEffect } from "react";
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
    const [currentDateTime, setCurrentDateTime] = useState('');
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentDate = new Date();
            setCurrentDateTime(currentDate.toLocaleString());
        }, 1000); // Update every second
    
        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

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

        // Set backend values based on role selection
        switch (values.role) {
            case 'isAdmin':
                values.isAdmin = true;
                break;
            case 'isCashier':
                values.isCashier = true;
                break;
            case 'isFinancialManager':
                values.isFinancialManager = true;
                break;
            case 'isLogisticManager':
                values.isLogisticManager = true;
                break;
            case 'isTrainingCoordinator':
                values.isTrainingCoordinator = true;
                break;
            case 'isStaffManager':
                values.isStaffManager = true;
                break;
            default:
                break;
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
            <div className="p-4">
            <div className="row">
            {/* Add user Text */}
            <div className="col-md-6">
                <div className="system-users p-3">
                    <h2>Add New System User</h2>
                </div>
            </div>
                
            {/* Current Date and Time */}
            <div className="col-md-6 text-md-end mb-6">
                <div className="date-time p-4">
                    <span className="date">{currentDateTime.split(',')[0]}</span>
                    <span className="time"> | {currentDateTime.split(',')[1]}</span>
                </div>                     
            </div>
        </div>
              
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

                        <Row gutter={[40, 13]}>  
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
                                <Option value="User">User</Option>
                                <Option value="isAdmin">Admin</Option>
                                <Option value="isCashier">Cashier</Option>
                                <Option value="isFinancialManager">Financial Manager</Option>
                                <Option value="isLogisticManager">Logistic Manager</Option>
                                <Option value="isTrainingCoordinator">Staff Training Coordinator</Option>
                                <Option value="isStaffManager">Staff Manager</Option>
                            </Select>
                        </Form.Item>

                        <br/>
                        <div>
                        <Button className='btn btn-outline-primary' htmlType='submit'>Create User</Button>
                        </div>
                    </Form>        
                    </div>
                </Layout>
    )
}

export default Register