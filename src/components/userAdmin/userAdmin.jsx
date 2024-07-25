import { Button, Table } from 'antd';
import './userTableAdmin.scss';
import { getUserWithPaginate } from '../../services/axiosCreateAPI';
import { useEffect, useState } from 'react';
import InputSearchUser from './InputSearchUser';
import { TfiReload } from "react-icons/tfi";
import { CloudDownloadOutlined, PlusOutlined } from '@ant-design/icons';

const UserTableAdmin = () => {


    const columns = [
        {
            title: 'No',
            key: 'sno',
            width: '20px',
            render: (text, object, index) => index + 1,
        },
        {
            title: 'ID',
            dataIndex: '_id',
        },
        {
            title: 'User Name',
            dataIndex: 'fullName',
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
                multiple: 3,
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: {
                compare: (a, b) => a.math - b.math,
                multiple: 2,
            },
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: {
                compare: (a, b) => a.english - b.english,
                multiple: 1,
            },
        },
        {
            title: 'Action',
            render: (text, object, index) => {
                return <button>Delete</button>;
            },
        },
    ];

    const [listUserWithPaginate, setListUser] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setLoading] = useState(false)

    useEffect((querySearchUser) => {
        fetchGetUserWithPaginate(querySearchUser);
    }, [current, pageSize]);

    const fetchGetUserWithPaginate = async (querySearchUser) => {
        setLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;

        if (querySearchUser) {
            query += `${querySearchUser}`
        }
        const rs = await getUserWithPaginate(query);
        setLoading(false)
        console.log('>>> check rs get user with paginate: ', rs);
        if (rs && rs.data) {
            setListUser(rs.data.result);
            setTotal(rs.data.meta.total);
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);

        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    console.log('listUserWithPaginate: ', listUserWithPaginate);
    console.log('pageSize: ', pageSize);
    console.log('current: ', current);



    return (
        <div className="main-user-table">
            <div
                className="search-user"
                style={{
                    margin: '0px 0px 24px 0px',
                    minHeight: 200,
                    background: 'RGBA(220, 220, 220, 0.3)',
                    borderRadius: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    padding: '20px',
                    gap: 20,
                }}
            >
                <InputSearchUser
                    fetchGetUserWithPaginate={fetchGetUserWithPaginate}
                />
            </div>
            <div
                className="search-user"
                style={{
                    margin: '0px 0px 24px 0px',
                    minHeight: 200,
                    background: 'RGBA(220, 220, 220, 0.3)',
                    borderRadius: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    padding: '20px',
                    gap: 20,
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <div>
                        <Button style={{ background: "green", borderColor: "yellow" }}><CloudDownloadOutlined /> Export</Button>
                    </div>

                    <div>
                        <Button style={{ background: "orange", borderColor: "yellow" }}><CloudDownloadOutlined /> Import</Button>
                    </div>
                    <div>
                        <Button type="primary" ><PlusOutlined /> Add user</Button>
                    </div>
                    <div>
                        <Button onClick={() => fetchGetUserWithPaginate()}><TfiReload /></Button>
                    </div>

                </div>



                <Table
                    size="large"
                    columns={columns}
                    dataSource={listUserWithPaginate}
                    onChange={onChange}
                    pagination={{
                        pageSize: pageSize,
                        current: current,
                        total: total,
                        showSizeChanger: true,
                    }}
                    loading={isLoading}
                />
            </div>

        </div>
    );
};

export default UserTableAdmin;
