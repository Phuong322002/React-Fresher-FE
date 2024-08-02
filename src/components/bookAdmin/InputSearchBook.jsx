
import { Row, Col, Button, Form, Input, Space } from 'antd';
const InputSearchBook = (props) => {

    const { handleSearch } = props
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log('values', values)
        let query = "";
        if (values.mainText) {
            query += `&mainText=/${values.mainText}/i`
        }

        if (values.author) {
            query += `&author=/${values.author}/i`
        }

        if (values.category) {
            query += `&category=/${values.category}/i`
        }
        handleSearch(query)
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleClear = () => {
        form.resetFields();
        handleSearch('')
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
                            label="Tên sách"
                            name="mainText"

                        >
                            <Input placeholder="Tên sách" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Tác giả"
                            name="author"

                        >
                            <Input placeholder="Tác giả" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Thể loại"
                            name="category"

                        >
                            <Input placeholder="Thể loại" />
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

export default InputSearchBook