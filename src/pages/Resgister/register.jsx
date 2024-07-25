import { Button, Divider, Form, Input, message, notification } from 'antd';
import './register.scss'

import { Register } from '../../services/axiosCreateAPI';
import { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";

const RegisterComponent = () => {

    const [isRegistered, setIsRegister] = useState(false)

    const navigate = useNavigate()


    const onFinish = async (values) => {
        setIsRegister(true)
        const rs = await Register(values.fullname, values.email, values.password, values.phone)
        setIsRegister(false)

        if (rs && rs.statusCode === 201) {
            message.success('Đăng ký thành công', [3])
            navigate('/login')
        }

        if (rs && rs.statusCode === 400) {
            setIsRegister(false)
            notification.error({
                message: rs.message,
                duration: 2,
            })
        }
    }

    return (
        <div className='main-page'>
            <div className='main-register'>

                <div className='title'>
                    Đăng ký người dùng mới
                </div>

                <Divider />

                <div className='content-register'>
                    <Form
                        labelCol={{ span: 24 }}
                        name="basic"
                        style={{ margin: '0 auto' }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            labelCol={{
                                span: 24,
                            }}
                            label="Full Name"
                            name="fullname"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your fullname!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            labelCol={{
                                span: 24,
                            }}
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    required: true,
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            labelCol={{
                                span: 24,
                            }}
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            labelCol={{
                                span: 24,
                            }}
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        {/* <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item> */}

                        <Form.Item
                        // wrapperCol={{
                        //     offset: 20,
                        // }}
                        >

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isRegistered}

                            >
                                Đăng Ký
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider plain>OR</Divider>
                    <div>
                        Bạn Đã Có Tài Khoản. <span style={{ color: '#0000ff' }}><NavLink style={{ textDecoration: 'none', color: '#0000FF' }} to='/login'>Đăng Nhập</NavLink></span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default RegisterComponent