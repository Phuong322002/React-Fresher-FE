import { UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space } from 'antd';
import { RiAccountCircleFill } from 'react-icons/ri';
import { CgLogIn } from "react-icons/cg";
import { NavLink } from 'react-router-dom';


const ComponentAc = () => {

    const items = [
        {
            label: <NavLink to='/login' style={{ textDecoration: 'none' }}>Đăng nhập</NavLink>,
            key: '1',
            icon: <CgLogIn style={{ fontSize: '15px' }} />,
        },
        {
            label: <NavLink to='/register' style={{ textDecoration: 'none' }}>Đăng ký</NavLink>,
            key: '2',
            icon: <UserOutlined />,
        },

    ];
    const menuProps = {
        items,
    };
    return (<>
        <Space wrap>
            <Dropdown.Button menu={menuProps} >
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>

                    <RiAccountCircleFill style={{ fontSize: '20px' }} />

                    <span style={{ fontSize: '15px' }}>
                        Tài Khoản
                    </span>
                </div>
            </Dropdown.Button>
        </Space>
    </>)
}

export default ComponentAc