import { Table } from 'antd';
import './userTableAdmin.scss'
import { Input } from 'antd';
import { Button, Flex } from 'antd';


//
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Chinese Score',
        dataIndex: 'chinese',
        sorter: {
            compare: (a, b) => a.chinese - b.chinese,
            multiple: 3,
        },
    },
    {
        title: 'Math Score',
        dataIndex: 'math',
        sorter: {
            compare: (a, b) => a.math - b.math,
            multiple: 2,
        },
    },
    {
        title: 'English Score',
        dataIndex: 'english',
        sorter: {
            compare: (a, b) => a.english - b.english,
            multiple: 1,
        },
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        chinese: 98,
        math: 60,
        english: 70,
    },
    {
        key: '2',
        name: 'Jim Green',
        chinese: 98,
        math: 66,
        english: 89,
    },
    {
        key: '3',
        name: 'Joe Black',
        chinese: 98,
        math: 90,
        english: 70,
    },
    {
        key: '4',
        name: 'Jim Red',
        chinese: 88,
        math: 99,
        english: 89,
    },
];
const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};
const UserTableAdmin = () => {

    return (
        <div className='main-user-table'>
            <div className='search-user' style={{
                margin: '0px 0px 24px 0px',
                minHeight: 200,
                background: 'RGBA( 220, 220, 220, 0.3 )',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                padding: '20px',
                gap: 20
            }}>

                <div style={{ display: 'flex', gap: 20 }}>
                    <div style={{ width: '35%' }}>
                        <label  >Name</label>
                        <Input style={{ marginTop: '10px' }} placeholder="placeholder" />
                    </div>
                    <div style={{ width: '35%' }}>
                        <label>Email</label>
                        <Input style={{ marginTop: '10px' }} placeholder="placeholder" />
                    </div>
                    <div style={{ width: '35%' }}>
                        <label>SDT</label>
                        <Input style={{ marginTop: '10px' }} placeholder="placeholder" />
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 10
                    }}
                >
                    <Button type="primary">Search</Button>
                    <Button>Clear</Button>
                </div>


            </div>

            <Table
                size='large'
                columns={columns}
                dataSource={data}
                onChange={onChange}
            />
        </div>

    )
}

export default UserTableAdmin