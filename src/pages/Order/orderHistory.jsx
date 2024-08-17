
import { Space, Table, Tag } from 'antd';
import './orderHistory.scss'
import { getOrderHistory } from '../../services/axiosCreateAPI';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view'
import moment from 'moment';

const OrderHistory = () => {

    const [dataOrderHis, setDataOrderHis] = useState([])
    const [detailOrder, setDetailOrder] = useState([])
    const columns = [
        {
            title: 'STT',
            render: (text, record, index) => {
                console.log('index', record, index)
                return index + 1
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'updatedAt',
            render: (updatedAt) => {
                return (
                    <>
                        {moment(updatedAt).format("YYYY/MM/DD kk:mm:ss A")}
                    </>
                )
            }
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (totalPrice) => {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${totalPrice}`)}
                    </>
                )
            }
        },
        {
            title: 'Trạng thái',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            render: () => {
                return (
                    <>
                        <Tag color="#87d068">Thành công</Tag>
                    </>
                )
            }
        },
        {
            title: 'Chi tiết',
            key: 'detail',
            dataIndex: 'detail',
            render: (detail) => {
                console.log(">> check data order hsitory:", dataOrderHis)
                return (
                    <>

                        <ReactJson
                            src={detail}
                            name='Chi tiết đơn mua'
                            displayDataTypes={false}
                            collapsed={true}
                        />
                    </>
                )
            }
        },
    ];
    const data = dataOrderHis

    useEffect(() => {
        fetchDataOrderHis()
    }, [])

    const fetchDataOrderHis = async () => {
        const rs = await getOrderHistory()
        if (rs && rs.data) {
            setDataOrderHis(rs.data)
        }
    }


    return (
        <div className='order-history'>

            <Table
                showHeader={true}
                title={() => <><span style={{ fontWeight: '600' }}>Lịch sử đặt hàng:</span></>}
                columns={columns}
                dataSource={data}
                pagination={false}
            />
        </div>

    )
}
export default OrderHistory