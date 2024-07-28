import { message, Table } from 'antd';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { CloudDownloadOutlined, InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';

const { Dragger } = Upload;
const dummyRequest = async ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 1000);
}

const propsUpload = {
    name: 'file',
    multiple: true,
    accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    customRequest: dummyRequest,
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};
const ImportFileUser = () => {

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
            title: 'Name',
            dataIndex: 'name',

        },
        {
            title: 'Age',
            dataIndex: 'age',

        },
        {
            title: 'Address',
            dataIndex: 'address',

        },
    ];

    const data = [

    ];
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <>
            <Button onClick={showModal} style={{ background: "orange", borderColor: "yellow" }}>
                <CloudDownloadOutlined /> Import File
            </Button>
            <Modal maskClosable={false} title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading
                        company data or other banned files.
                    </p>

                </Dragger>
                <div style={{ border: '1px dashed', borderRadius: '5px', marginTop: '5px' }}>
                    <Table
                        title={() => {
                            return (
                                <span>
                                    Upload Data:
                                </span>
                            )
                        }}
                        columns={columns}
                        dataSource={data}
                        onChange={onChange}
                        pagination={false}
                    />
                </div>

            </Modal>
        </>

    )
}

export default ImportFileUser