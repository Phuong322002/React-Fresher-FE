import { Button, Drawer, Table } from 'antd';
import './userTableAdmin.scss';
import { getUserWithPaginate } from '../../services/axiosCreateAPI';
import { useEffect, useState } from 'react';
import InputSearchUser from './InputSearchUser';
import { TfiReload } from "react-icons/tfi";
import { CloudDownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Descriptions } from 'antd';
import moment from 'moment';
const UserTableAdmin = () => {



    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const [inforUser, setInforUser] = useState('')

    const hanldeDetailUser = (record) => {
        showDrawer()
        if (record && record._id) {
            setInforUser(record)
        }
    }

    const convertTime = () => {
        const time = moment(inforUser.updatedAt).format("YYYY-MM-DD HH:mm:ss A")
        return time

    }

    const items = [
        {
            key: '1',
            label: 'Id',
            children: inforUser._id,
            span: 1.5,
        },
        {
            key: '2',
            label: 'User Name',
            span: 1.5,
            children: inforUser.fullName,
        },
        {
            key: '3',
            label: 'Email',
            children: inforUser.email,
            span: 1.5,

        },
        {
            key: '4',
            label: 'Phone',
            span: 1.5,
            children: inforUser.phone,
        },
        {
            key: '5',
            label: 'Role',
            children: <Badge status="processing" text={inforUser.role} />,
            span: 3,
        },
        {
            key: '6',
            label: 'Created At',
            span: 1.5,
            children: convertTime(),
        },

        {
            key: '7',
            label: 'Updated At',
            span: 1.5,
            children: convertTime(),
        },

    ];

    const columns = [
        {
            title: 'No',
            key: 'sno',
            width: '20px',
            render: (text, object, index) => {
                return index + 1
            }
        },
        {
            title: 'ID',
            dataIndex: '_id',
            render: (text, record) => {
                console.log('text, record', text, record)
                return (
                    <>
                        <a
                            onClick={() => { hanldeDetailUser(record) }}
                        >
                            {record._id}
                        </a>


                    </>
                );
            }
        },
        {
            title: 'User Name',
            dataIndex: 'fullName',
            sorter: {},
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: {
                compare: (a, b) => {
                    console.log('a,b', a, b)

                }
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
            render: (text, object, index, record) => {

                return <button>Delete</button>;
            },
        },
    ];

    const [listUserWithPaginate, setListUser] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setLoading] = useState(false)
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('')

    console.log('>> check filter:', filter)
    useEffect(() => {
        fetchGetUserWithPaginate();
    }, [current, pageSize, filter, sort]);

    const fetchGetUserWithPaginate = async () => {
        setLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;

        if (filter != '') {
            query += `${filter}`
        }

        if (sort != '') {
            query += sort
        }


        const rs = await getUserWithPaginate(query);
        setLoading(false)
        console.log('>>> check rs get user with paginate: ', rs);
        if (rs && rs.data) {
            setListUser(rs.data.result);
            setTotal(rs.data.meta.total);
        }
    };

    const handleSearch = (querySearchUser) => {
        setFilter(querySearchUser)
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);

        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }

        if (sorter) {
            console.log('Check sort:', sorter)

            let sortUser = sorter.order === "ascend" ? `&sort=${sorter.field}` : `&sort=-${sorter.field}`

            setSort(sortUser)

            if (sorter.order === undefined) {
                setSort('')
            }
        }

    };

    console.log('listUserWithPaginate: ', listUserWithPaginate);
    console.log('pageSize: ', pageSize);
    console.log('current: ', current);
    console.log('sort: ', sort);
    console.log("record._id", inforUser)



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
                    handleSearch={handleSearch}
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
                        <Button onClick={() => {
                            setFilter('')
                            setSort('')
                        }}><TfiReload /></Button>
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
                        pageSizeOptions: [5, 10, 20, 50, 100],
                        showSizeChanger: true,
                    }}
                    loading={isLoading}
                // onRow={(record, rowIndex) => {
                //     return {
                //         onClick: (event) => { }, // click row

                //     };
                // }}
                />
            </div>
            <Drawer size='large' title="Detail User" onClose={onClose} open={open}>
                <Descriptions column={2} size={'small'} title="User Info" bordered items={items} />
            </Drawer>
        </div>
    );
};

export default UserTableAdmin;
