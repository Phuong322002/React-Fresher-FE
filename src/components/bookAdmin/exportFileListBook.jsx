import { CloudDownloadOutlined } from "@ant-design/icons"
import { Button } from "antd"
import * as XLSX from 'xlsx';


const ExportFileBook = (props) => {
    const { listBookWithPaginate } = props

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
            {listBookWithPaginate && listBookWithPaginate.length > 0 &&
                <Button onClick={() => { downloadExcel(listBookWithPaginate) }} style={{ background: "yellow", borderColor: "yellow" }}>
                    <CloudDownloadOutlined /> Export
                </Button>

            }
            {/* export list book */}

        </>
    )
}

export default ExportFileBook;