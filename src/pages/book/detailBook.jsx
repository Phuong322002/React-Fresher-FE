import { useLocation } from "react-router-dom"
import { useParams } from "react-router-dom";
import "react-image-gallery/styles/scss/image-gallery.scss";
import ImageGallery from "react-image-gallery";
import { Col, Image, InputNumber, message, Modal, Row } from "antd";
import './detailBook.scss'
import { Rate } from 'antd';
import { useEffect, useRef, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import BookLoadingSkeleton from "./BookLoadingSkeleton";
import { getDataDetailBook } from "../../services/axiosCreateAPI";
import { doAddtoCartAction } from "../../redux/order/orderSlice";
import { useDispatch } from "react-redux";

const DetailBookParams = (props) => {

    const location = useLocation();
    const refGallery = useRef(null)
    const dispatch = useDispatch()

    const param = new URLSearchParams(location.search)
    const id = param?.get('id')
    console.log('Location, param:', location, param, id)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndexImg, setCurrentIndexImg] = useState(0)
    const [borderImg, setBoderImg] = useState(0)
    const [dataDetailBook, setDataDetailBook] = useState({})
    const [bookLoading, setBookLoading] = useState(false)
    const [currentQuatity, setCurrnentQuantity] = useState(1)
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

    useEffect(() => {
        fetchDataDetailBook()
    }, [id])

    const fetchDataDetailBook = async () => {
        setBookLoading(true)
        const rs = await getDataDetailBook(id)
        console.log('>> Check data detail book:', rs.data)
        setBookLoading(false)
        if (rs && rs.data) {
            let arrth = []
            let arrSli = []
            let arr = []
            if (rs?.data?.thumbnail) {
                let thumb = {
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${rs.data.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${rs.data.thumbnail}`,
                    originalClass: 'image'
                }
                arrth.push(thumb)
            }
            if (rs?.data?.slider.length > 0) {
                const slider = rs.data.slider.map((slider, index) => {
                    return {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${slider}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${slider}`,

                    }
                })
                arrSli = [...slider]
            }
            arr = [...arrth, ...arrSli]
            console.log('arr', arr)

            setDataDetailBook({
                author: rs?.data?.author,
                mainText: rs?.data?.mainText,
                sold: rs?.data?.sold,
                price: rs?.data?.price,
                quantity: rs?.data?.quantity,
                images: arr,
                _id: rs?.data?._id
            })
        }
    }
    console.log('dataDetailBook', dataDetailBook)

    //Model show image
    const showModal = () => {
        setIsModalOpen(true);
        refGallery.current.slideToIndex(borderImg)
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    console.log('refGallery', refGallery.current)

    const displayImgCurrent = (index) => {
        console.log('test', index)
        setCurrentIndexImg(index)
        setBoderImg(index)
    }

    const handleClickThumbnail = (index) => {
        setCurrentIndexImg(index)
        refGallery?.current?.slideToIndex(index);

    }

    const test = (index) => {
        let i = refGallery.current.getCurrentIndex()
        console.log('iii', i)
        setCurrentIndexImg(i)
    }

    // useEffect(() => {
    //     r.current = borderImg
    // }, [borderImg])


    console.log('borderImg', borderImg)

    // onChange input
    const handleOnchangeInput = (e) => {
        console.log('e.target.value', e.target.value)
        setCurrnentQuantity(e.target.value)
    }
    // click +- change quantity
    const handleMinusPlus = (e, type) => {
        console.log('type', type)
        if (type === 'MINUS') {
            // alert('-')
            if (currentQuatity <= 1) return
            setCurrnentQuantity(+currentQuatity - 1)
        }
        if (type === 'PLUS') {
            // alert(typeof +currentQuatity)
            setCurrnentQuantity(+currentQuatity + 1)

        }
    }
    // handle add to cart 
    const handleAddToCart = (quantity, detailBook) => {
        // alert('cc')
        console.log('quantity, detailBook', quantity, detailBook)
        dispatch(doAddtoCartAction(
            {
                quantity,
                _id: detailBook._id,
                detailBook
            }
        ))
        message.success('Sản phẩm đã được thêm vào giỏ hàng', [2])
    }
    return (
        <div style={{
            // height: 'calc(100vh - 120px)',
            height: 'fit-content',
            padding: '10px',
            // overflow: 'hidden'
        }}>
            <div className="main-detail">
                <Row gutter={24}>
                    {/* <BookLoadingSkeleton /> */}
                    {bookLoading === true
                        ?
                        <BookLoadingSkeleton />
                        :
                        <>
                            {/* Col PC */}
                            <Col md={12} xs={0} sm={0} span={12}>
                                <div className="img-detail">
                                    <ImageGallery
                                        items={dataDetailBook.images && dataDetailBook.images.length > 0 ?
                                            dataDetailBook.images : []
                                        }
                                        showBullets={false}
                                        showPlayButton={false}
                                        showFullscreenButton={false}
                                        showNav={false}
                                        preventDefaultTouchmoveEvent={true}
                                        slideOnThumbnailOver={true}
                                        onClick={showModal}
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>}
                                        showIndex={true}
                                        onSlide={(index) => { displayImgCurrent(index) }}
                                        thumbnailClass='slider'
                                    // startIndex={0}
                                    />

                                    <Modal
                                        onOk={handleOk}
                                        width={'60vw'}
                                        open={isModalOpen}
                                        onCancel={handleCancel}
                                        footer={null} //hide footer
                                        closable={false} //hide close button
                                        className="modal-gallery"
                                    // maskClosable={false}
                                    >
                                        <Row gutter={24}>
                                            <Col span={16}>
                                                <ImageGallery
                                                    ref={refGallery}
                                                    items={dataDetailBook.images && dataDetailBook.images.length > 0 ?
                                                        dataDetailBook.images : []
                                                    }
                                                    showPlayButton={false} //hide play button
                                                    showFullscreenButton={false} //hide fullscreen button
                                                    // startIndex={currentIndex} // start at current index
                                                    showThumbnails={false} //hide thumbnail
                                                    // onSlide={(i) => setActiveIndex(i)}
                                                    slideDuration={0} //duration between slices
                                                    showIndex={true}
                                                    startIndex={borderImg}
                                                    onSlide={(index) => { test(index) }}
                                                    originalClass='model-thumb'
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <div style={{ padding: "5px 0 20px 0" }}>{'dsfds'}</div>
                                                <div>
                                                    <Row gutter={[20, 20]}>
                                                        {
                                                            dataDetailBook.images && dataDetailBook.images.length > 0 && dataDetailBook.images.map((item, i) => {
                                                                return (
                                                                    <Col key={`image-${i}`}>
                                                                        <Image
                                                                            style={currentIndexImg === i ? { border: '4px solid red' } : {}}
                                                                            wrapperClassName={"img-normal"}
                                                                            width={100}
                                                                            height={100}
                                                                            src={item.original}
                                                                            preview={false}
                                                                            onClick={() => {
                                                                                handleClickThumbnail(i)
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

                            {/* Col mobile */}
                            <Col md={0} xs={24} sm={24} span={12}>
                                <div className="img-detail-mobile">
                                    <ImageGallery
                                        items={images}
                                        showBullets={false}
                                        showPlayButton={false}
                                        showFullscreenButton={false}
                                        showNav={false}
                                        preventDefaultTouchmoveEvent={true}
                                        slideOnThumbnailOver={true}
                                        onClick={false}
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>}
                                        showThumbnails={false}
                                    />
                                    {/* <Modal
                            onOk={handleOk}
                            width={'60vw'}
                            open={isModalOpen}
                            onCancel={handleCancel}
                            footer={null} //hide footer
                            closable={false} //hide close button
                            className="modal-gallery"
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
                                    {/* </Col>
                                                    )
                                                })
                                            }
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Modal> */}

                                </div>
                            </Col>
                            {/*  */}
                            <Col md={12} xs={24} sm={24} span={12}>
                                <div className="content-detailbook">
                                    <div className="author" style={{ fontSize: '15px' }}>Tác giả: <a>{dataDetailBook.author}</a></div>
                                    <div className="mainText" style={{ fontSize: '24px' }}>{dataDetailBook.mainText}</div>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <Rate style={{ fontSize: '12px', }} allowHalf defaultValue={5} />
                                        <div className="vl"></div>
                                        <span >Đã bán {dataDetailBook.sold}</span>
                                    </div>
                                    <div className="price" style={{ padding: '15px', borderRadius: '3px', backgroundColor: 'RGBA( 169, 169, 169, 0.15)' }}>
                                        <span style={{ fontSize: '30px', fontWeight: "600", color: 'red' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetailBook.price)}</span>
                                    </div>
                                    <div>
                                        <Row gutter={[20, 20]}>
                                            <Col span={4}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                                    <span > Vận chuyển </span>
                                                    <span> Số lượng </span>
                                                </div>
                                            </Col>
                                            <Col span={16}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                                    <span>Miễn phí vận chuyển</span>
                                                    <div style={{ display: 'flex' }}>
                                                        <button
                                                            style={{
                                                                alignItems: 'center',
                                                                background: 'transparent',
                                                                // border: '0',
                                                                border: '1px solid rgba(0, 0, 0, .09)',
                                                                borderRadius: "2px",
                                                                color: 'rgba(0, 0, 0, .8)',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                fontSize: '.875rem',
                                                                fontWeight: '300',
                                                                height: '32px',
                                                                justifyContent: 'center',
                                                                letterSpacing: '0',
                                                                lineHeight: '1',
                                                                outline: 'none',
                                                                // transition: backgroundColor .1s cubic-bezier(.4,0,.6,1);
                                                                width: "32px"
                                                            }}
                                                            onClick={(event) => { handleMinusPlus(event, "MINUS") }}
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            value={currentQuatity}
                                                            style={{
                                                                webkitAppearance: ' none',
                                                                border: '1px solid rgba(0, 0, 0, .09)',
                                                                borderLeft: '0px',
                                                                borderRadius: '0px',
                                                                borderRight: "0px",
                                                                boxSizing: "border-box",
                                                                cursor: "text",
                                                                fontSize: "16px",
                                                                fontWeight: '400',
                                                                height: '32px',
                                                                textAlign: 'center',
                                                                width: '50px',
                                                                alignItems: 'center',
                                                                background: 'transparent',
                                                                color: 'rgba(0, 0, 0, .8)',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                letterSpacing: '0',
                                                                // lineHeight: '1',
                                                                outline: 'none',
                                                                transition: 'background-color .1s',

                                                            }}
                                                            type="text"
                                                            onChange={(event) => { handleOnchangeInput(event) }}
                                                        />
                                                        <button
                                                            style={{
                                                                alignItems: 'center',
                                                                background: 'transparent',
                                                                // border: '0',
                                                                border: '1px solid rgba(0, 0, 0, .09)',
                                                                borderRadius: "2px",
                                                                color: 'rgba(0, 0, 0, .8)',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                fontSize: '.875rem',
                                                                fontWeight: '300',
                                                                height: '32px',
                                                                justifyContent: 'center',
                                                                letterSpacing: '0',
                                                                lineHeight: '1',
                                                                outline: 'none',
                                                                // transition: backgroundColor .1s cubic-bezier(.4,0,.6,1);
                                                                width: "32px"
                                                            }}
                                                            onClick={(event) => { handleMinusPlus(event, "PLUS") }}
                                                        >
                                                            +
                                                        </button>

                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>



                                    </div>

                                    <div className="btn" style={{ display: 'flex', gap: 25 }}>
                                        <button
                                            className="add-cart"
                                            style={{
                                                maxWidth: "250px",
                                                height: "48px",
                                                padding: "0 15px",
                                                fontSize: '14px',
                                                color: '#d0011b',
                                                border: '1px solid',
                                                borderRadius: '3px',
                                                background: "rgb(255 87 34 / 10%)",
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => { handleAddToCart(+currentQuatity, dataDetailBook) }}
                                        >
                                            <BsCartPlus /><span style={{ marginLeft: '5px' }}>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button
                                            className="purchase"
                                            style={{
                                                backgroundColor: '#ee4d2d',
                                                height: "48px",
                                                padding: '0 20px',
                                                borderRadius: '3px',
                                                border: '0px',
                                                color: 'white'
                                            }}
                                        >Mua ngay
                                        </button>
                                    </div>

                                </div>
                            </Col>
                        </>
                    }

                </Row>
            </div >
        </div >

    )
}

export default DetailBookParams