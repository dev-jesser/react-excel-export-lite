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
}

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

export const generateExcelFile = async (config: ExportOptions) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const { fileName, sheets } = config;

    if (!sheets || sheets.length === 0) {
      throw new Error("No sheets provided for export.");
    }

    for (const sheet of sheets) {
      const { name, columns, data, headerStyle, freezeHeader } = sheet;

      if (!columns || columns.length === 0) {
        throw new Error(`Sheet "${name}" has no columns defined.`);
      }

      if (!data) {
        throw new Error(`Sheet "${name}" has no data provided.`);
      }

      const worksheet = workbook.addWorksheet(name || "Sheet");

      worksheet.columns = columns.map((col) => ({
        header: col.label,
        key: col.key,
        width: col.width || Math.max(12, col.label.length + 2),
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

      if (headerStyle) {
      // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
          if (headerStyle.font) cell.font = headerStyle.font;
          if (headerStyle.alignment) cell.alignment = headerStyle.alignment;
          if (headerStyle.fill && headerStyle.fill.type) {
              const myFill = headerStyle.fill as ExcelJS.Fill
              cell.fill = myFill;
          }
          if (headerStyle.border) cell.border = headerStyle.border;
        });
      }

      // Freeze and autofilter header
      if (freezeHeader) {
        worksheet.views = [{ state: "frozen", ySplit: 1 }];
        worksheet.autoFilter = {
          from: { row: 1, column: 1 },
          to: { row: 1, column: columns.length },
        };
      }

      // Auto size columns
      worksheet.columns.forEach((column) => {
        let maxLength = column.header?.toString().length || 10;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value?.toString().length || 0;
          maxLength = Math.max(maxLength, cellLength);
        });
        column.width = maxLength + 2;
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.setAttribute("aria-label", `Download ${fileName}`);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    alert("An error occurred while generating the Excel file. Please try again.");
  }
};

export const useExcelExporter = (config: ExportOptions) => {
  const exportFile = async () => {
    await generateExcelFile(config);
  };

  return { exportFile };
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

const classicHeaderStyle: HeaderStyle = {
  font: { bold: true, size: 12, color: { argb: "FF000000" } },
  alignment: { horizontal: "center", vertical: "middle" },
  fill: {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9E1F2" },
  },
  border: {
    bottom: { style: "thin", color: { argb: "FF000000" } },
  },
};

const modernHeaderStyle: HeaderStyle = {
  font: { bold: true, size: 14, color: { argb: "FFFFFFFF" } },
  alignment: { horizontal: "center", vertical: "middle" },
  fill: {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF007ACC" },
  },
  border: {
    bottom: { style: "medium", color: { argb: "FF007ACC" } },
  },
};

const minimalistHeaderStyle: HeaderStyle = {
  font: { bold: true, size: 11, color: { argb: "FF333333" } },
  alignment: { horizontal: "left", vertical: "middle" },
  fill: {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFFFF" },
  },
  border: {
    bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
  },
};

const darkHeaderStyle: HeaderStyle = {
  font: { bold: true, size: 12, color: { argb: "FFFFFFFF" } },
  alignment: { horizontal: "center", vertical: "middle" },
  fill: {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF333333" },
  },
  border: {
    bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
  },
};

const vibrantHeaderStyle: HeaderStyle = {
  font: { bold: true, size: 12, color: { argb: "FFFFFFFF" } },
  alignment: { horizontal: "center", vertical: "middle" },
  fill: {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF5733" },
  },
  border: {
    bottom: { style: "medium", color: { argb: "FF900C3F" } },
  },
};

export { classicHeaderStyle, modernHeaderStyle, minimalistHeaderStyle, darkHeaderStyle, vibrantHeaderStyle };

export const getHeaderStyleTheme = (theme: "classic" | "modern" | "minimalist" | "dark" | "vibrant"): HeaderStyle => {
  const themes = {
    classic: classicHeaderStyle,
    modern: modernHeaderStyle,
    minimalist: minimalistHeaderStyle,
    dark: darkHeaderStyle,
    vibrant: vibrantHeaderStyle,
  };
  return themes[theme];
};