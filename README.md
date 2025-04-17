# react-excel-export-lite

A super lightweight and flexible React hook for exporting structured table data to Excel (`.xlsx`) — no dependencies on heavy UI libraries or table frameworks.

Perfect for simple apps, dashboards, and internal tools where you just want to export your data and move on with your life.

---

## ✨ Features

- 📄 Export one or more sheets to a `.xlsx` file
- 💡 Fully customizable columns and data
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
