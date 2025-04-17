// useExcelExporter.ts
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

export const generateExcelFile = async (config: ExportOptions) => {
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
  link.click();
  URL.revokeObjectURL(link.href);
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
