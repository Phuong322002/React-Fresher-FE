import { Button, Col, Divider, Form, Input, Row } from "antd"
import './order.scss'
import { Image } from 'antd';
import { InputNumber } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { doUpdatetoCartAction } from "../../redux/order/orderSlice";
import { useDispatch } from "react-redux";
import { set } from "lodash";
import { doDeletetoCartAction } from "../../redux/order/orderSlice";
import { Steps } from 'antd';
import { Empty } from 'antd';
import TextArea from "antd/es/input/TextArea";
import { Radio } from 'antd';
import { Result } from 'antd';
import { doOrderSuccessAction } from "../../redux/order/orderSlice";


const IndexOrderBook = () => {

    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const [sumPrice, setSumPrice] = useState(0)
    const [stateRight, setStatusRight] = useState(false)
    const [stateOrderSucc, setStateOrder] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const handleInputNumber = (value, book) => {

        console.log('changed', value, book);
        dispatch(doUpdatetoCartAction(
            {
                quantity: value,
                _id: book._id,
                detailBook: book.detailBook
            }
        ))

    };

    const cart = useSelector(state => state.order.carts)

    const user = useSelector(state => state.account.user)
    console.log('user order', user)

    console.log('cart', cart)


    useEffect(() => {
        let sum = 0
        cart.forEach((book) => {
            console.log('price', book.quantity * book.detailBook.price)
            sum += book.quantity * book.detailBook.price
        })
        console.log('sum', sum)
        setSumPrice(sum)


        // if (cart && cart.length === 0) {
        //     setCurrentStep(0)
        // }


    }, [cart])

    console.log('sumPrice', sumPrice)


    // dele book in cart
    const handleDeleteBookInCart = (_id) => {
        dispatch(doDeletetoCartAction(_id))
    }

    //order
    const onFinish = (values) => {
        console.log('Success:', values);
        setStateOrder(true)
        setCurrentStep(3)
        dispatch(doOrderSuccessAction([]))
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handlePurchase = () => {
        setStatusRight(true)
        setCurrentStep(2)
    }

    useEffect(() => {
        //companyInfo -> dynamic obj fetched from API
        form.setFieldsValue(user);
    }, [user]);




    console.log('currentStep', currentStep)


    return (
        <div className="main-order">
            <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '3px' }}>
                <Steps
                    size="small"
                    current={currentStep}
                    items={[
                        {
                            title: 'Đơn hàng',
                        },
                        {
                            title: 'Đặt hàng',
                        },
                        {
                            title: 'Thanh toán',
                        },
                    ]}
                />
            </div>
            {stateOrderSucc === false ?
                <>
                    <Row gutter={[20, 20]}>
                        <Col md={18} sm={24} xs={24} >
                            <div className="main-left-order">

                                {cart && cart.length > 0 && cart.map((book, index) => {
                                    console.log('book', book)
                                    return (
                                        <>
                                            {/* PC */}
                                            <div className="left-order" >
                                                <div className="content-left">
                                                    <div className="img-book">
                                                        <Image
                                                            width={80}
                                                            src={book.detailBook.images[0].original}
                                                        />
                                                    </div>

                                                    <div className="name-book">
                                                        <span>
                                                            {book.detailBook.mainText}
                                                        </span>
                                                    </div>

                                                    <div className="price-book">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${book.detailBook.price}`)}
                                                    </div>

                                                    <div className="quantity-book">
                                                        <InputNumber min={1} defaultValue={book.quantity} onChange={(value) => handleInputNumber(value, book)} />
                                                    </div>

                                                    <div className="total-price">
                                                        <span style={{ fontWeight: '600' }}>

                                                            Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.detailBook.price * book.quantity)}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <DeleteOutlined onClick={() => { handleDeleteBookInCart(book._id) }} style={{ color: 'red' }} />
                                                    </div>
                                                </div>

                                                {/* Mobile */}
                                                <div className="content-left-moblie">
                                                    <div className="img-book-mobile">
                                                        <Image
                                                            width={50}
                                                            src={book.detailBook.images[0].original}
                                                        />
                                                    </div>

                                                    <div className="name-book-mobile">
                                                        <span>
                                                            {book.detailBook.mainText}
                                                        </span>
                                                    </div>

                                                    <div className="price-book-mobile">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${book.detailBook.price}`)}
                                                    </div>

                                                    <div className="quantity-book-mobile">
                                                        <InputNumber style={{ width: '50px' }} min={1} max={10} value={book.quantity} onChange={(value) => { handleInputNumber(value, book) }} />
                                                    </div>

                                                    <div className="total-price-mobile">
                                                        <span>
                                                            Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(1000)}
                                                        </span>
                                                    </div>

                                                    <div >
                                                        <DeleteOutlined style={{ color: 'red' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })}
                                {cart && cart.length === 0 &&
                                    <div style={{
                                        height: `500px`,
                                        backgroundColor: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Empty style={{}}
                                        />
                                    </div>
                                }


                            </div>
                        </Col>
                        <Col md={6} sm={24} xs={24}>
                            <div className="right-order" >
                                <div className="main-right-order">

                                    {stateRight === true && cart.length > 0 ?

                                        <>
                                            <Form
                                                form={form}
                                                name="basic"
                                                labelCol={{
                                                    span: 8,
                                                }}
                                                onFinish={onFinish}
                                                onFinishFailed={onFinishFailed}
                                                autoComplete="off"
                                            >
                                                <Form.Item
                                                    label="Tên người dùng"
                                                    name='fullName'
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
                                                    label="Số điện thoại"
                                                    name='phone'

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
                                                    label="Địa chỉ"
                                                    name='address'
                                                    labelCol={{
                                                        span: 24,
                                                    }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please input your address!',
                                                        },
                                                    ]}

                                                >
                                                    <TextArea rows={4} />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Hình thức thanh toán"
                                                    labelCol={{
                                                        span: 24,
                                                    }}
                                                >
                                                    <Radio checked={true}>
                                                        Thanh toán khi nhận hàng
                                                    </Radio>
                                                </Form.Item>
                                                <Divider />
                                                <Form.Item
                                                    labelCol={{
                                                        span: 24,
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <div>
                                                            Tổng tiền
                                                        </div>
                                                        <div style={{ color: 'red', fontSize: '18px', fontWeight: '600' }}>
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumPrice)}
                                                        </div>

                                                    </div>
                                                </Form.Item>
                                                <Divider />
                                                <Form.Item>
                                                    <Button
                                                        htmlType="submit"
                                                        style={{
                                                            width: "100%",
                                                            backgroundColor: 'red',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        Đặt hàng ({cart.length})
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </>
                                        :
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    Tạm tính
                                                </div>
                                                <div>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumPrice)}
                                                </div>
                                            </div>
                                            <Divider />
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    Tổng tiền
                                                </div>
                                                <div style={{ fontSize: "20px", color: "red" }}>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumPrice)}
                                                </div>
                                            </div>
                                            <Divider />
                                            <div >
                                                <Button
                                                    onClick={() => { handlePurchase() }}
                                                    style={{
                                                        width: "100%",
                                                        backgroundColor: 'red',
                                                        color: 'white'
                                                    }}
                                                >
                                                    Mua hàng ({cart.length})
                                                </Button>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </Col>

                    </Row>
                </>
                :
                <div style={{
                    height: `calc(100vh - 185px)`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Result
                        status="success"
                        title="Đơn hàng đã được đặt thành công !"
                        extra={[
                            <Button type="primary" key="console">
                                Xem lịch sử
                            </Button>,
                            <Button key="buy">Buy Again</Button>,
                        ]}
                    />
                </div>
            }



        </div >
    )
}

export default IndexOrderBook