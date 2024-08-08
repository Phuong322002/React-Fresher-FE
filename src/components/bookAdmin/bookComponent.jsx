import { Button, Col, Drawer, Form, Input, message, Modal, notification, Row, Table } from 'antd';
import { getUserWithPaginate } from '../../services/axiosCreateAPI';
import { useEffect, useState } from 'react';
import { TfiReload } from "react-icons/tfi";
import { CloudDownloadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Descriptions } from 'antd';
import moment from 'moment';
import { postCreateUser } from '../../services/axiosCreateAPI';
import { FaSadTear } from "react-icons/fa";
import UpdateAndDelete from './updateAndDeleteBook';
import { getListBookWithPaginate } from '../../services/axiosCreateAPI';
import InputSearchBook from './InputSearchBook';
import ExportFileBook from './exportFileListBook';
import { Divider } from 'antd';
import { Image, Upload } from 'antd';
import DetailBook from './detailBook';
import { SettingOutlined } from '@ant-design/icons';
import { Cascader, InputNumber, Select, Space } from 'antd';
import { getCategoryBook } from '../../services/axiosCreateAPI';
import { postUploadImgBook } from '../../services/axiosCreateAPI';
import { postCreateABook } from '../../services/axiosCreateAPI';
import UpdateBook from './updateAndDeleteBook';
import UpdateAndDeleteBook from './updateAndDeleteBook';

const getBase64AddImg = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
const ManageBook = () => {
    const [previewTitle, setPreviewTitle] = useState('');

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const [inforBook, setInforBook] = useState({})

    const hanldeDetailUser = (record) => {
        console.log('record:', record)
        showDrawer()
        if (record && record._id) {
            setInforBook(record)
        }
    }
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([])

    const handlePreview = async (file) => {
        console.log('file:', file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
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


    const columns = [
        {
            title: 'No',
            key: 'sno',
            width: '20px',
            render: (text, object, index) => {
                return index + 1
            },
        },
        {
            title: 'ID',
            dataIndex: '_id',
            render: (text, record) => {
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
            title: 'Tên sách',
            dataIndex: 'mainText',
            width: 200,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            width: '200px',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: true,
            render: (text, record) => {
                console.log('record:', record)
                return (
                    <>
                        {`${record.price}`} &#8363;
                    </>
                )
            }
        },
        {
            title: 'Ngày cập nhật',
            width: '190px',
            dataIndex: 'updatedAt',
            render: (text, record) => {
                return (<>{moment(record.createdAt).format("YYYY/MM/DD kk:mm:ss A")}</>)
            },
            sorter: true,
        },
        {
            title: 'Action',
            render: (text, record) => {
                console.log('c', record)
                return (
                    <>
                        <UpdateAndDeleteBook
                            listTypeBook={listTypeBook}
                            dataSlider={dataSlider}
                            setDataSlider={setDataSlider}
                            record={record}
                            dataThumbnail={dataThumbnail}
                            setDataThumbnail={setDataThumbnail}
                            fetchGetListBookWithPaginate={fetchGetListBookWithPaginate}
                        />
                    </>
                )
            },
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            hidden: true
        },
        {
            title: 'Đã bán',
            dataIndex: 'sold',
            hidden: true
        },
    ];

    const [listBookWithPaginate, setListBook] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState("&sort=-updatedAt")

    const [isLoadingModal, setIsLoadingModal] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log('>> check filter:', filter)
    useEffect(() => {
        fetchGetListBookWithPaginate();
    }, [current, pageSize, filter, sort]);

    const fetchGetListBookWithPaginate = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;

        if (filter != '') {
            query += `${filter}`
        }

        if (sort != '') {
            query += `${sort}`
        }

        const rs = await getListBookWithPaginate(query);
        setIsLoading(false)
        console.log('>>> check rs get book with paginate: ', rs);
        if (rs && rs.data) {
            setListBook(rs.data.result);
            setTotal(rs.data.meta.total);
        }
    };

    const handleSearch = (querySearchBook) => {
        setFilter(querySearchBook)
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
            let sortBook = sorter.order === "ascend" ? `&sort=${sorter.field}` : `&sort=-${sorter.field}`
            setSort(sortBook)

            if (sorter.order === undefined) {
                setSort("&sort=-updatedAt")
            }
        }
    };

    console.log('listBookWithPaginate: ', listBookWithPaginate);
    console.log('pageSize: ', pageSize);
    console.log('current: ', current);
    console.log('sort: ', sort);
    console.log("record._id", inforBook)
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields()
    };
    const handleCancelModalThumnail = () => setPreviewOpen(false);



    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [form] = Form.useForm();
    const [listTypeBook, setListTypeBook] = useState([])
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    useEffect(() => {
        getTypeOfBook()
    }, [])

    const getTypeOfBook = async () => {
        const response = await getCategoryBook()
        console.log('>> check data type of book:', response)
        if (response && response.data) {
            setListTypeBook(response.data);
        }
    }
    console.log('listTypeBook', listTypeBook)

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
    console.log('options', options)

    // const options = [
    //     {
    //         value: 'jack',
    //         label: 'Jack',
    //     },
    //     {
    //         value: 'lucy',
    //         label: 'Lucy',
    //     },
    //     {
    //         value: 'disabled',
    //         disabled: true,
    //         label: 'Disabled',
    //     },
    //     {
    //         value: 'Yiminghe',
    //         label: 'yiminghe',
    //     },
    // ]

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

    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [imageUrl, setImageUrl] = useState();
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
    console.log('imageUrl', imageUrl)
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
    const [dataThumbnail, setDataThumbnail] = useState([])
    const [dataSlider, setDataSlider] = useState([])
    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        console.log("Check file thumbnail:", file)
        const res = await postUploadImgBook(file)
        console.log('>> check res thumbnail: ', res)

        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
        }
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        console.log("Check file slider:", file)

        const resSlider = await postUploadImgBook(file)
        console.log(">> check res slider:", resSlider)
        if (resSlider && resSlider.data) {
            setDataSlider((dataSlider) => [...dataSlider, {
                name: resSlider.data.fileUploaded,
                uid: file.uid
            }])
        }
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    console.log('dataSlider', dataSlider)
    const getFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const onFinish = async (values) => {
        console.log('Success:', values);
        const { thumbnail, slider, mainText, author, price, sold, quantity, category } = values
        let thumbnailNew = ''
        if (dataThumbnail.length > 0) {
            thumbnailNew = dataThumbnail[0].name;
        }

        const sliderNew = dataSlider.map((nameSlider, index) => {
            return nameSlider.name
        })
        const response = await postCreateABook(thumbnailNew, sliderNew, mainText, author, price, sold, +quantity, category)
        console.log('response create a book: ', response)
        if (response && response.data) {
            message.success("Create a book successfuly!", [2]);
            fetchGetListBookWithPaginate()
            setDataThumbnail([])
            setDataSlider([])
            form.resetFields()
            setIsModalOpen(false);
        } else {
            notification.error({
                message: 'Error',
                description: response.message
            })
        }

    };

    const handleDeleteFileImg = (info, type) => {

        if (type === 'THUMBNAIL') {
            setDataThumbnail([])
        }

        console.log('info:', dataSlider, info)
        if (type === 'SLIDER') {
            const newArr = dataSlider.filter((img, index) => {
                return img.uid !== info.uid
            })
            console.log('newArr:', newArr)
            setDataSlider(newArr)
        }
    }

    console.log('DataSlider:', dataSlider)


    const headerTable = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    Table List Books
                </div>
                <div style={{ display: 'flex', gap: 10 }} >
                    <>
                        <ExportFileBook listBookWithPaginate={listBookWithPaginate} />
                    </>
                    <>
                        <Button type="primary" onClick={showModal}>
                            <PlusOutlined /> Thêm mới
                        </Button>
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
                                autoComplete="off"

                            >
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
                                            {/* <Modal
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
                                            </Modal> */}
                                        </Form.Item>
                                    </Col>
                                    {/* Slider */}
                                    <Col span={12}>
                                        <Form.Item
                                            label="Ảnh Slider"
                                            name="slider"
                                            getValueFromEvent={getFile}

                                        // rules={[
                                        //     { required: true, message: 'Vui Lòng thêm ảnh !' },
                                        // ]}
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
                    <Button onClick={() => {
                        setFilter('')
                        setSort('')
                    }}><TfiReload /></Button>
                </div>
            </div>
        )
    }

    const handleCancelImg = () => setPreviewOpen(false);

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
                <InputSearchBook handleSearch={handleSearch} />
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
                <Table
                    title={headerTable}
                    size="large"
                    columns={columns}
                    dataSource={listBookWithPaginate}
                    onChange={onChange}
                    pagination={{
                        pageSize: pageSize,
                        current: current,
                        total: total,
                        pageSizeOptions: [5, 10, 20, 50, 100],
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                    }}
                    loading={isLoading}
                />
            </div>
            <DetailBook
                inforBook={inforBook}
                setFileList={setFileList}
                onClose={onClose}
                fileList={fileList}
                handlePreview={handlePreview}
                previewOpen={previewOpen}
                previewTitle={previewTitle}
                handleCancelImg={handleCancelImg}
                previewImage={previewImage}
                open={open}
            />
        </div>
    );
};

export default ManageBook;
