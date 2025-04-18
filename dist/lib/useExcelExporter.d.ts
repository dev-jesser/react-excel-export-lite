import ExcelJS from "exceljs";
export type ColumnConfig = {
    label: string;
    key: string;
    format?: string;
    style?: (value: any, row: any) => Partial<ExcelJS.Style>;
    width?: number;
};
export type HeaderStyle = {
    font?: Partial<ExcelJS.Font>;
    alignment?: Partial<ExcelJS.Alignment>;
    fill?: Partial<ExcelJS.Fill>;
    border?: Partial<ExcelJS.Borders>;
};
export type SheetConfig = {
    name: string;
    columns: ColumnConfig[];
    data: Record<string, unknown>[];
    headerStyle?: HeaderStyle;
    freezeHeader?: boolean;
};
export type ExportOptions = {
    fileName: string;
    sheets: SheetConfig[];
};
export declare const generateExcelFile: (config: ExportOptions) => Promise<void>;
export declare const useExcelExporter: (config: ExportOptions) => {
    exportFile: () => Promise<void>;
};
declare const classicHeaderStyle: HeaderStyle;
declare const modernHeaderStyle: HeaderStyle;
declare const minimalistHeaderStyle: HeaderStyle;
declare const darkHeaderStyle: HeaderStyle;
declare const vibrantHeaderStyle: HeaderStyle;
export { classicHeaderStyle, modernHeaderStyle, minimalistHeaderStyle, darkHeaderStyle, vibrantHeaderStyle };
export declare const getHeaderStyleTheme: (theme: "classic" | "modern" | "minimalist" | "dark" | "vibrant") => HeaderStyle;
