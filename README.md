# react-excel-export-lite

A super lightweight and flexible React hook for exporting structured table data to Excel (`.xlsx`) — no dependencies on heavy UI libraries or table frameworks.

Perfect for simple apps, dashboards, and internal tools where you just want to export your data and move on with your life.

---

## ✨ Features

- 📄 Export one or more sheets to a `.xlsx` file
- 💡 Customizable columns and data
- ⚛️ Framework-agnostic: works with any table or UI
- 📦 Zero dependencies outside of [`exceljs`](https://github.com/exceljs/exceljs)
- 🧪 Tested with [Vitest](https://vitest.dev/)

---

## 📦 Installation

*Note: coming soon - not yet published*

```bash
npm install react-excel-export-lite exceljs
```

## 🚀 Quick Start

1. Define your data and columns

```js
const data = [
  { name: 'Alice', score: 95 },
  { name: 'Bob', score: 87 },
];

const columns = [
  { label: 'Student Name', key: 'name' },
  { label: 'Test Score', key: 'score', format: '0.00' },
];

```

2. Use the hook

```tsx
import { useExcelExporter } from 'react-excel-export-lite';

const ExportButton = () => {
  const { exportToExcel } = useExcelExporter({
    fileName: 'students.xlsx',
    sheets: [
      {
        name: 'Scores',
        columns,
        data,
      },
    ],
  });

  return <button onClick={exportToExcel}>Export to Excel</button>;
};
```

## 🛠 API

### `useExcelExporter(config)`

**Returns**: A hook with the following method:
- `exportToExcel()`: Triggers the download of the Excel file.

### Config Options

```ts
type ExportOptions = {
  fileName: string; // Name of the exported file
  sheets: {
    name: string; // Name of the sheet
    columns: {
      label: string; // Column header label
      key: string; // Key to map data
      format?: string; // Optional Excel format string
      style?: (value: any, row: any) => Partial<ExcelJS.Style>; // Optional cell styling
    }[];
    data: Record<string, any>[]; // Array of data objects
    headerStyle?: HeaderStyle; // Optional header styling
    freezeHeader?: boolean; // Optional: Freeze the header row
  }[];
};
```

## 🎨 Predefined Header Styles

You can use one of the predefined header styles to quickly style your Excel sheet headers:

- **Classic**: A simple and clean style.
- **Modern**: A bold and professional look.
- **Minimalist**: A lightweight and subtle design.
- **Dark**: A dark-themed header.
- **Vibrant**: A colorful and attention-grabbing style.

Example:

```tsx
import { getHeaderStyleTheme } from 'react-excel-export-lite';

const { exportFile } = useExcelExporter({
  fileName: "example.xlsx",
  sheets: [
    {
      name: "Sheet1",
      columns: [
        { label: "Name", key: "name" },
        { label: "Age", key: "age" },
      ],
      data: [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
      ],
      headerStyle: getHeaderStyleTheme("modern"), // Apply the "modern" theme
    },
  ],
});
```

```tsx
// "classic" header style
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


const { exportFile } = useExcelExporter({
  fileName: "example.xlsx",
  sheets: [
    {
      name: "Sheet1",
      columns: [
        { label: "Name", key: "name" },
        { label: "Age", key: "age" },
        {
          label: "Salary",
          key: "salary",
          format: "$#,##0.00",
          style: (value) => ({
            font: {
              color: value > 50000 ? { argb: "FFFF0000" } : undefined,
            },
            alignment: { horizontal: "right" },
          }),
        },
      ],
      data: [
        { name: "George", age: 25, salary: 45000 },
        { name: "Bob", age: 30, salary: 55000 },
      ],
      headerStyle: getHeaderStyleTheme("modern"),
      freezeHeader: true,
    },
  ],
});

// Usage in a button
<button onClick={exportFile}>Export to Excel</button>;
```

> 💡 You can place the button anywhere — the hook keeps the logic cleanly separated.

## 🛠 API

`useExcelExporter(config)`

Returns a hook with a single method:

* exportToExcel(): Triggers download of the Excel file.

**Config Options:**

```ts
type ExportOptions = {
  fileName: string;
  sheets: {
    name: string;
    columns: {
      label: string;
      key: string;
      format?: string; // Optional Excel format string
    }[];
    data: Record<string, any>[];
  }[];
};
```

## 🔧 Alternative Usage (without hook)

```ts
import { generateExcelFile } from 'react-excel-export-lite';

generateExcelFile({
  fileName: 'report.xlsx',
  sheets: [ /* your sheet config here */ ]
});
```

Useful for non-React projects, scripts, or custom integration points.

## 🧪 Testing

This project is tested with Vitest. To run tests:

```bash
npm run test
```

## 📘 License

MIT

## 🙌 Acknowledgements

Built using ExcelJS under the hood.

## 💡 Ideas or Feedback?

Feel free to fork, open issues, or contribute. Designed to stay lightweight and easy to use.

## 💖 Support This Project

If you find this library helpful and want to support its development, consider buying me a coffee! Your support helps keep this project maintained and improves its features.

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/dev-jesser)