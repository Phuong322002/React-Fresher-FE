

import { Button, Drawer, Form, Input, message, Modal, notification, Table } from 'antd';
import { getUserWithPaginate } from '../../services/axiosCreateAPI';
import { useEffect, useState } from 'react';
import { TfiReload } from "react-icons/tfi";
import { CloudDownloadOutlined, PlusOutlined } from '@ant-design/icons';
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
import { v4 as uuidv4 } from 'uuid';

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
        showDrawer()
        if (record && record._id) {
            setInforBook(record)
        }
    }

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

    const convertTimeupdatedAt = () => {
        const time = moment(inforBook.updatedAt).format("YYYY-MM-DD HH:mm:ss A")
        return time
    }


    const convertTimecreatedAt = () => {
        const time = moment(inforBook.createdAt).format("YYYY-MM-DD HH:mm:ss A")
        return time
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
    // const [fileList, setFileList] = useState([
    //     {
    //         uid: '-1',
    //         name: 'image.png',
    //         status: 'done',
    //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     },
    //     {
    //         uid: '-2',
    //         name: 'image.png',
    //         status: 'done',
    //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     },
    //     {
    //         uid: '-3',
    //         name: 'image.png',
    //         status: 'done',
    //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     },
    //     {
    //         uid: '-4',
    //         name: 'image.png',
    //         status: 'done',
    //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     },
    // ]);
    const handlePreview = async (file) => {
        console.log('file:', file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
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
            label: 'Thể loại',
            children: <Badge status="processing" text={inforBook.category} />,
            span: 3,
        },
        {
            key: '6',
            label: 'Created At',
            // span: 1.5,
            children: convertTimecreatedAt(),
        },

        {
            key: '7',
            label: 'Updated At',
            // span: 1.5,
            children: convertTimeupdatedAt(),
        },

    ];

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
                // console.log('text, record', record)
                // let arrImage = record.slider.map((img, index) => {
                //     console.log('img:', img)
                //     return img
                // })
                // arrImage.unshift(record.thumbnail)

                // // arrImage.push()
                // // arrImage.unshift(record.thumbnail)

                // const objInforBook = {
                //     uid: uuidv4(),
                //     name: 'image.png',
                //     status: 'done',
                //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                // }

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
                        {`${record.price}`} vnd
                    </>
                )
            }

            // render: (text, record) => {
            //     return (<>{moment(record.createdAt).format("YYYY/MM/DD kk:mm:ss A")}</>)
            // },
            // sorter: true,
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
                        <UpdateAndDelete
                            record={record}
                            fetchGetUserWithPaginate={fetchGetListBookWithPaginate}
                        />

                    </>

                )
            },
        },
    ];

    const [listBookWithPaginate, setListBook] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setLoading] = useState(false)
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState("&sort=-updatedAt")

    const [isLoadingModal, setIsLoadingModal] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false);


    console.log('>> check filter:', filter)
    useEffect(() => {
        fetchGetListBookWithPaginate();
    }, [current, pageSize, filter, sort]);

    const fetchGetListBookWithPaginate = async () => {
        setLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;

        if (filter != '') {
            query += `${filter}`
        }

        if (sort != '') {
            query += `${sort}`
        }


        const rs = await getListBookWithPaginate(query);
        setLoading(false)
        console.log('>>> check rs get user with paginate: ', rs);
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
            // let sortBook = sorter.order === "ascend" ? `&sort=updatedAt` : `&sort=-updatedAt`

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

    // const [fullName, setFullName] = useState('');
    // const [password, setPassword] = useState('');
    // const [email, setEmail] = useState('');
    // const [phone, setPhone] = useState('');

    const onFinish = async (values) => {
        console.log('Success:', values);
        setIsLoadingModal(true)
        const response = await postCreateUser(values.username, values.password, values.email, values.phone)
        setIsLoadingModal(false)
        console.log('>>> check new user: ', response)

        if (response && response.data) {
            message.success('Created new user success');
            fetchGetListBookWithPaginate()
            form.resetFields();
            setIsModalOpen(false);

        } else {
            const mes = response.message
            const arrText = mes.split(', ')
            const m1 = arrText[0];
            const m2 = arrText[1];
            notification.error(
                {
                    message: <span style={{ fontSize: '13px', fontWeight: '600' }}>{m1} </span>,
                    description: <span style={{ fontSize: '18px' }}>{m2} <FaSadTear style={{ color: 'c0c0c0' }} /></span>,
                })
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [form] = Form.useForm();
    const headerTable = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    Table List Books
                </div>
                <div style={{ display: 'flex', gap: 10 }} >
                    <>
                        <ExportFileBook
                            listBookWithPaginate={listBookWithPaginate}
                        />
                    </>



                    {/* <ImportFileUser
                        fetchGetUserWithPaginate={fetchGetUserWithPaginate}
                    /> */}


                    <>
                        <Button type="primary" onClick={showModal}>
                            <PlusOutlined /> Thêm mới
                        </Button>
                        <Modal
                            maskClosable={false}
                            title="Basic Modal"
                            open={isModalOpen}
                            onOk={form.submit}
                            onCancel={handleCancel}
                            confirmLoading={isLoadingModal}
                        >
                            <Form
                                form={form}
                                name="basic"
                                labelCol={{
                                    span: 24,
                                }}
                                style={{
                                    maxWidth: 600,
                                }}
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="User Name"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your username!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>


                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'email',
                                            message: 'Please input your email!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Phone"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your phone!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
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
                <InputSearchBook
                    handleSearch={handleSearch}
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
                // onRow={(record, rowIndex) => {
                //     return {
                //         onClick: (event) => { }, // click row

                //     };
                // }}
                />
            </div>
            <Drawer size='large' title="Chức năng xem chi tiết" onClose={onClose} open={open}>
                <Descriptions column={2} size={'small'} title="User Info" bordered items={items} />
                <Divider style={{ fontWeight: '600' }} orientation="left">Ảnh Books</Divider>
                <>
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
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
        </div>
    );
};

export default ManageBook;
