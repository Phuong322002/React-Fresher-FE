import { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, message } from 'antd';
import './layout.scss'
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { NavLink, Outlet } from 'react-router-dom';
import { FaUserGroup } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { FaBookAtlas } from "react-icons/fa6";
import { FaSackDollar } from "react-icons/fa6";
import { Footer } from 'antd/es/layout/layout';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useSelector } from 'react-redux';
import { Logout } from '../../services/axiosCreateAPI';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { doLogoutUser } from '../../redux/account/accountSlice';
import { FcHome } from "react-icons/fc";
import { LuLogOut } from "react-icons/lu";
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import PropTypes from 'prop-types';

const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [collapsedMB, setCollapsedMB] = useState(true);
    const [activeKey, setActiveKey] = useState('')

    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    const user = useSelector(state => state.account.user);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const LogoutUser = async () => {
        const rs = await Logout()

        console.log('>> check rs logout admin: ', rs)
        if (rs && rs.data) {
            dispatch(doLogoutUser())
            message.success(rs.data, [2]);
            navigate('/')
        }
    }

    let items = [

        {
            label: <span onClick={() => navigate('/')}>Trang Chủ</span>,
            key: '0',
            icon: <FcHome style={{ fontSize: '18px' }} />
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={() => { LogoutUser() }}>Đăng xuất</span>,
            key: '1',
            icon: <LuLogOut style={{ fontSize: '18px' }} />

        },

    ];


    const itemss = [
        {
            key: '/admin',
            icon: <MdDashboard />,
            label: <NavLink to='/admin'>Dashboard</NavLink>
        },
        {
            key: '2',
            icon: <FaUserTie />,
            label: 'Manage Users',
            children: [
                {
                    key: '/admin/user',
                    icon: <FaUserGroup />,
                    label: <NavLink to='/admin/user'>CRUD</NavLink>,
                }
            ]
        },
        {
            key: '/admin/book',
            icon: <FaBookAtlas />,
            label: <NavLink to='/admin/book'>Manage Books</NavLink>,
        },
        {
            key: '/admin/order',
            icon: <FaSackDollar />,
            label: <NavLink to='/admin/order'>Manage Orders</NavLink>,
        },
    ]

    const imageBackendPng = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`


    useEffect(() => {
        setActiveKey(window.location.pathname)
    }, [activeKey])

    const handleClickMenu = (e) => {
        console.log('e.key', e.key)
        setActiveKey(e.key)
    }
    return (

        <Layout className='main-admin' style={{ minHeight: "100vh" }}>

            {/* Laptop */}

            <Sider className='sider' theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className='title-admin'>
                    <MdOutlineAdminPanelSettings style={{ marginRight: '6px', fontSize: '20px' }} />
                    <span>Admin</span>
                </div>

                <Menu
                    mode="inline"
                    // defaultSelectedKeys={['/admin']}
                    selectedKeys={activeKey}
                    items={itemss}
                    style={{
                        height: '100%',
                        borderRight: 0,
                    }}
                    onClick={(e) => { handleClickMenu(e) }}
                />
            </Sider>

            {/* Mobile */}
            <Sider className='sider-mobile' theme='light' collapsed={collapsedMB} >
                <div className='title-admin-mobile'>
                    <MdOutlineAdminPanelSettings style={{ marginRight: '6px', fontSize: '20px' }} />
                    <span>Admin</span>
                </div>

                <Menu
                    mode="inline"
                    // defaultSelectedKeys={activeKey}
                    selectedKeys={activeKey}
                    items={itemss}
                    style={{
                        height: '100%',
                        borderRight: 0,
                    }}
                />
            </Sider>

            <Layout>
                {/* Laptop */}
                <Header
                    className='header-admin-lt'
                    style={{
                        padding: 0,
                        backgroundColor: '#c0c0c0',

                    }}

                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />

                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        bottom: '65px',
                        left: '92%',
                        // border: '1px solid',
                        width: 'fit-content'
                    }}
                    >
                        <Avatar
                            src={imageBackendPng}
                            style={{
                                marginLeft: '-45px',
                                marginTop: '16px',
                                marginRight: '10px'
                            }}
                        />

                        <Dropdown
                            menu={{ items }}
                            trigger={['click']}


                        >

                            <span onClick={(e) => e.preventDefault()} style={{ fontWeight: '600' }}>
                                <Space>
                                    {isAuthenticated === true &&
                                        user.role === 'ADMIN' &&
                                        window.location.pathname.startsWith('/admin') &&
                                        user.fullName
                                    }
                                    <DownOutlined />
                                </Space>
                            </span>
                        </Dropdown>
                    </div>

                </Header>

                {/* Moblie */}
                <Header
                    className='header-admin-mb'
                    style={{
                        padding: 0,
                        backgroundColor: '#c0c0c0',
                    }}
                >
                    <div style={{
                        textAlign: 'center',
                        fontSize: '15px',
                        fontWeight: '700',
                    }}
                    >
                        <Dropdown
                            menu={{ items }}
                            trigger={['click']}
                            size='xl'


                        >
                            <a onClick={(e) => e.preventDefault()} style={{ color: 'red' }}>
                                <Space >
                                    {isAuthenticated === true &&
                                        user.role === 'ADMIN' &&
                                        window.location.pathname.startsWith('/admin') &&
                                        user.fullName
                                    }
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                </Header>


                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 0,
                        minHeight: 280,
                        // background: 'RGBA( 220, 220, 220, 0.5 )',
                        // borderRadius: '5px'
                    }}
                >
                    <Outlet />
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>

    )
}

export default LayoutAdmin;