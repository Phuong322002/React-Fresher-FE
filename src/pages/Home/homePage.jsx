import { Col, Divider, InputNumber, Row, Space } from 'antd'
import './homePage.scss'
import { Button, Checkbox, Form, Input } from 'antd';
import { Rate } from 'antd';
import { useState } from 'react';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { Card } from 'antd';
import { Pagination } from 'antd';

const HomePage = () => {
    const [form] = Form.useForm();
    // Form
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    //CheckBox
    const onChangeCheckBox = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };
    const plainOptions = ['Apple', 'Pear', 'Orange'];

    //InputNumber
    const onChangeInputNumber = (value) => {
        console.log('changed', value);
    };

    //Rate
    const [value, setValue] = useState(3);
    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

    //Tabs
    const onChange = (key) => {
        console.log(key);
    };

    //Card img
    const { Meta } = Card;

    return (

        <div className='main-home'>
            <Row style={{ minHeight: '100%', }}>
                <Col md={4} sm={0} xs={0} >

                    <div style={{
                        margin: '10px 0px',
                        minHeight: "calc(100% - 20px)",
                        backgroundColor: 'white',
                        borderRadius: '3px',
                        padding: '0px 10px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px' }}>
                            <div style={{ marginTop: '10px' }}>
                                <FilterOutlined /> Bộ lọc tìm kiếm
                            </div>
                            <div style={{ marginTop: '10px' }}>

                                <ReloadOutlined />
                            </div>
                        </div>
                        <Divider />
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{
                                span: 24,
                            }}
                            style={{ margin: '5px' }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Danh mục sản phẩm"
                                name="username"

                            >
                                <Checkbox.Group defaultValue={['Apple']} onChange={onChangeCheckBox}>
                                    <Row>
                                        <Col span={24}>
                                            <Checkbox value='A'>A</Checkbox>
                                        </Col>

                                        <Col span={24}>
                                            <Checkbox value='B'>B</Checkbox>
                                        </Col>

                                        <Col span={24}>
                                            <Checkbox value='C'>C</Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="Khoảng giá"
                                labelCol={{
                                    span: 24,
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                                    <Form.Item
                                        name={['range', 'from']}
                                    >
                                        <InputNumber
                                            placeholder='from ...₫'
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            onChange={onChangeInputNumber}
                                            controls={false}
                                        />
                                        ₫
                                    </Form.Item>
                                    <span>-</span>
                                    <Form.Item
                                        name={['range', 'to']}
                                    >
                                        <InputNumber
                                            placeholder='to ...₫'
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            onChange={onChangeInputNumber}
                                            controls={false}

                                        />
                                        ₫
                                    </Form.Item>
                                </div>

                            </Form.Item>

                            <Divider />
                            <div style={{ width: '100%', margin: '10px' }}>
                                <div>
                                    Đánh giá
                                </div>
                                <span>
                                    <Rate tooltips={desc} onChange={setValue} value={5} />
                                    <Rate tooltips={desc} onChange={setValue} value={4} />
                                    <Rate tooltips={desc} onChange={setValue} value={3} />
                                    <Rate tooltips={desc} onChange={setValue} value={2} />
                                    <Rate tooltips={desc} onChange={setValue} value={1} />
                                </span>
                            </div>
                            <Divider />

                            <div>
                                <Button onClick={() => form.submit()}
                                    style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                            </div>
                        </Form>

                    </div>


                </Col>

                <Col md={20} xs={24} >
                    {/* PC tabs */}
                    <div className='body-book'>
                        <div className='tabs-pc'>
                            <Tabs
                                defaultActiveKey="1"
                                size='small'
                                onChange={onChange}
                                items={[
                                    {
                                        label: `Phổ biến`,
                                        key: '1',
                                        children: ``,
                                    },
                                    {
                                        label: `Hàng mới`,
                                        key: '2',
                                        children: ``,
                                    },
                                    {
                                        label: `Giá thấp đến cao`,
                                        key: '3',
                                        children: ``,
                                    },
                                    {
                                        label: `Giá cao đến thấp`,
                                        key: '4',
                                        children: ``,
                                    },
                                ]}
                            />
                        </div>

                        {/* Mobile tabs */}
                        <div className='tabs-mobile'>
                            <Tabs
                                tabBarGutter={10}
                                defaultActiveKey="1"
                                size='small'
                                onChange={onChange}
                                items={[
                                    {
                                        label: <span style={{ fontSize: '10px' }}>Phổ biến</span>,
                                        key: '1',
                                        children: ``,
                                    },
                                    {
                                        label: <span style={{ fontSize: "10px" }}>Hàng mới</span>,
                                        key: '2',
                                        children: ``,
                                    },
                                    {
                                        label: <span style={{ fontSize: '10px' }}>Giá thấp đến cao</span>,
                                        key: '3',
                                        children: ``,
                                    },
                                    {
                                        label: <span style={{ fontSize: "10px" }}>Giá cao đến thấp</span>,
                                        key: '4',
                                        children: ``,
                                    },
                                ]}
                            />
                        </div>

                        {/* PC */}
                        <div className='cards-book'>
                            <div className='card-book'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" />
                                </div>
                                <div className='text'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(700000)}
                                </div>
                                <div className='rate'>
                                    <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán 1k</span>
                                </div>
                            </div>
                            <div className='card-book'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" />
                                </div>
                                <div className='text'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(700000)}
                                </div>
                                <div className='rate'>
                                    <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán 1k</span>
                                </div>
                            </div><div className='card-book'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" />
                                </div>
                                <div className='text'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(700000)}
                                </div>
                                <div className='rate'>
                                    <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán 1k</span>
                                </div>
                            </div><div className='card-book'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" />
                                </div>
                                <div className='text'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(700000)}
                                </div>
                                <div className='rate'>
                                    <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán 1k</span>
                                </div>
                            </div><div className='card-book'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" />
                                </div>
                                <div className='text'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(700000)}
                                </div>
                                <div className='rate'>
                                    <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán 1k</span>
                                </div>
                            </div>


                        </div>

                        {/* Mobile */}
                        <div className='card-mobile'>
                            <div className='card-book-mobile'>
                                <div className='thumbnail-mobile'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" />
                                </div>
                                <div className='text-mobile'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price-mobile'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(700000)}
                                </div>
                                <div className='rate-mobile'>
                                    <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán 1k</span>
                                </div>
                            </div>

                            <div className='card-book-mobile'>
                                <div className='thumbnail-mobile'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" />
                                </div>
                                <div className='text-mobile'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price-mobile'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(700000)}
                                </div>
                                <div className='rate-mobile'>
                                    <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán 1k</span>
                                </div>
                            </div>
                            <div className='card-book-mobile'>
                                <div className='thumbnail-mobile'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" />
                                </div>
                                <div className='text-mobile'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price-mobile'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(700000)}
                                </div>
                                <div className='rate-mobile'>
                                    <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán 1k</span>
                                </div>
                            </div>

                            <div className='card-book-mobile'>
                                <div className='thumbnail-mobile'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" />
                                </div>
                                <div className='text-mobile'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price-mobile'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(700000)}
                                </div>
                                <div className='rate-mobile'>
                                    <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán 1k</span>
                                </div>
                            </div>

                            <div className='card-book-mobile'>
                                <div className='thumbnail-mobile'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" />
                                </div>
                                <div className='text-mobile'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price-mobile'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(700000)}
                                </div>
                                <div className='rate-mobile'>
                                    <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <Divider />
                        <div className='pagination'>
                            <Pagination
                                total={85}
                                showSizeChanger
                                showQuickJumper
                                showTotal={(total) => `Total ${total} items`}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </div >
    )
}

export default HomePage