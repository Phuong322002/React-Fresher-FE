import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from "antd"
import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';


const DetailBook = (props) => {

    const {
        inforBook,
        setFileList,
        onClose,
        fileList,
        handlePreview,
        previewOpen,
        previewTitle,
        handleCancelImg,
        previewImage,
        open
    } = props

    console.log('fileList: ', fileList)
    const convertTimeupdatedAt = () => {
        const time = moment(inforBook.updatedAt).format("YYYY-MM-DD HH:mm:ss A")
        return time
    }


    const convertTimecreatedAt = () => {
        const time = moment(inforBook.createdAt).format("YYYY-MM-DD HH:mm:ss A")
        return time
    }

    const items = [
        {
            key: '1',
            label: 'Id',
            children: inforBook._id,
            // span: 1.5,
        },
        {
            key: '2',
            label: 'Tên sách',
            // span: 1.5,
            children: inforBook.mainText,
        },
        {
            key: '3',
            label: 'Tác giả',
            children: inforBook.author,
            // span: 1.5,

        },
        {
            key: '4',
            label: 'Giá tiền',
            // span: 1.5,
            children: inforBook.price,
        },
        {
            key: '5',
            label: 'Số lượng',
            // span: 1.5,
            children: inforBook.quantity,
        },
        {
            key: '6',
            label: 'Đã bán',
            // span: 1.5,
            children: inforBook.sold,
        },
        {
            key: '7',
            label: 'Thể loại',
            children: <Badge status="processing" text={inforBook.category} />,
            span: 3,
        },
        {
            key: '8',
            label: 'Created At',
            // span: 1.5,
            children: convertTimecreatedAt(),
        },

        {
            key: '9',
            label: 'Updated At',
            // span: 1.5,
            children: convertTimeupdatedAt(),
        },

    ];

    useEffect(() => {
        let arrImgthumbnail = []
        let arrImgSlider = []
        console.log('>>> Check sider image book:', inforBook)
        if (inforBook && inforBook.thumbnail) {
            const thumbnail = `${import.meta.env.VITE_BACKEND_URL}/images/book/${inforBook.thumbnail}`
            const objThumbnail = {
                uid: uuidv4(),
                name: `${inforBook.thumbnail}`,
                status: 'done',
                url: thumbnail,
            }
            arrImgthumbnail.push(objThumbnail)
        }

        if (inforBook && inforBook.slider && inforBook.slider.length > 0) {
            console.log('inforBook.slider:', inforBook.slider)
            const arrSliderNew = inforBook.slider.map((sliderImg, index) => {
                return {
                    uid: uuidv4(),
                    name: `${sliderImg}`,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${sliderImg}`,
                }
            }
            )
            console.log('arrSliderNew:', arrSliderNew)
            arrImgSlider = [...arrSliderNew]
        }

        console.log('arrImgthumbnail:', arrImgthumbnail);
        console.log("arrImgSlider:", arrImgSlider);
        const arrImgBook = arrImgthumbnail.concat(arrImgSlider);
        console.log('arrImgBook:', arrImgBook)
        setFileList(arrImgBook)

    }, [inforBook])
    // const handleChange = ({ fileList: newFileList }) => {
    //     console.log('newFileList:', newFileList)
    //     return setFileList(newFileList)
    // };

    return (
        <>
            <Drawer size='large' title="Chức năng xem chi tiết" onClose={onClose} open={open}>
                <Descriptions column={2} size={'small'} title="User Info" bordered items={items} />
                <Divider style={{ fontWeight: '600' }} orientation="left">Ảnh Books</Divider>
                <>
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        // onChange={handleChange}
                        showUploadList={
                            { showRemoveIcon: false }
                        }
                    >
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelImg}>
                        <img
                            alt="example"
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                        />
                    </Modal>
                </>
            </Drawer>
        </>
    )
}

export default DetailBook

