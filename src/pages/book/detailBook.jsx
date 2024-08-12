import { useLocation } from "react-router-dom"
import { useParams } from "react-router-dom";
import "react-image-gallery/styles/scss/image-gallery.scss";
import ImageGallery from "react-image-gallery";
import { Col, Image, InputNumber, Modal, Row } from "antd";
import './detailBook.scss'
import { Rate } from 'antd';
import { useRef, useState } from "react";


const DetailBookParams = (props) => {

    const location = useLocation();
    const refGallery = useRef(null)

    const param = new URLSearchParams(location.search)
    const id = param?.get('id')
    console.log('Location, param:', location, param, id)

    const [isModalOpen, setIsModalOpen] = useState(false);

    // image detail
    const images = [
        {
            original: "https://picsum.photos/id/1018/1000/600/",
            thumbnail: "https://picsum.photos/id/1018/250/150/",
        },
        {
            original: "https://picsum.photos/id/1015/1000/600/",
            thumbnail: "https://picsum.photos/id/1015/250/150/",
        },
        {
            original: "https://picsum.photos/id/1019/1000/600/",
            thumbnail: "https://picsum.photos/id/1019/250/150/",
        },

    ];

    //Model show image
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const renderItem = (item) => {
        return (
            <div className="image-gallery-image">
                <img src={item.original} alt={item.description} />
                {
                    item.description && (
                        <span className="image-gallery-description">
                            {item.description}
                        </span>
                    )
                }
            </div>
        )
    };

    const renderThumbInner = (item) => {
        return (
            <>
                <div className="custom-thumb">
                    <img src={item.thumbnail} alt={item.description} />
                    <div className="thumb-text">{item.description}</div>
                </div>
            </>
        );
    };


    console.log('refGallery', refGallery.current)
    return (

        <div className="main-detail">
            <Row gutter={24}>
                <Col span={12}>
                    <div className="img-detail">
                        <ImageGallery
                            items={images}
                            showBullets={false}
                            showPlayButton={false}
                            showFullscreenButton={false}
                            showNav={false}
                            preventDefaultTouchmoveEvent={true}
                            slideOnThumbnailOver={true}
                            onClick={showModal}
                            renderLeftNav={() => <></>} //left arrow === <> </>
                            renderRightNav={() => <></>}

                        />
                        {/* <Modal width={900} title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <ImageGallery
                                ref={refGallery}
                                items={images}
                                showBullets={false}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                // showNav={false}
                                preventDefaultTouchmoveEvent={true}
                                // slideOnThumbnailOver={true}
                                onClick={showModal}
                                thumbnailLoading='eager'
                                thumbnailPosition='right'
                            // renderItem={renderItem} // Sử dụng renderItem trong modal
                            // renderThumbInner={renderThumbInner} // Sử dụng renderThumbInner để tùy chỉnh thumbnails

                            />
                        </Modal> */}
                        <Modal
                            onOk={handleOk}
                            width={'60vw'}
                            open={isModalOpen}
                            onCancel={handleCancel}
                            footer={null} //hide footer
                            closable={false} //hide close button
                        // className="modal-gallery"
                        // maskClosable={false}
                        >
                            <Row gutter={[20, 20]}>
                                <Col span={16}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={images}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        // startIndex={currentIndex} // start at current index
                                        showThumbnails={false} //hide thumbnail
                                        // onSlide={(i) => setActiveIndex(i)}
                                        slideDuration={0} //duration between slices
                                    // startIndex={2}
                                    />
                                </Col>
                                <Col span={8}>
                                    <div style={{ padding: "5px 0 20px 0" }}>{'dsfds'}</div>
                                    <div>
                                        <Row gutter={[20, 20]}>
                                            {
                                                images?.map((item, i) => {
                                                    return (
                                                        <Col key={`image-${i}`}>
                                                            <Image
                                                                wrapperClassName={"img-normal"}
                                                                width={100}
                                                                height={100}
                                                                src={item.original}
                                                                preview={false}
                                                                onClick={() => {
                                                                    refGallery.current.slideToIndex(i);
                                                                }}
                                                            />
                                                            {/* <div className={activeIndex === i ? "active" : ""}></div> */}
                                                        </Col>
                                                    )
                                                })
                                            }
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Modal>

                    </div>
                </Col>

                <Col>
                    <div className="content-detailbook">
                        <div>Tác giả: Jo Hemmings</div>
                        <div>How Psychology Works - Hiểu Hết Về Tâm Lý Học</div>
                        <div>
                            <Rate style={{ fontSize: '12px', marginRight: '8px' }} allowHalf defaultValue={5} />
                            <span >Đã bán 123</span>
                        </div>
                        <div>
                            2423423423 ₫
                        </div>
                        <div>
                            Vận chuyển Miễn phí vận chuyển
                        </div>
                        <div>
                            <span> Số lượng </span>
                            <InputNumber
                                addonBefore="-"
                                addonAfter="+"
                                defaultValue={100}
                                size="small"
                            />
                        </div>
                        <div>
                            <button>Thêm vào giỏ hàng</button>
                            <button>Mua ngay</button>
                        </div>

                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default DetailBookParams