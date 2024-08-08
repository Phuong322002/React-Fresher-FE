import { CloudDownloadOutlined } from "@ant-design/icons"
import { Button } from "antd"
import * as XLSX from 'xlsx';


const ExportFileBook = (props) => {
    const { listBookWithPaginate } = props

    let newArrBookExcel = []
    if (listBookWithPaginate && listBookWithPaginate.length > 0) {

        newArrBookExcel = listBookWithPaginate.map((infor, index) => {
            return {
                mainText: infor.mainText,
                author: infor.author,
                category: infor.category,
                price: infor.price,
                quantity: infor.quantity,
                sold: infor.sold
            }
        })
    }
    console.log('newArrBookExcel', newArrBookExcel)
    const downloadExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, "DataBook.xlsx");
    };



    return (

        <>
            {newArrBookExcel && newArrBookExcel.length > 0 &&
                <Button onClick={() => { downloadExcel(newArrBookExcel) }} style={{ background: "yellow", borderColor: "yellow" }}>
                    <CloudDownloadOutlined /> Export
                </Button>

            }
            {/* export list book */}

        </>
    )
}

export default ExportFileBook;