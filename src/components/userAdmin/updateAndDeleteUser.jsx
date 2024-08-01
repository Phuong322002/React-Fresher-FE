
import { Button, Checkbox, ConfigProvider, Form, Input, message, Modal, notification, Popover } from 'antd';
import { useEffect, useState } from 'react';
import { RiDeleteBin6Fill, RiEdit2Fill } from 'react-icons/ri';
import { putUpdateUser } from '../../services/axiosCreateAPI';
import { RiErrorWarningFill } from "react-icons/ri";
import { deleteUser } from '../../services/axiosCreateAPI';

const UpdateUser = (props) => {


    const { record, fetchGetUserWithPaginate } = props
    const [form] = Form.useForm();


    useEffect(() => {
        form.setFieldsValue(record)
    }, [record])


    const onFinish = async (values) => {
        console.log('Success:', values);
        const rs = await putUpdateUser(values._id, values.fullName, values.phone)
        console.log('Check rs:', rs)
        if (rs && rs.data) {
            message.success('Update user success', [2]);
            fetchGetUserWithPaginate()
            setIsModalOpenEdit(false);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const showModalEdit = () => {
        console.log('>> check record:', record)
        setIsModalOpenEdit(true);
        form.setFieldsValue(record)

    };
    const handleCancelEdit = () => {
        setIsModalOpenEdit(false);
        form.resetFields();
    };

    const handleDeleteUser = async () => {

        console.log('Check user deleted:', record._id)

        const res = await deleteUser(record._id)
        if (res && res.data) {
            message.success("Delete user successfuly ^^", [2]);
            fetchGetUserWithPaginate()
        } else {
            notification.error({
                message: 'ERROR',
                description: `${res.message}`
            })
            setOpen(false);
        }
    }

    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = () => {
        setOpen(true);
    };

    const text = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <RiErrorWarningFill style={{ fontSize: '18px', color: '	#ffcc00' }} />
                <span style={{ fontSize: '17px' }}>
                    Xác nhận xóa user
                </span>
            </div>
        )
    }

    const content = (
        <div>
            <p style={{ marginBottom: '10px', fontSize: '14px' }}>Bạn có chắc muốn xóa user này ?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button onClick={hide}>Close</Button>
                <Button type="primary" onClick={() => { handleDeleteUser() }}>Xác nhận</Button>
            </div>
        </div >
    );

    const buttonWidth = 80;

    return (

        <>
            <>
                <ConfigProvider>
                    <div className="demo">
                        <div
                            style={{
                                float: 'inline-start',
                            }}
                        >
                            <Popover
                                placement="left"
                                title={text}
                                content={content}
                                trigger="click"
                                open={open}
                                onOpenChange={handleOpenChange}
                            >
                                <RiDeleteBin6Fill style={{ color: '#ff7f50', fontSize: '15px', marginRight: '15px' }} />
                            </Popover>
                        </div>
                    </div>
                </ConfigProvider>
            </>
            <>
                <RiEdit2Fill onClick={showModalEdit} style={{ color: '#6495ed', fontSize: '15px' }} />
                <Modal
                    maskClosable={false}
                    title="Basic Modal"
                    open={isModalOpenEdit}
                    onOk={form.submit}
                    onCancel={handleCancelEdit}
                >
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}

                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        form={form}
                    >

                        <Form.Item
                            label="ID"
                            name="_id"
                            labelCol={{
                                span: 24,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                            hidden

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Tên hiển thị"
                            name="fullName"
                            labelCol={{
                                span: 24,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            labelCol={{
                                span: 24,
                            }}
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >

                            <Input disabled={true} />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            labelCol={{
                                span: 24,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Phone!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </>

        </>
    )
}

export default UpdateUser