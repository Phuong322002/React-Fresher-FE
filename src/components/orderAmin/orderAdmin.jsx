import { Table } from "antd";
import { useEffect, useState } from "react";
import { getGetListOrder } from "../../services/axiosCreateAPI";
import moment from "moment";

const OrderAdmin = () => {
    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            render: (text, record) => {
                console.log
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}
                    </>
                )
            },
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
                multiple: 3,
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: {
                compare: (a, b) => a.math - b.math,
                multiple: 2,
            },
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: {
                compare: (a, b) => a.english - b.english,
                multiple: 1,
            },
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: {
                compare: (a, b) => a.english - b.english,
                multiple: 1,
            },
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            render: (text, record) => {
                return (<>
                    {moment(record.updatedAt).format("YYYY-MM-DD HH:mm:ss A")}
                </>)
            },
            sorter: {
                compare: (a, b) => a.english - b.english,
                multiple: 1,
            },
        },
    ];

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0)
    const [listOrder, setListOrder] = useState([])
    const [loading, setLoading] = useState(false)
    const onChange = async (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize)
    };


    const data = listOrder


    useEffect(() => {

        fetchGetListOrder()
    }, [currentPage, pageSize])

    const fetchGetListOrder = async () => {
        let query = ''
        setLoading(true)
        query += `current=${currentPage}&pageSize=${pageSize}`
        const rs = await getGetListOrder(query)
        setLoading(false)
        console.log('rs order', rs)
        if (rs && rs.data.result) {
            setListOrder(rs.data.result)
            setTotal(rs.data.meta.total)
        }
    }


    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                onChange={onChange}
                pagination={{
                    // showTotal: {(total, range) => `${range[0]}-${range[1]} of ${total} items`},
                    current: currentPage,
                    total: total,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20, 50, 100]
                }}
                loading={loading}
            />
        </>
    )
}

export default OrderAdmin