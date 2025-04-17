import ExcelJS from "exceljs";
export type ColumnConfig = {
    label: string;
    key: string;
    format?: string;
    style?: (value: any, row: any) => Partial<ExcelJS.Style>;
};
export type SheetConfig = {
    name: string;
    columns: ColumnConfig[];
    data: any[];
};
export type ExportOptions = {
    fileName: string;
    sheets: SheetConfig[];
};
export declare const generateExcelFile: (config: ExportOptions) => Promise<void>;
export declare const useExcelExporter: (config: ExportOptions) => {
    exportFile: () => Promise<void>;
};
