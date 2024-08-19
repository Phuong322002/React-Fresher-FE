import { Button, Col, Divider, Form, Input, message, Row } from "antd"
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
import { postCreateAnOrder } from "../../services/axiosCreateAPI";
import { useNavigate } from "react-router-dom";

const IndexOrderBook = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [sumPrice, setSumPrice] = useState(0)
    const [stateRight, setStatusRight] = useState(false)
    const [stateOrderSucc, setStateOrder] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [loadingOrder, setLoadingOder] = useState(false)
    const [arrBook, setArrBook] = useState([])
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

    console.log('cart order', cart)

    const user = useSelector(state => state.account.user)
    console.log('user order', user.id)

    const userIdOrder = useSelector(state => state.order.userId)

    console.log('userIdOrder', userIdOrder)

    useEffect(() => {
        const arrNewOrder = cart.filter((idUser) => {
            return idUser.userId === userIdOrder
        })
        console.log('arrNewOrder', arrNewOrder)
        setArrBook(arrNewOrder)
    }, [cart])




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




    const [test, setTest] = useState(cart)
    const [iddele, setIddele] = useState('')

    useEffect(() => {
        const t = test.findIndex((c) => {
            // console.log('c, idDelete', c._id, iddele)
            if (c.userId === user.id) {
                return c._id === iddele
            }
        })
        console.log('test', test)
        let a = []
        if (test !== -1) {
            a = test.filter((cr, index) => {
                return index !== t
            })
        }
        setTest(a)
    }, [iddele])
    console.log("check delete:", test)

    useEffect(() => {
        dispatch(doDeletetoCartAction(test))
    }, [test])



    // dele book in cart
    const handleDeleteBookInCart = (idDelete) => {
        console.log('idDelete', idDelete)
        console.log('cart order', cart)
        setIddele(idDelete)
        // console.log('_id', _id)
        // const data = {
        //     idBook: _id,
        //     idUSer: user.id
        // }
    }
    // console.log('check test delete', test)

    //order
    const onFinish = async (values) => {
        console.log('Success:', values, cart);

        const arrDetail = arrBook.map((detail, index) => {
            return {
                "bookName": detail.detailBook.mainText,
                "quantity": detail.quantity,
                "_id": detail._id
            }
        })

        const objOrder = {
            name: values.fullName ? values.fullName : user?.fullName,
            address: values?.address,
            // phone: user?.phone ? user?.phone : values.phone,
            phone: values.phone ? values.phone : user?.phone,
            totalPrice: sumPrice,
            detail: arrDetail
        }
        console.log('objOrder', objOrder)
        setLoadingOder(true)

        const rs = await postCreateAnOrder(objOrder)

        setLoadingOder(false)

        console.log('>> check rs order:', rs)
        if (rs && rs.data) {
            setStateOrder(true)
            setCurrentStep(3)
            dispatch(doOrderSuccessAction(arrBook))
            message.success("Đặt hàng thành công", [2]);
        } else {
            message.error('Đặt hàng thất bại', [2])
            setCurrentStep(2)
        }
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

                                {arrBook && arrBook.length > 0 && arrBook.map((book, index) => {
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
                                                        loading={loadingOrder}
                                                        htmlType="submit"
                                                        style={{
                                                            width: "100%",
                                                            backgroundColor: 'red',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        Đặt hàng ({arrBook.length})
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
                                                    Mua hàng ({arrBook.length})
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
                            <Button onClick={() => navigate('/')} key="buy">Buy Again</Button>,
                        ]}
                    />
                </div>
            }



        </div >
    )
}

export default IndexOrderBook