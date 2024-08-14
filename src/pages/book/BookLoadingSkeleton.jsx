import { Col, Row } from "antd"
import { Skeleton } from 'antd';
import { useState } from "react";


const BookLoadingSkeleton = () => {
    const [active, setActive] = useState(true);
    const [size, setSize] = useState('default');
    const [block, setBlock] = useState(false);
    const [buttonShape, setButtonShape] = useState('default');
    return (

        <div style={{ width: '100vw' }}>
            <Row gutter={[20, 20]}>
                <Col md={10} xs={0} sm={0} style={{}} >
                    <div>
                        <Skeleton.Input
                            active={active}
                            block={true}
                            style={{ width: '100%', height: '350px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: '15px' }}>
                        <Skeleton.Image active={active} />
                        <Skeleton.Image active={active} />
                        <Skeleton.Image active={active} />
                    </div>

                </Col>
                <Col md={14} sm={24} style={{}}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                        <Skeleton active={active} />
                        <Skeleton
                            active={active}
                            paragraph={
                                { rows: 2 }
                            }
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 20, marginTop: '50px', width: '25%' }}>
                        <Skeleton.Button
                            active={active}
                            shape={buttonShape}
                            block={true}
                            size="default"
                        // style={{ width: '40px' }}
                        />
                        <Skeleton.Button
                            active={active}
                            size={size}
                            shape={buttonShape}
                            block={true}
                        // style={{ width: '40px' }}

                        />
                    </div>
                </Col>

            </Row>
        </div>
    )
}

export default BookLoadingSkeleton