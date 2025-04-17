// useExcelExporter.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateExcelFile } from './lib/useExcelExporter';
import type { ExportOptions } from './lib/useExcelExporter';

describe('generateExcelFile', () => {
  const mockLinkClick = vi.fn();
  const originalCreateElement = document.createElement;

  beforeEach(() => {
    // Mock anchor tag behavior
    vi.stubGlobal('URL', {
      createObjectURL: () => 'blob:mock',
      revokeObjectURL: vi.fn(),
    });

    document.createElement = vi.fn((tag: string) => {
      if (tag === 'a') {
        return {
          set href(value: string) {},
          download: '',
          click: mockLinkClick,
        } as unknown as HTMLAnchorElement;
      }
      return originalCreateElement.call(document, tag);
    });
  });

  it('generates a valid file without crashing', async () => {
    const config: ExportOptions = {
      fileName: 'test-export.xlsx',
      sheets: [
        {
          name: 'TestSheet',
          columns: [
            { label: 'Name', key: 'name' },
            { label: 'Score', key: 'score', format: '0.00' },
          ],
          data: [
            { name: 'Alice', score: 95.25 },
            { name: 'Bob', score: 82.1 },
          ],
        },
      ],
    };

    await generateExcelFile(config);
    expect(mockLinkClick).toHaveBeenCalled();
  });
});
