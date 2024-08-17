import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Checkbox, Form, Input, message, Modal, Space, Tabs, Upload } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { postUploadImgAvatar } from "../../services/axiosCreateAPI";
import { putUpdateUserInfo } from "../../services/axiosCreateAPI";
import { useDispatch } from "react-redux";
import { doUpdateUserAction } from "../../redux/account/accountSlice";
import { postChangePasswork } from "../../services/axiosCreateAPI";

const ModalUploadUser = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const user = useSelector(state => state.account.user)
    const imageBackendPng = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    const [imgUpdate, setUpdate] = useState(imageBackendPng)
    const [fileImg, setFileImg] = useState('')

    console.log('>> check user update', user)

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onChange = (key) => {
        console.log(key);
    };

    useEffect(() => {
        //companyInfo -> dynamic obj fetched from API
        form.setFieldsValue(user);
    }, [user]);

    const dummyRequest = async ({ file, onSuccess, onError }) => {

        console.log('file user', file)
        const rs = await postUploadImgAvatar(file)
        console.log('>> check upload file', rs)
        if (rs && rs.data) {
            setFileImg(rs.data.fileUploaded)
            setUpdate(`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${rs.data.fileUploaded}`)

        }
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const props = {
        name: 'file',
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        headers: {
            authorization: 'authorization-text',
        },
        customRequest: dummyRequest,
        onChange(info) {
            console.log('info', info)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {

                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const onFinish = async (values) => {
        console.log('Success:', values);
        const data = {
            fullName: values.fullName,
            phone: values.phone,
            avatar: fileImg,
            _id: values.id
        }
        const rs = await putUpdateUserInfo(data)
        console.log(">> check update user:", rs)
        if (rs && rs.data) {
            dispatch(doUpdateUserAction(data))
            message.success("Cập nhật thông tin người dùng thành công", [2]);
        } else {
            message.error(rs.message[0], [2])
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinishChangePass = async (values) => {
        console.log('success:', values)
        const data = {
            email: values.email,
            oldpass: values.oldpass,
            newpass: values.newpass
        }
        const rs = await postChangePasswork(data)
        console.log("check pass: ", rs)
        if (rs && rs.data) {
            message.success("Change password successfully!", [2])
            form.setFieldValue('oldpass', '')
            form.setFieldValue('newpass', '')
        } else {
            message.error(rs.message, [2])
        }
    };

    const items = [
        {
            key: '1',
            label: 'Cập nhật thông tin',
            children: <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <Space wrap size={16}>
                            <Avatar src={imgUpdate} size={100} icon={<UserOutlined />} />
                        </Space>
                    </div>

                    <div>
                        <Upload
                            {...props}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>Update Avatar</Button>
                        </Upload>
                    </div>
                </div>

                <div>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 24,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        form={form}

                    >
                        <Form.Item
                            label="ID"
                            name="id"
                            hidden
                        >
                            <Input hidden />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            label="Tên hiển thị"
                            name="fullName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your user name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
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
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>,
        },
        {
            key: '2',
            label: 'Đổi mật khẩu',
            children: <div>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 24,
                    }}

                    style={{
                        maxWidth: 300,
                    }}
                    onFinish={onFinishChangePass}
                    autoComplete="off"
                >

                    <Form.Item

                        label="Email"
                        name="email"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: 'Please input your username!',
                    //     },
                    // ]}
                    >
                        <Input disabled />
                    </Form.Item>



                    <Form.Item
                        label="Mật khẩu hiện tại"
                        name="oldpass"
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
                        label="Mật khẩu mới"
                        name="newpass"
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
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        {/* <button onClick={() => form.submit}>
                            Xác nhận
                        </button> */}
                    </Form.Item>
                </Form>
            </div>,
        },
    ];

    return (
        <>
            <span type="primary" onClick={showModal}>
                Quản lý tài khoản
            </span>
            <Modal
                title="Quản lý tài khoản"
                open={isModalOpen}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
                onCancel={handleCancel}
                width='700px'
                maskClosable={false}
            >
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </Modal>
        </>
    )
}

export default ModalUploadUser