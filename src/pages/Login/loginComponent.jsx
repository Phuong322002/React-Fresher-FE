import { Button, Divider, Form, Input, message, notification, } from 'antd';
import './login.scss'
import { NavLink, useNavigate } from 'react-router-dom';

import { Login } from '../../services/axiosCreateAPI';
import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { doLoginAction } from '../../redux/account/accountSlice';

const LoginPage = () => {

    const dispatch = useDispatch()

    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(false)

    const onFinish = async (values) => {

        const { username, password } = values
        setIsLogin(true)
        const rs = await Login(username, password)
        console.log("rs loginn:", rs)
        setIsLogin(false)
        if (rs && rs.statusCode === 201) {
            dispatch(doLoginAction(rs.data))
            localStorage.setItem('access_token', rs.data.access_token)
            message.success("Đăng nhập thành công", [2])
            navigate('/')
        }
        if (rs && rs.statusCode === 400) {
            notification.error({
                message: 'Đăng nhập không thành công',
                description: rs.message ? rs.message : '',
                duration: 3,
            })
        }
    }



    return (
        <div className='main-page'>
            <div className='main-register'>

                <div className='title'>
                    Đăng Nhập
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
                            label="Email"
                            name="username"
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

                        <Form.Item
                        >

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLogin}
                            >
                                Đăng Nhập
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider plain>OR</Divider>
                    <div>
                        Bạn Chưa Có Tài Khoản! <span style={{ color: '#0000ff' }}><NavLink style={{ textDecoration: 'none', color: '#0000FF' }} to='/register'>Đăng Ký</NavLink></span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default LoginPage