import React from 'react';
import { Form, Input, Button, Checkbox, Col, Row, DatePicker } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout';
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { showLoading, hideLoading } from '../redux/alertsSlice';
import axios from "axios"

const CreateNoteForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async(values) => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/notes', values);


            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message)
                toast("Note Added")
                navigate("/notes")
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
            <div className='notes p-5'>
                <h1 className='card-topic'>New Note</h1>
                <hr />
                <br/>
                <Form layout='vertical' onFinish={onFinish}>
                    <Row gutter={40}>
                        <Col span={8}>
                            <Form.Item required label='Note Number' name='note_no' rules={[{ required: true }]}>
                                <Input placeholder='Note Number' />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item required label='Note Title' name='note_title' rules={[{ required: true }]}>
                                <Input placeholder='Note Title' />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label='Date' name='date'>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <br/>
                    <Form.Item required label='Note Description' name='note_description' rules={[{ required: true }]}>
                        <Input.TextArea placeholder='Note Description' />
                    </Form.Item>

                    <Form.Item name='important' valuePropName='checked'>
                        <Checkbox>Mark Important</Checkbox>
                    </Form.Item>

                    <Button className='create-note-button my-2' htmlType='submit'>Create Note</Button>
                    <br/>
                    <Link to='/notes' className='anchor mt-1'>Back to Notes</Link>
                </Form>
            </div>
        </Layout>

    );
}

export default CreateNoteForm;
