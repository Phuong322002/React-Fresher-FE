
import { Row, Col, Button, Form, Input, Space } from 'antd';
const InputSearchUser = (props) => {

    const { fetchGetUserWithPaginate } = props
    const [form] = Form.useForm();
    const onFinish = (values) => {
        let query = "";
        if (values.fullName) {
            query += `&fullName=/${values.fullName}/i`
        }

        if (values.email) {
            query += `&email=/${values.email}/i`
        }

        if (values.phone) {
            query += `&phone=/${values.phone}/i`
        }
        fetchGetUserWithPaginate(query)
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleClear = () => {
        form.resetFields();
        fetchGetUserWithPaginate()
    }


    return (
        <>
            <Form
                name="basic"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Name"
                            name="fullName"

                        >
                            <Input placeholder="Name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Email"
                            name="email"

                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Phone"
                            name="phone"

                        >
                            <Input placeholder="Phone" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{ textAlign: 'right' }}>
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Space size="small">
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                            <Button onClick={() => { handleClear() }}>
                                Clear
                            </Button>
                        </Space>
                    </div>
                </Form.Item>
            </Form>
        </>
    )
}

export default InputSearchUser