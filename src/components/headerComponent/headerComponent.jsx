import { GiReactor } from "react-icons/gi";
import { BsCart3 } from "react-icons/bs";
import './header.scss'
import { Divider, Input } from 'antd';
import { FcSearch } from "react-icons/fc";
import { Badge } from 'antd';
import { RiAccountCircleFill } from "react-icons/ri";
import { FaBars } from "react-icons/fa";
import { useState } from 'react';
import { Drawer } from 'antd';
import { Dropdown, message, Space, } from 'antd';
import { MdManageAccounts } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Logout } from "../../services/axiosCreateAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doLogoutUser } from "../../redux/account/accountSlice";
import { FcManager } from "react-icons/fc";
import { Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';


const HeaderComponent = () => {
    const [open, setOpen] = useState(false);
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

    console.log(">> check user:", user)



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
    }

    const items = [
        {
            label: 'Quản Lý Tài Khoản',
            key: '1',
            icon: <MdManageAccounts style={{ fontSize: '18px' }} />,
        },
        {
            label: <span onClick={() => { LogoutUser() }}>Đăng Xuất</span>,
            key: '2',
            icon: <IoLogOutOutline style={{ fontSize: '18px' }} />,
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
                        size="large"
                        placeholder="Bạn tìm gì hôm nay"
                        prefix={
                            <FcSearch style={{ fontSize: '25px' }} />
                        }
                    />
                </div>

                <div className="cart">
                    {/* <BsCart3 /> */}
                    <a href="#">
                        <Badge size="small" count={5}>
                            <BsCart3 style={{ fontSize: '20px', color: '#00FFFF' }} shape="square" />
                        </Badge>
                    </a>

                </div>

                <div className="vl"></div>

                <div className="cropdown-header">
                    {isAuthenticated === false ?
                        <>
                            <div style={{ fontSize: '25px', color: "green" }}>
                                <RiAccountCircleFill />
                            </div>
                            <span style={{ fontSize: '18px', marginTop: '2px' }}>
                                Tài Khoản
                                {/* <Dropdown
                                    menu={{
                                        items,
                                    }}
                                    trigger={['click']}
                                >
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            
                                        </Space>
                                    </a>
                                </Dropdown> */}
                            </span>
                        </>
                        :
                        <Space wrap>
                            <Dropdown.Button menu={menuProps} onClick={handleButtonClick}>
                                <Avatar src={imageBackendPng} size={24} icon={<UserOutlined />} />
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