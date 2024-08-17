import { message, Table, Upload, Button, Modal, notification } from 'antd';
import { useState } from 'react';
import { CloudDownloadOutlined, InboxOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx/xlsx';
import { postCreateListUserBulk } from '../../services/axiosCreateAPI';
import { TbMoodHappy } from "react-icons/tb";
import { FaSadCry } from "react-icons/fa";
import FileExcel from './excelUser.xlsx?url';

const ImportFileUser = (props) => {
    const { Dragger } = Upload;
    const [importFileUser, setImportFileUser] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const dummyRequest = async ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFileList([]);
        setImportFileUser([]);
    };

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        //chỉ đọc file ko update ở phía server
        customRequest: dummyRequest,
        ///
        fileList: fileList,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                // GET DATA EXCEL  và chế biến nó 
                if (info.fileList && info.fileList.length > 0) {
                    /// lấy file 
                    const file = info.fileList[0].originFileObj;
                    console.log('file', info)
                    //
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        let data = new Uint8Array(e.target.result);
                        let workbook = XLSX.read(data, { type: 'array' });
                        let worksheet = workbook.Sheets[`${workbook.SheetNames[0]}`];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        console.log("Check json Data:", jsonData)
                        if (jsonData.length > 0) {
                            const newArrUser = jsonData.map((user, index) => ({
                                // key: index,
                                fullName: user['Tên hiển thị'],
                                email: user['Email'],
                                phone: user['Số điện thoại'],
                                password: "123456"
                            }));
                            console.log('newArrUser', newArrUser)
                            setImportFileUser(newArrUser);
                        }
                    };
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
            setFileList(info.fileList);
        },
        onRemove() {
            setFileList([]);
            setImportFileUser([]);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },

    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {

        const response = await postCreateListUserBulk(importFileUser)
        console.log('>> check response import file: ', response)

        if (response && response.data) {
            notification.success({
                message: <span>Import Success <TbMoodHappy /></span>,
                description: (
                    <div>
                        Success: {response.data.countSuccess} <br />
                        Error: {response.data.countError}
                    </div>
                ),
            })
            setFileList([]);
            setImportFileUser([]);
            setIsModalOpen(false);
        } else {
            notification.error({
                message: <span>Import Error <FaSadCry /></span>,
                description: response.message,
            })
        }
    };

    const columns = [
        {
            title: 'Tên hiển thị ',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            hidden: true
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    console.log('>> check importFileUser:', importFileUser)

    return (
        <>
            <Button onClick={showModal} style={{ background: "orange", borderColor: "yellow" }}>
                <CloudDownloadOutlined /> Import File
            </Button>
            <Modal
                width='50%'
                maskClosable={false}
                title="Import File: "
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="IMPORT"
                okButtonProps={importFileUser && importFileUser.length === 0 && { disabled: true }}
            >
                <Dragger {...propsUpload} style={{ maxHeight: "180px" }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Only accept .csv, xls, .xlsx. <a onClick={(e) => { return e.stopPropagation() }} href={FileExcel} download>Download File Excel</a>
                    </p>
                </Dragger>
                <div style={{ border: '1px dashed', borderRadius: '5px', marginTop: '12px' }}>
                    <Table
                        title={() => <span>Upload Data:</span>}
                        columns={columns}
                        dataSource={importFileUser}
                        onChange={onChange}
                        pagination={false}
                    />
                </div>
            </Modal>
        </>
    );
};

export default ImportFileUser;
