import { Col, Divider, InputNumber, Row, Space, Spin } from 'antd'
import './homePage.scss'
import { Button, Checkbox, Form, Input } from 'antd';
import { Rate } from 'antd';
import { useEffect, useState } from 'react';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { Card } from 'antd';
import { Pagination } from 'antd';
import { getCategoryBook } from '../../services/axiosCreateAPI';
import { getListBookWithPaginate } from '../../services/axiosCreateAPI';
import PropagateLoader from "react-spinners/PropagateLoader";


const HomePage = () => {
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([])
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [listBook, setListBook] = useState([]);
    const [totalPage, setTotalPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState('&sort=-sold')
    const [filterCategory, setFilterCategory] = useState('')
    const [query, setQuery] = useState('')
    const [filterPrice, setFilterPrice] = useState('')

    // Form
    const onFinish = (values) => {
        console.log('Success:', values.category);
        let p = ''
        if (values?.range?.from > 0 && values?.range?.to > 0) {
            p += `&price>=${values.range.from}&price<=${values.range.to}`
            if (values?.category?.length > 0) {
                p += `&category=${values.category.join(',')}`
            }
            setFilterPrice(p)
        }

    };
    console.log('filterPrice', filterPrice)

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    //CheckBox
    const handleCheckBox = (changedValues, values) => {
        // console.log('changedValues, values: ', changedValues.category.join(','), values)
        setFilterCategory(`&category=${changedValues.category.join(',')}`)
    }
    console.log('filterCategory', filterCategory)
    console.log('query', query)


    const onChangeCheckBox = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };

    useEffect(() => {
        fetchListCategoryBook()
    }, [])

    const fetchListCategoryBook = async () => {
        const res = await getCategoryBook()
        console.log(">> check res list category book: ", res)
        if (res && res.data) {

            setListCategory(res.data)
        }
    }

    console.log('listCategory', listCategory)

    let arrOptionNew = []
    if (listCategory && listCategory.length > 0) {
        const arr = listCategory.map((category, index) => {
            return {
                label: category,
                value: category
            }
        })
        arrOptionNew = [...arr]
    }

    console.log('arrOptionNew', arrOptionNew)

    const options = [...arrOptionNew]

    const handleRefresh = () => {
        form.resetFields()
        setFilterCategory('')
        setFilterPrice('')
        // setQuery(`current=${current}&pageSize=${pageSize}&sort=-sold`)

    }

    //InputNumber
    const onChangeInputNumber = (value) => {
        console.log('changed', value);
    };

    //Rate
    const [value, setValue] = useState(3);
    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

    //Tabs
    const onChange = (key) => {
        console.log(key);
        setSort(key)
    };
    console.log('sort', sort)

    //Card img
    const { Meta } = Card;

    //Pagination

    useEffect(() => {
        fetchListBookPaginate()
    }, [current, sort, filterCategory, query, filterPrice])

    const fetchListBookPaginate = async () => {
        setLoading(true)
        // let query = ''

        // query += `current=${current}&pageSize=${pageSize}`
        setQuery(`current=${current}&pageSize=${pageSize}`)


        if (filterCategory !== '') {
            // query += filterCategory
            setQuery((query) => query + filterCategory)
        }

        if (filterPrice !== "") {
            setQuery((query) => query + filterPrice)
        }

        if (sort !== '') {
            // query += sort
            setQuery((query) => query + sort)
        }

        const rs = await getListBookWithPaginate(query)
        setLoading(false)
        console.log('>>check res painate book home:', rs)
        if (rs && rs.data && rs.data.result) {
            const arr = rs.data.result.map((tn, index) => {
                return {
                    author: tn.author,
                    category: tn.category,
                    createdAt: tn.createdAt,
                    mainText: tn.mainText,
                    price: tn.price,
                    quantity: tn.quantity,
                    slider: tn.slider,
                    sold: tn.sold,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${tn.thumbnail}`,
                    updatedAt: tn.updatedAt,
                    _id: tn._id

                }
            })
            setListBook(arr)
        }
        if (rs && rs.data && rs.data.meta) {
            setTotalPage(rs.data.meta.total)
        }
    }
    console.log('>> check listBOOK', listBook)
    console.log('totalPage', totalPage)


    const onChangePaginate = (pagination) => {
        console.log('page', pagination);

        if (pagination && pagination.p !== current) {
            setCurrent(pagination.p);
        }

        if (pagination && pagination.pz !== pageSize) {
            setPageSize(pagination.pz);
            setCurrent(1);
        }

        // setCurrent(page);
    };


    return (

        <div className='main-home'>
            <Row style={{ minHeight: '100%', }}>
                <Col md={4} sm={0} xs={0} >

                    <div style={{
                        margin: '10px 0px',
                        minHeight: "calc(100% - 20px)",
                        backgroundColor: 'white',
                        borderRadius: '3px',
                        padding: '0px 10px'
                    }}>
                        {/* Refresh  */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px' }}>
                            <div style={{ marginTop: '10px' }}>
                                <FilterOutlined /> Bộ lọc tìm kiếm
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <ReloadOutlined onClick={() => { handleRefresh() }} />
                            </div>
                        </div>
                        <Divider />

                        {/* Danh mục sản phẩm */}
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{
                                span: 24,
                            }}
                            style={{ margin: '5px' }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            onValuesChange={(changedValues, values) => { handleCheckBox(changedValues, values) }}
                        >
                            <Form.Item
                                label="Danh mục sản phẩm"
                                name="category"

                            >
                                {/* <Row>
                                    <Col span={24}>
                                        {/* <Checkbox value='A'>A</Checkbox> */}
                                {/* <Checkbox.Group options={options} onChange={onChangeCheckBox} />
                                    </Col>
                                </Row> */}
                                <Checkbox.Group defaultValue={['Apple']} onChange={onChangeCheckBox}>
                                    <Row gutter={24}>
                                        {options.map((option, index) => (
                                            <Col span={12} key={index}>
                                                <Checkbox value={option.value}><span style={{ fontSize: '13px' }}>{option.label}</span></Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                            <Divider />
                            {/* Khoảng giá */}
                            <Form.Item
                                label="Khoảng giá"
                                labelCol={{
                                    span: 24,
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                                    <Form.Item
                                        name={['range', 'from']}
                                    >
                                        <InputNumber
                                            placeholder='from...'
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            controls={false}
                                            addonAfter="₫"
                                            style={{ width: '100px' }}
                                        />
                                    </Form.Item>
                                    <span>-</span>
                                    <Form.Item
                                        name={['range', 'to']}
                                    >
                                        <InputNumber
                                            placeholder='to...'
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            controls={false}
                                            addonAfter="₫"
                                            style={{ width: '100px' }}

                                        />
                                    </Form.Item>
                                </div>

                            </Form.Item>

                            <Divider />
                            <div style={{ width: '100%', margin: '10px' }}>
                                <div>
                                    Đánh giá
                                </div>
                                <span>
                                    <Rate tooltips={desc} onChange={setValue} value={5} />
                                    <Rate tooltips={desc} onChange={setValue} value={4} />
                                    <Rate tooltips={desc} onChange={setValue} value={3} />
                                    <Rate tooltips={desc} onChange={setValue} value={2} />
                                    <Rate tooltips={desc} onChange={setValue} value={1} />
                                </span>
                            </div>
                            <Divider />

                            <div>
                                <Button onClick={() => form.submit()}
                                    style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                            </div>
                        </Form>

                    </div>


                </Col>

                <Col md={20} xs={24} >
                    {/* PC tabs */}
                    <div className='body-book'>
                        <div className='tabs-pc'>
                            <Tabs
                                defaultActiveKey="1"
                                size='small'
                                onChange={onChange}
                                items={[
                                    {
                                        label: `Phổ biến`,
                                        key: '&sort=-sold',
                                        children: ``,
                                    },
                                    {
                                        label: `Hàng mới`,
                                        key: '&sort=-updatedAt',
                                        children: ``,
                                    },
                                    {
                                        label: `Giá thấp đến cao`,
                                        key: '&sort=price',
                                        children: ``,
                                    },
                                    {
                                        label: `Giá cao đến thấp`,
                                        key: '&sort=-price',
                                        children: ``,
                                    },
                                ]}
                            />
                        </div>

                        {/* Mobile tabs */}
                        <div className='tabs-mobile'>
                            <Tabs
                                tabBarGutter={10}
                                defaultActiveKey="1"
                                size='small'
                                onChange={onChange}
                                items={[
                                    {
                                        label: <span style={{ fontSize: '10px' }}>Phổ biến</span>,
                                        key: '1',
                                        children: ``,
                                    },
                                    {
                                        label: <span style={{ fontSize: "10px" }}>Hàng mới</span>,
                                        key: '2',
                                        children: ``,
                                    },
                                    {
                                        label: <span style={{ fontSize: '10px' }}>Giá thấp đến cao</span>,
                                        key: '3',
                                        children: ``,
                                    },
                                    {
                                        label: <span style={{ fontSize: "10px" }}>Giá cao đến thấp</span>,
                                        key: '4',
                                        children: ``,
                                    },
                                ]}
                            />
                        </div>

                        {/* PC */}
                        <Spin spinning={loading}>

                            <div className='cards-book'>
                                {/* {loading === false ?
                                <>
                                    <div style={{ height: '200px', border: '10x solid' }}></div>
                                    <PropagateLoader color="RGBA( 0, 191, 255, 1 )" style={{ position: "fixed", top: "30%", left: "60%", transform: "translate(-50%, -50%)" }} />
                                </>
                                : */}
                                <>
                                    {listBook && listBook.length > 0 && listBook.map((inforBook, index) => {
                                        return (
                                            <>
                                                <div className='card-book'>
                                                    <div className='thumbnail'>
                                                        {/* <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" /> */}
                                                        <img src={inforBook.thumbnail} alt="" />
                                                    </div>
                                                    <div className='text'>
                                                        {inforBook.mainText}
                                                    </div>
                                                    <div className='price'>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(inforBook.price)}
                                                    </div>
                                                    <div className='rate'>
                                                        <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán {inforBook.sold}</span>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })

                                    }
                                </>

                                {/* } */}


                            </div>
                        </Spin>

                        {/* Mobile */}
                        <div className='card-mobile'>
                            {loading === false ?
                                <>
                                    <div style={{ height: '200px', border: '10x solid' }}></div>
                                    <PropagateLoader color="RGBA( 0, 191, 255, 1 )" style={{ position: "fixed", top: "30%", left: "60%", transform: "translate(-50%, -50%)" }} />
                                </>
                                :
                                <>
                                    {listBook && listBook.length > 0 && listBook.map((inforBook, index) => {
                                        return (
                                            <>
                                                <div className='card-book-mobile'>
                                                    <div className='thumbnail-mobile'>
                                                        {/* <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="" /> */}
                                                        <img src={inforBook.thumbnail} alt="" />
                                                    </div>
                                                    <div className='text-mobile'>
                                                        {inforBook.mainText}
                                                    </div>
                                                    <div className='price-mobile'>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(inforBook.price)}
                                                    </div>
                                                    <div className='rate-mobile'>
                                                        <Rate style={{ fontSize: '10px' }} tooltips={desc} onChange={setValue} value={5} /> <span style={{ marginLeft: '2px' }}>Đã bán {inforBook.sold}</span>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                    }
                                </>

                            }

                        </div>
                        <Divider />
                        <div className='pagination'>
                            <Pagination
                                current={current}
                                onChange={(p, pz) => { onChangePaginate({ p, pz }) }}
                                total={totalPage}
                                pageSize={pageSize}
                                responsive
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </div >
    )
}

export default HomePage