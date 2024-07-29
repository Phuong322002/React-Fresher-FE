import { message, Table } from 'antd';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { CloudDownloadOutlined, InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import * as XLSX from 'xlsx/xlsx';



const ImportFileUser = () => {


    const { Dragger } = Upload;
    const [importFileUser, setImportFileUser] = useState([])

    const dummyRequest = async ({ file, onSuccess }) => {

        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    }



    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest: dummyRequest,
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                console.log('info.file:', info.fileList)
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    console.log('FileUser: ', file)
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        console.log('e.target.result:', e.target.result, reader.result)

                        let data = new Uint8Array(e.target.result);
                        console.log('data:', data)
                        let workbook = XLSX.read(data, { type: 'array' });
                        console.log('workbook:', workbook)

                        // find the name of your sheet in the workbook first
                        let worksheet = workbook.Sheets[`${workbook.SheetNames[0]}`];
                        // convert to json format
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        if (jsonData.length > 0) {

                            const newArrUser = jsonData.map((user, index) => {
                                return {
                                    //this is a row
                                    key: index,
                                    fullName: user['Tên hiển thị'],
                                    email: user['Email'],
                                    phone: user['Số điện thoại']
                                }
                            })
                            setImportFileUser(newArrUser)
                        }
                    };
                    // reader.readAsArrayBuffer(file);
                    //
                }

                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };




    console.log('importFileUser:', importFileUser)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
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
    ];
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <>
            <Button onClick={showModal} style={{ background: "orange", borderColor: "yellow" }}>
                <CloudDownloadOutlined /> Import File
            </Button>
            <Modal width='50%' maskClosable={false} title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Dragger {...propsUpload} style={{ maxHeight: "180px" }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading
                        company data or other banned files.
                    </p>

                </Dragger>
                <div style={{ border: '1px dashed', borderRadius: '5px', marginTop: '12px' }}>
                    <Table
                        title={() => {
                            return (
                                <span>
                                    Upload Data:
                                </span>
                            )
                        }}
                        columns={columns}
                        dataSource={importFileUser}
                        onChange={onChange}
                        pagination={false}
                    />
                </div>

            </Modal >
        </>

    )
}

export default ImportFileUser