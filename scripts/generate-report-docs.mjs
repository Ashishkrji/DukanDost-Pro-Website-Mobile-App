/**
 * DukanDost Pro — Report Generator
 * Converts PROJECT_REPORT.md → PROJECT_REPORT.docx
 *
 * Run: node scripts/generate-report-docs.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  PageOrientation,
  PageBreak,
  HorizontalPositionAlign,
} from 'docx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const mdPath = path.join(rootDir, 'PROJECT_REPORT.md');
const docxPath = path.join(rootDir, 'PROJECT_REPORT.docx');

// ── Colours ────────────────────────────────────────────
const ACCENT  = '1E3A5F';   // dark navy
const ACCENT2 = '2563EB';   // blue
const GRAY    = 'F1F5F9';   // light gray bg for table header
const WHITE   = 'FFFFFF';

// ── Helpers ────────────────────────────────────────────
function heading1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT2 } },
  });
}

function heading2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });
}

function heading3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
  });
}

function bodyPara(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: 'Calibri', ...opts })],
    spacing: { after: 120 },
  });
}

function bulletPara(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: 'Calibri' })],
    bullet: { level: 0 },
    spacing: { after: 80 },
  });
}

function codePara(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Courier New', size: 18, color: '1E3A5F' })],
    spacing: { after: 60 },
    shading: { type: ShadingType.CLEAR, fill: 'EFF6FF' },
    indent: { left: 360 },
  });
}

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' } },
    spacing: { before: 200, after: 200 },
  });
}

function makeTable(rows) {
  // rows[0] = header row (array of strings), rows[1..] = data rows
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, rIdx) =>
      new TableRow({
        tableHeader: rIdx === 0,
        children: row.map(cell =>
          new TableCell({
            shading: rIdx === 0 ? { type: ShadingType.CLEAR, fill: ACCENT } : undefined,
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: String(cell).replace(/\*\*/g, '').replace(/`/g, ''),
                    bold: rIdx === 0,
                    color: rIdx === 0 ? WHITE : '1E293B',
                    size: rIdx === 0 ? 20 : 19,
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          })
        ),
      })
    ),
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 4, color: ACCENT2 },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT2 },
      left:   { style: BorderStyle.SINGLE, size: 4, color: ACCENT2 },
      right:  { style: BorderStyle.SINGLE, size: 4, color: ACCENT2 },
      insideH:{ style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
      insideV:{ style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
    },
  });
}

// ── MD Parser → docx children ─────────────────────────
function parseMarkdown(md) {
  const lines = md.split('\n');
  const children = [];
  let inCodeBlock = false;
  let inTable = false;
  let tableRows = [];
  let codeLines = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      children.push(makeTable(tableRows));
      children.push(new Paragraph({ spacing: { after: 160 } }));
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.startsWith('```')) {
      if (inTable) { flushTable(); }
      if (inCodeBlock) {
        codeLines.forEach(cl => children.push(codePara(cl)));
        children.push(new Paragraph({ spacing: { after: 100 } }));
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Tables
    if (line.startsWith('|')) {
      inTable = true;
      // skip separator rows like |---|---|
      if (/^\|[-| :]+\|$/.test(line)) continue;
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
        .map(c => c.trim());
      tableRows.push(cells);
      continue;
    }

    if (inTable && !line.startsWith('|')) {
      flushTable();
    }

    // Headings
    if (line.startsWith('#### ')) {
      children.push(heading3(line.slice(5)));
    } else if (line.startsWith('### ')) {
      children.push(heading3(line.slice(4)));
    } else if (line.startsWith('## ')) {
      children.push(heading2(line.slice(3)));
    } else if (line.startsWith('# ')) {
      children.push(heading1(line.slice(2)));
    }
    // Horizontal rule
    else if (/^---+$/.test(line.trim())) {
      children.push(divider());
    }
    // Bullets
    else if (line.match(/^[\-\*] /)) {
      const text = line.replace(/^[\-\*] /, '').replace(/\*\*/g, '').replace(/`/g, '');
      children.push(bulletPara(text));
    }
    // Numbered list
    else if (line.match(/^\d+\. /)) {
      const text = line.replace(/^\d+\. /, '').replace(/\*\*/g, '').replace(/`/g, '');
      children.push(bulletPara(text));
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      const text = line.slice(2).replace(/\*\*/g, '');
      children.push(new Paragraph({
        children: [new TextRun({ text, italics: true, color: ACCENT2, size: 22, font: 'Calibri' })],
        indent: { left: 360 },
        spacing: { after: 120 },
        border: { left: { style: BorderStyle.THICK, size: 6, color: ACCENT2 } },
      }));
    }
    // Empty line
    else if (line.trim() === '') {
      children.push(new Paragraph({ spacing: { after: 80 } }));
    }
    // Normal paragraph — strip markdown bold/code/italic
    else {
      const clean = line.replace(/\*\*(.+?)\*\*/g, '$1').replace(/`(.+?)`/g, '$1').replace(/\*(.+?)\*/g, '$1');
      children.push(bodyPara(clean));
    }
  }

  if (inTable) flushTable();

  return children;
}

// ── Cover Page ─────────────────────────────────────────
function makeCoverPage() {
  return [
    new Paragraph({ spacing: { before: 1200 } }),
    new Paragraph({
      children: [new TextRun({ text: 'DukanDost Pro', bold: true, size: 64, color: ACCENT, font: 'Calibri' })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Complete Project Report', size: 36, color: ACCENT2, font: 'Calibri' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT2 } },
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'AI-Powered Business Operating System for Indian Retail', size: 28, italics: true, color: '475569', font: 'Calibri' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Developed by  Maajanki Web Tech Digital Agency', size: 24, font: 'Calibri', color: '1E293B' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Version 1.0  |  May 2026', size: 22, font: 'Calibri', color: '64748B' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'GitHub: github.com/Ashishkrji/DukanDost-Pro-Website-Mobile-App', size: 20, font: 'Calibri', color: ACCENT2 })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ── Build DOCX ─────────────────────────────────────────
async function build() {
  console.log('📄 Reading PROJECT_REPORT.md ...');
  const md = fs.readFileSync(mdPath, 'utf-8');

  // Skip the first H1 (already on cover page)
  const mdBody = md.replace(/^# .+\n/, '');

  console.log('🔨 Parsing Markdown → DOCX elements ...');
  const bodyChildren = parseMarkdown(mdBody);

  const doc = new Document({
    creator: 'DukanDost Pro',
    title: 'DukanDost Pro — Complete Project Report',
    description: 'AI-Powered Business Operating System for Indian Retail',
    styles: {
      default: {
        heading1: {
          run: { size: 36, bold: true, color: ACCENT, font: 'Calibri' },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        heading2: {
          run: { size: 28, bold: true, color: ACCENT2, font: 'Calibri' },
          paragraph: { spacing: { before: 300, after: 150 } },
        },
        heading3: {
          run: { size: 24, bold: true, color: '334155', font: 'Calibri' },
          paragraph: { spacing: { before: 200, after: 100 } },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [...makeCoverPage(), ...bodyChildren],
      },
    ],
  });

  console.log('💾 Writing PROJECT_REPORT.docx ...');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Done! Saved to: ${docxPath}`);
  console.log(`📦 File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

build().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
