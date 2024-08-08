import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Col, ConfigProvider, Divider, Form, Input, InputNumber, message, Modal, Popconfirm, Popover, Row, Select, Upload } from "antd"
import { useEffect, useState } from "react";
import { postUploadImgBook } from "../../services/axiosCreateAPI";
import { RiDeleteBin6Fill, RiEdit2Fill } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import { deleteABook, updateABook } from "../../services/axiosCreateAPI";

const UpdateAndDeleteBook = (props) => {

    const { listTypeBook, dataSlider, setDataSlider, record, setDataThumbnail, dataThumbnail, fetchGetListBookWithPaginate } = props

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [isLoadingModal, setIsLoadingModal] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [dataBook, setDataBook] = useState(record)
    const [dataImgThumbnail, setDataThumbnailNew] = useState([])
    const [dataImgSlider, setDataImgSlider] = useState([])
    const [init, setInit] = useState({})

    useEffect(() => {
        if (dataBook && dataBook.thumbnail) {
            const thumbnailnew = `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataBook.thumbnail}`;
            const arrThumbnail = [{
                uid: uuidv4(),
                name: `${dataBook.thumbnail}`,
                status: 'done',
                url: thumbnailnew,
            }];
            const arrSlider = dataBook.slider.map((imgSlider) => {
                return {
                    uid: uuidv4(),
                    name: imgSlider,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${imgSlider}`,
                }
            });


            const thumb = [{
                name: arrThumbnail[0].name,
                uid: arrThumbnail[0].uid
            }]

            const slider = arrSlider.map((imgSlider, index) => {
                return {
                    name: imgSlider.name,
                    uid: imgSlider.uid
                }
            })

            const datainit = {
                _id: dataBook._id,
                author: dataBook.author,
                category: dataBook.category,
                mainText: dataBook.mainText,
                price: dataBook.price,
                quantity: dataBook.quantity,
                sold: dataBook.sold,
                thumbnail: {
                    fileList: arrThumbnail
                },
                slider: { fileList: arrSlider }
            };

            setInit(datainit);
            setDataThumbnailNew(thumb);
            setDataImgSlider(slider);
            form.setFieldsValue(datainit);
        }

        return () => {
            form.resetFields()
        }
    }, [dataBook]);

    console.log('dataBookaa', dataBook)
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const showModal = () => {
        setDataBook(record)
        form.setFieldsValue(dataBook)
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields()
    };
    const onFinish = async (values) => {
        console.log('Success:', values);
        let stringThumb = ''
        // dataImgSlider dataImgThumbnail
        if (dataImgThumbnail && dataImgThumbnail.length > 0) {
            stringThumb = dataImgThumbnail[0].name
        }

        let arrSlider = [];
        if (dataImgSlider && dataImgSlider.length > 0) {
            const arr = dataImgSlider.map((imgslider, index) => {
                return imgslider.name
            })
            arrSlider = [...arr]
        }

        console.log(">> check:", stringThumb, arrSlider)
        const { _id, thumbnail, slider, mainText, author, price, sold, quantity, category } = values
        const res = await updateABook(_id, stringThumb, arrSlider, mainText, author, price, sold, +quantity, category);
        console.log('res update book:', res)
        if (res && res.data) {
            message.success("Update information book successful", [2]);
            fetchGetListBookWithPaginate()
            setIsModalOpen(false);
        } else {
            message.error("Update information book fail", [2]);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    let options = [];
    if (listTypeBook && listTypeBook.length > 0) {
        const arrListBook = listTypeBook.map((typeBook, index) => {
            return {
                value: typeBook,
                label: typeBook,
            }
        })
        options = [...arrListBook]
    }
    const getFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handlePreviewThumnail = async (file) => {
        console.log('file:', file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const getBase64AddImg = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handleChangeAddImg = (info, type) => {
        console.log('info', info)
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64AddImg(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };


    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        console.log("Check file thumbnail:", file)
        const res = await postUploadImgBook(file)
        console.log('>> check res thumbnail: ', res.data.fileUploaded)
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
        if (res && res.data) {
            setDataThumbnailNew([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
        }

    };


    const handleDeleteFileImg = (info, type) => {

        if (type === 'THUMBNAIL') {
            setDataThumbnailNew([])
        }

        console.log('info:', dataSlider, info)
        if (type === 'SLIDER') {
            const newArr = dataImgSlider.filter((img, index) => {
                return img.uid !== info.uid
            })
            console.log('newArr:', newArr)
            setDataImgSlider(newArr)
        }
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const uploadButtonSlider = (
        <div>
            {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );


    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        console.log("Check file slider:", file)

        const resSlider = await postUploadImgBook(file)
        console.log(">> check res slider:", resSlider)
        if (resSlider && resSlider.data) {
            setDataImgSlider((dataSlider) => [...dataSlider, {
                name: resSlider.data.fileUploaded,
                uid: file.uid
            }])
        }
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    const handleCancelModalThumnail = () => setPreviewOpen(false);

    const [open, setOpen] = useState(false);

    const handleOpenChange = () => {
        setOpen(true);
    };

    const content = (
        <div>
            <p style={{ marginBottom: '10px', fontSize: '14px' }}>Bạn có chắc muốn xóa user này ?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                {/* <Button onClick={hide}>Close</Button>
                <Button type="primary" onClick={() => { handleDeleteUser() }}>Xác nhận</Button> */}
            </div>
        </div >
    );
    const text = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {/* <RiErrorWarningFill style={{ fontSize: '18px', color: '	#ffcc00' }} /> */}
                <span style={{ fontSize: '17px' }}>
                    Xác nhận xóa book
                </span>
            </div>
        )
    }
    console.log('dataBook', dataBook)
    // useEffect(() => {
    //     //companyInfo -> dynamic obj fetched from API
    //     const thumbnailnew = `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataBook.thumbnail}`
    //     setDataThumbnailNew()

    //     const arrThumbnail = [{
    //         uid: uuidv4(),
    //         name: `${dataBook.thumbnail}`,
    //         status: 'done',
    //         url: thumbnailnew,
    //     }]

    //     const arrSlider = dataBook.slider.map((imgSlider) => {
    //         return {
    //             uid: uuidv4(),
    //             name: imgSlider,
    //             status: 'done',
    //             url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${imgSlider}`,
    //         }
    //     })

    //     const datainit = {
    //         _id: dataBook._id,
    //         author: dataBook.author,
    //         category: dataBook.category,
    //         mainText: dataBook.mainText,
    //         price: dataBook.price,
    //         quantity: dataBook.quantity,
    //         sold: dataBook.sold,
    //         thumbnail: { fileList: arrThumbnail },
    //         slider: { fileList: arrSlider }
    //     }

    //     setInit(datainit)
    //     setDataThumbnail(arrThumbnail)
    //     setDataSlider(arrSlider)
    //     form.setFieldsValue(datainit);

    // }, [dataBook, form]);


    console.log('init', init)
    const confirm = async () => {
        console.log(record)
        const res = await deleteABook(record._id)
        console.log(">> check res delete a book: ", res)
        if (res && res.data) {
            message.success('Delete a book successfuly ^^', [2]);
            fetchGetListBookWithPaginate()
        }
    };

    console.log('dataThumbnailupdate', dataImgThumbnail)
    console.log('dataImgSlider', dataImgSlider)

    return (
        <>
            <>
                <ConfigProvider>
                    <div className="demo">
                        <div
                            style={{
                                float: 'inline-start',
                            }}
                        >
                            <Popconfirm placement="right" title={text} onConfirm={confirm} okText="Yes" cancelText="No">
                                <RiDeleteBin6Fill style={{ color: '#ff7f50', fontSize: '15px', marginRight: '15px' }} />
                            </Popconfirm>
                        </div>
                    </div>
                </ConfigProvider>
            </>

            <RiEdit2Fill onClick={showModal} style={{ color: '#6495ed', fontSize: '15px' }} />
            <Modal
                width={'50%'}
                maskClosable={false}
                title="Thêm Mới Sách"
                open={isModalOpen}
                onOk={form.submit}
                onCancel={handleCancel}
                confirmLoading={isLoadingModal}
                okText='Tạo mới'
                cancelText='Hủy'
            >
                <Divider />
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 24 }}
                    style={{ maxWidth: 900 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off" r
                >
                    <Form.Item
                        label="ID"
                        name="_id"
                        rules={[
                            { required: true, message: 'Vui Lòng nhập tên sách!' },
                        ]}
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên sách"
                                name="mainText"
                                rules={[
                                    { required: true, message: 'Vui Lòng nhập tên sách!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Tác giả"
                                name="author"
                                rules={[
                                    { required: true, message: 'Vui Lòng nhập tác giả!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    { required: true, message: 'Vui Lòng nhập giá tiền!' },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    addonAfter={'VND'}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Thể loại"
                                name="category"
                                rules={[
                                    { required: true, message: 'Vui Lòng nhập thể loại!' },
                                ]}
                            >
                                <Select

                                    style={{
                                        width: '100%',
                                    }}
                                    onChange={handleChange}
                                    options={options}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Số lượng"
                                name="quantity"
                                rules={[
                                    { required: true, message: 'Vui Lòng nhập số lượng!' },
                                ]}
                            >
                                <Input style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Đã bán"
                                name="sold"
                                rules={[
                                    { required: true, message: 'Vui Lòng nhập số lượng đã bán!' },
                                ]}
                            >
                                <InputNumber style={{ width: '100%' }} defaultValue={0} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Upload Thumnail & slider */}
                    <Row gutter={24}>
                        {/* Thumbnail */}
                        <Col span={12}>
                            <Form.Item
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                                getValueFromEvent={getFile}

                            // rules={[
                            //     { required: true, message: 'Vui Lòng thêm ảnh thumbnail!' },
                            // ]}
                            >
                                <Upload
                                    name="files"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    onPreview={handlePreviewThumnail}
                                    showUploadList={true}
                                    defaultFileList={init?.thumbnail?.fileList ?? []}
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    beforeUpload={beforeUpload}
                                    onChange={handleChangeAddImg}
                                    multiple
                                    maxCount={1}
                                    /// customRequest dùng để yêu cầu giao diện trả về status của quá trình upload file theo ý muốn
                                    customRequest={handleUploadFileThumbnail}
                                    //
                                    onRemove={(info, index) => { handleDeleteFileImg(info, "THUMBNAIL") }}
                                >
                                    {uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                        {/* Slider */}
                        <Col span={12}>
                            <Form.Item
                                label="Ảnh Slider"
                                name="slider"
                                getValueFromEvent={getFile}
                            >
                                <Upload
                                    name="files"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    onPreview={handlePreviewThumnail}
                                    showUploadList={true}
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => { handleChangeAddImg(info, 'Slider') }}
                                    multiple
                                    /// customRequest dùng để yêu cầu giao diện trả về status của quá trình upload file theo ý muốn
                                    customRequest={handleUploadFileSlider}
                                    //
                                    onRemove={(info, index) => { handleDeleteFileImg(info, "SLIDER") }}
                                    defaultFileList={init?.slider?.fileList ?? []}
                                >
                                    {uploadButtonSlider}
                                </Upload>
                            </Form.Item>
                            <>
                                <Modal
                                    open={previewOpen}
                                    title={previewTitle}
                                    footer={null}
                                    onCancel={handleCancelModalThumnail}
                                >
                                    <img
                                        alt="example"
                                        style={{
                                            width: '100%',
                                        }}
                                        src={previewImage}
                                    />
                                </Modal>
                            </>
                        </Col>
                    </Row>
                    {/*  */}
                </Form>

            </Modal>
        </>
    )
}

export default UpdateAndDeleteBook