import { Download } from 'lucide-react';
import * as XLSX from "xlsx"

const ExportButton = ({data,sheetName,fileName,colsConfig,className}) => {
    const handleExport = () => {
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(data)
        ws["!cols"] = colsConfig
        XLSX.utils.book_append_sheet(wb, ws, sheetName)
        XLSX.writeFile(wb, `${fileName}.xlsx`)
    };
    return (
        <button
            onClick={handleExport}
            className={className}
        >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
        </button>
    );
};

export default ExportButton;