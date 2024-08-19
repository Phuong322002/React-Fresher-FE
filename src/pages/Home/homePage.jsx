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
import { useNavigate, useOutletContext } from 'react-router-dom';

const HomePage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const [searchName, setSearchName] = useOutletContext();

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

    console.log('searchNameee', searchName)
    // Form
    const onFinish = (values) => {
        console.log('Success:', values);
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
        if (changedValues?.category && changedValues?.category?.length > 0) {
            setFilterCategory(`&category=${changedValues.category.join(',')}`)
        } else {
            setFilterCategory('')
        }
        // console.log('changedValues, values: ', changedValues.category.join(','), values)
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
        setSearchName('')
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
    }, [current, sort, filterCategory, query, filterPrice, searchName])

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

        if (searchName !== "") {
            setQuery((query) => query + `&mainText=/${searchName}/i`)
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


    //JavaScript: Chuyển tiếng Việt có dấu sang không dấu
    const removeVietnameseTones = (str) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        return str;
    }

    console.log('removeVietnameseTones', removeVietnameseTones('xin,chào'))


    var convertToSlug = function (str) {
        let slug = removeVietnameseTones(str)

        slug = slug.replace(/^\s+|\s+$/g, ''); // trim
        slug = slug.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        var to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (var i = 0, l = from.length; i < l; i++) {
            slug = slug.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        slug = slug.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return slug;
    };


    console.log('convertToSlug', convertToSlug('Xin chào Việt Nam'))

    const handleDetailBookParam = (inforBook) => {
        console.log('in4', inforBook)
        let mainText = convertToSlug(inforBook.mainText)
        let id = inforBook._id
        console.log('slug, id', mainText, id)
        navigate(`book/${mainText}?id=${id}`)
    }



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
                                <Checkbox.Group onChange={onChangeCheckBox}>
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
                        <Spin spinning={loading} tip="Loading...">

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
                                                <div className='card-book' onClick={() => { handleDetailBookParam(inforBook) }}>
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