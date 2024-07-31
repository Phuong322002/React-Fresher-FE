import { CloudDownloadOutlined } from "@ant-design/icons"
import { Button } from "antd"
import * as XLSX from 'xlsx';


const ExportFileUser = (props) => {
    const { listUserWithPaginate } = props

    const downloadExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, "DataUser.xlsx");
    };



    return (

        <>
            {listUserWithPaginate && listUserWithPaginate.length > 0 &&
                <Button onClick={() => { downloadExcel(listUserWithPaginate) }} style={{ background: "green", borderColor: "yellow" }}>
                    <CloudDownloadOutlined /> Export
                </Button>

            }

        </>
    )
}

export default ExportFileUser;