import { GiReactor } from "react-icons/gi";
import { BsCart3 } from "react-icons/bs";
import './header.scss'
import { Button, Col, Divider, Image, Input, Popover, Row } from 'antd';
import { FcSearch } from "react-icons/fc";
import { Badge } from 'antd';
import { RiAccountCircleFill } from "react-icons/ri";
import { FaBars } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import { Dropdown, message, Space, } from 'antd';
import { MdManageAccounts } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Logout } from "../../services/axiosCreateAPI";
import { useDispatch } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { doLogoutUser } from "../../redux/account/accountSlice";
import { FcManager } from "react-icons/fc";
import { Avatar } from "antd";
import { HistoryOutlined, UserOutlined } from '@ant-design/icons';
import { isArray } from "lodash";
import ModalUploadUser from "./ModalUploadAccount";
import ComponentAc from "./componentAc";

const HeaderComponent = (props) => {

    const { searchName, setSearchName } = props
    const [open, setOpen] = useState(false);
    const [lengthCart, setLengthCart] = useState(0)
    const [arrBook, setArrBook] = useState([])
    const [mainText, setMainText] = useState('')
    // const [arrPro, setArrPro] = useState([])

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    const user = useSelector(state => state.account.user)
    const arrCart = useSelector(state => state?.order?.carts)
    const userOrder = useSelector(state => state?.order?.userId)

    console.log('userOrder', userOrder)
    console.log('arrCart', arrCart)
    console.log('user', user)

    useEffect(() => {
        let newCart = arrCart.filter((user) => {
            return user.userId === userOrder
        })
        setLengthCart(newCart.length)
        setArrBook(newCart)
    }, [arrCart])

    useEffect(() => {
        if (arrCart && arrCart.length > 0) {
            let newCart = arrCart.filter((user) => {
                return user.userId === userOrder
            })
            console.log('newCart', newCart)
            setLengthCart(newCart.length)
            setArrBook(newCart)
        }
    }, [arrCart])




    // const length = arrCart?.length

    // console.log(">> check user:", user)

    // useEffect(() => {
    //     if (isArray(arrCart)) {
    //         setLengthCart(arrCart.length)
    //         setArrBook(arrCart)
    //     }
    // }, [arrCart])

    console.log('lengthCart', lengthCart)
    console.log('arrCart', arrCart)
    console.log('arrBook', arrBook)




    const handleButtonClick = (e) => {
        message.info('Click on left button.');
        console.log('click left button', e);
    };

    const LogoutUser = async () => {

        const rs = await Logout();
        console.log(rs)
        if (rs && rs.data) {
            dispatch(doLogoutUser())
            message.success(rs.data, [2]);
            navigate('/')
        }
        setLengthCart(0)
    }

    const items = [
        {
            label: <ModalUploadUser />,
            key: '1',
            icon: <MdManageAccounts style={{ fontSize: '18px' }} />,
        },
        {
            label: <span onClick={() => navigate('history')}>Lịch sử mua hàng</span>,
            key: '2',
            icon: <HistoryOutlined onClick={() => navigate('history')} style={{ fontSize: '18px' }} />,
        },
        {
            label: <span onClick={() => { LogoutUser() }}>Đăng Xuất</span>,
            key: '3',
            icon: <IoLogOutOutline onClick={() => { LogoutUser() }} style={{ fontSize: '18px' }} />,
        }
    ];
    if (isAuthenticated === true && user.role === 'ADMIN') {
        items.unshift({
            label: <span onClick={() => navigate('/admin')}>Trang quản trị</span>,
            key: '3',
            icon: <FcManager style={{ fontSize: '18px' }} />,
        })
    }
    const menuProps = {
        items,
    };

    // const items = [
    //     {
    //         label: <NavLink to='/login'>Đăng Nhập</NavLink>,
    //         key: '0',
    //     },
    //     {
    //         type: 'divider',
    //     },
    //     {
    //         label: <NavLink to='/register'>Đăng Ký</NavLink>,
    //         key: '1',
    //     },
    // ];


    const imageBackendPng = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`

    console.log('imageBackendPng', imageBackendPng)

    //Popover Cart
    const text = <span>Sản phẩm mới thêm</span>;
    const content = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, }}>
            {arrBook && arrBook.length > 0 && arrBook.map((book, index) => {

                return (
                    <>
                        <div style={{ display: 'flex', gap: 15 }}>
                            <div>
                                <Image
                                    width={60}
                                    height={55}
                                    src={`${book?.detailBook?.images[0].original}`}
                                />
                            </div>
                            <div style={{ width: '200px' }}>
                                {book.detailBook.mainText}
                            </div>
                            <div style={{ color: 'red' }}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.detailBook.price)}
                            </div>
                        </div>
                    </>
                )
            })}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => navigate('order')} style={{ backgroundColor: 'red', color: 'white', borderRadius: '2px' }} danger>Xem giỏ hàng</Button>

            </div>
        </div>

    );
    const buttonWidth = 70;

    const handleInputSearch = (e) => {
        console.log('e.target.value', e.target.value)
        setSearchName(e.target.value)
    }

    console.log('searchName', searchName)


    return (
        <>
            {/**/}
            {/* laptop */}
            <div className="content-header">
                <div className="title-header">
                    <div className="icon"><GiReactor /></div>
                    <span className="text-header" onClick={() => navigate('/')}>NEVER GIVE UP</span>
                </div>

                <div className="input-header">
                    <Input
                        size="larger"
                        placeholder="Bạn tìm gì hôm nay"
                        prefix={
                            <FcSearch style={{ fontSize: '25px' }} />
                        }
                        onChange={(e) => { handleInputSearch(e) }}
                        value={searchName}
                    />
                </div>

                <div className="cart">
                    {/* <BsCart3 /> */}
                    <Popover
                        placement="bottomRight"
                        title={text}
                        content={content}

                    >
                        <Badge size="small" count={lengthCart} showZero={true}>
                            <BsCart3 style={{ fontSize: '20px', color: '#00FFFF' }} shape="square" />
                        </Badge>
                    </Popover>
                </div>



                <div className="vl"></div>

                <div className="cropdown-header">
                    {isAuthenticated === false ?
                        <>
                            <ComponentAc />
                        </>
                        :
                        <Space wrap>
                            <Dropdown.Button menu={menuProps} onClick={handleButtonClick}>
                                <Avatar src={imageBackendPng} size={24} />
                                {user.fullName}
                            </Dropdown.Button>
                        </Space>
                    }

                </div>

            </div>

            {/* 320px — 480px: Mobile devices */}
            <div className="mobile-content-header">
                <div className="mobile-bars">
                    <FaBars onClick={showDrawer} />
                    <Drawer
                        style={{ fontSize: '18px' }}
                        title={<span style={{ fontSize: '20px' }}>Menu chức năng</span>}
                        onClose={onClose} open={open}
                        placement={'left'}
                        key={'left'}
                    >
                        <p>Quản lý tài khoản</p>
                        <Divider />
                        <p>Đăng xuất</p>
                        <Divider />
                    </Drawer>
                </div>

                <div className="mobile-input-header">
                    <Input
                        size="large"
                        placeholder="Bạn tìm gì hôm nay"
                        prefix={
                            <FcSearch style={{ fontSize: '25px' }} />
                        }
                    />
                </div>

                <div className="mobile-cart">
                    {/* <BsCart3 /> */}
                    <a href="#">
                        <Badge size="small" count={5}>
                            <BsCart3 style={{ fontSize: '28px', color: '#00FFFF' }} shape="square" />
                        </Badge>
                    </a>
                </div>
            </div>
        </>

    )
}

export default HeaderComponent;