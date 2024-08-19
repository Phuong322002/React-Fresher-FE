
import { Col, Row, Statistic } from 'antd'
import './dashboard.scss'
import CountUp from 'react-countup';
import { useEffect, useState } from 'react';
import { getDashboard } from '../../services/axiosCreateAPI';
const AdminPage = () => {

    const [dataDashboard, setDataDashboard] = useState({})

    const formatter = (value) => <CountUp end={value} separator="," />;

    useEffect(() => {
        fetchGetDashboard()
    }, [])

    const fetchGetDashboard = async () => {
        const rs = await getDashboard()
        console.log('dashboard', rs)
        if (rs && rs.data) {
            setDataDashboard(rs.data)
        }
    }

    return (
        <Row gutter={[40, 40]}>

            <Col span={12} >
                <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: "RGBA( 220, 20, 60, 0.5 )" }}>
                    <Statistic title={<span style={{ fontSize: '18px', color: "black", fontWeight: '600' }}>Tổng User</span>} value={dataDashboard.countUser} formatter={formatter} />
                </div>
            </Col>

            <Col span={12} >
                <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: "RGBA( 0, 255, 255, 0.5 )" }}>
                    <Statistic title={<span style={{ fontSize: '18px', color: 'black', fontWeight: '600' }}>Tổng đơn hàng</span>} value={dataDashboard.countOrder} precision={2} formatter={formatter} />
                </div>
            </Col>

        </Row>
    )
}

export default AdminPage