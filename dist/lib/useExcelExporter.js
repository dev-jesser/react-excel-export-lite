var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// useExcelExporter.ts
import ExcelJS from "exceljs";
export const generateExcelFile = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = new ExcelJS.Workbook();
    const { fileName, sheets } = config;
    for (const sheet of sheets) {
        const { name, columns, data } = sheet;
        const worksheet = workbook.addWorksheet(name || "Sheet");
        worksheet.columns = columns.map((col) => ({
            header: col.label,
            key: col.key,
            width: Math.max(12, col.label.length + 2),
        }));
        data.forEach((row) => {
            const newRow = worksheet.addRow({});
            columns.forEach((col, colIndex) => {
                const value = getNestedValue(row, col.key);
                const cell = newRow.getCell(colIndex + 1);
                cell.value = value;
                if (col.format) {
                    cell.numFmt = col.format;
                }
                if (col.style) {
                    const style = col.style(value, row);
                    Object.assign(cell, style);
                }
            });
        });
        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFEFEFEF" },
            };
            cell.border = {
                bottom: { style: "thin" },
            };
        });
        // Freeze and autofilter header
        worksheet.views = [{ state: "frozen", ySplit: 1 }];
        worksheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: 1, column: columns.length },
        };
        // Auto size columns
        worksheet.columns.forEach((column) => {
            var _a, _b;
            let maxLength = ((_a = column.header) === null || _a === void 0 ? void 0 : _a.toString().length) || 10;
            (_b = column.eachCell) === null || _b === void 0 ? void 0 : _b.call(column, { includeEmpty: true }, (cell) => {
                var _a;
                const cellLength = ((_a = cell.value) === null || _a === void 0 ? void 0 : _a.toString().length) || 0;
                maxLength = Math.max(maxLength, cellLength);
            });
            column.width = maxLength + 2;
        });
    }
    const buffer = yield workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
});
export const useExcelExporter = (config) => {
    const exportFile = () => __awaiter(void 0, void 0, void 0, function* () {
        yield generateExcelFile(config);
    });
    return { exportFile };
};
const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc === null || acc === void 0 ? void 0 : acc[part], obj);
};
