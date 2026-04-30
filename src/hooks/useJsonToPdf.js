import BrandLogoHeader from "../static/app-logo-light.png";
import jsPDF from "jspdf";
import { autoTable, applyPlugin } from "jspdf-autotable";
import { useCallback } from "react";
import { snakeCaseToText } from "../utils/caseConvertUtils";

applyPlugin(jsPDF);

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const B = {
  name: "IdeaPay",
  slogan: "Smart Payments, Smarter Business",
  web: "www.ideapay.org",
  email: "support@ideapay.org",
  addr: "FT 820, 8/F, NEW TECH PLAZA, 34 TAI YAU ST, San Po Kong, Hong Kong",
  legal: "Confidential · For authorised recipients only · © IdeaPay",
  logoPath: BrandLogoHeader,

  orange: [255, 134, 13],
  white: [255, 255, 255],
  ink: [22, 22, 22],
  slate: [75, 85, 99],
  silver: [148, 163, 184],
  border: [220, 220, 220],
  rowAlt: [250, 250, 250],
  rowBorder: [235, 235, 235],
  headBg: [45, 45, 45], // near-black table header
};

// ── Layout constants (mm) ─────────────────────────────────────────────────────

// Page 1:  header band  (logo + rule)
const HDR_H = 26; // height of the clean header band

// Page 2+: header is smaller (no address line, just logo + rule)
// The "continued" label sits in the gap between HDR_H and TABLE_TOP_P2.
const HDR_H_P2 = 22; // compact header on continuation pages
const CONT_LABEL_H = 12; // space the "continued" label occupies below header
const TABLE_TOP_P2 = HDR_H_P2 + CONT_LABEL_H + 2; // = 32 mm

const FTR_H = 12;
const MX = 14; // horizontal margin

// ─── CJK detection ────────────────────────────────────────────────────────────

export function hasCJK(str) {
  return /[\u2E80-\u9FFF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u3000-\u303F]/.test(String(str ?? ""));
}

// ─── CJK font loader ──────────────────────────────────────────────────────────

const CJK_FONT_NAME = "NotoSansTC";
const CJK_FONT_STYLE = "normal";
const CJK_TTF_DIRECT = "https://fonts.gstatic.com/s/notosanstc/v35/-nF7OG829Oofr2wohFbTp9iFOSsLA_ZJ1g.ttf";

let _cjkBase64 = null;
let _cjkPromise = null;

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const CHUNK = 8192;
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK) binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  return btoa(binary);
}

function isTTF(buffer) {
  const magic = new DataView(buffer).getUint32(0);
  return magic === 0x00010000 || magic === 0x4f54544f;
}

async function loadCJKFont() {
  if (_cjkBase64) return _cjkBase64;
  if (_cjkPromise) return _cjkPromise;
  _cjkPromise = (async () => {
    try {
      const res = await fetch(CJK_TTF_DIRECT);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      if (!isTTF(buf)) throw new Error("Not a TTF file");
      _cjkBase64 = arrayBufferToBase64(buf);
      return _cjkBase64;
    } catch (err) {
      console.warn("[useJsonToPdf] CJK font load failed:", err.message);
      return null;
    }
  })();
  return _cjkPromise;
}

function registerCJKFont(doc, base64) {
  if (!base64) return false;
  try {
    if (!doc.getFontList()[CJK_FONT_NAME]) {
      doc.addFileToVFS(`${CJK_FONT_NAME}.ttf`, base64);
      doc.addFont(`${CJK_FONT_NAME}.ttf`, CJK_FONT_NAME, CJK_FONT_STYLE);
    }
    return true;
  } catch (err) {
    console.warn("[useJsonToPdf] Font registration error:", err.message);
    return false;
  }
}

function setSmartFont(doc, str, latinStyle = "normal", cjkLoaded = true) {
  if (cjkLoaded && hasCJK(str)) doc.setFont(CJK_FONT_NAME, CJK_FONT_STYLE);
  else doc.setFont("helvetica", latinStyle);
}

// ─── Logo loader ──────────────────────────────────────────────────────────────

async function loadLogo() {
  try {
    const res = await fetch(B.logoPath);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fillRect(doc, x, y, w, h, rgb) {
  doc.setFillColor(...rgb);
  doc.rect(x, y, w, h, "F");
}

// ─── Page header — CLEAN MINIMAL ─────────────────────────────────────────────
//
//  White background.
//  LEFT  — logo image (or brand name text fallback)
//          address line in silver beneath it
//  RIGHT — Web / Email in small text
//  BOTTOM — single 0.3 pt grey rule
//
//  No coloured bands, no fills, no decoration.
//
function drawHeader(doc, pw, logo, isFirstPage = true) {
  // White background (clears any bleed from previous draws)
  fillRect(doc, 0, 0, pw, HDR_H, B.white);

  const topY = 5;

  // ── Logo / brand name ──────────────────────────────────────────────────────
  if (logo) {
    doc.addImage(logo, "PNG", MX, topY, 11, 11);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...B.orange);
    doc.text(B.name, MX, topY + 8);
  }

  // Address line (only on page 1 — keeps continuation header compact)
  if (isFirstPage) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...B.slate);
    doc.text(B.addr, MX, topY + 15);
  }

  // ── Right-side contact block ───────────────────────────────────────────────
  const drawContact = (label, value, y) => {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...B.ink);
    const lw = doc.getTextWidth(label + " ");
    doc.text(label, pw - MX, y, { align: "right" });
    // value sits left of the right-aligned label block
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...B.slate);
    doc.text(value, pw - MX - lw, y, { align: "right" });
  };

  // Right-align "Web: www.ideapay.in" as two segments
  const drawContactLine = (label, value, y) => {
    doc.setFontSize(7.5);
    // measure both
    doc.setFont("helvetica", "bold");
    const labelW = doc.getTextWidth(label + "  ");
    doc.setFont("helvetica", "normal");
    const valueW = doc.getTextWidth(value);
    const startX = pw - MX - labelW - valueW;
    // label
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...B.ink);
    doc.text(label, startX, y);
    // value
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...B.slate);
    doc.text(value, startX + labelW, y);
  };

  drawContactLine("Web:", B.web, topY + 6);
  drawContactLine("Email:", B.email, topY + 13);

  // ── Bottom rule ────────────────────────────────────────────────────────────
  doc.setDrawColor(...B.border);
  doc.setLineWidth(0.3);
  doc.line(MX, HDR_H - 1, pw - MX, HDR_H - 1);
}

// ─── Page footer ──────────────────────────────────────────────────────────────

function drawFooter(doc, pw, ph, cur, total) {
  const fy = ph - FTR_H;

  // Top rule
  doc.setDrawColor(...B.border);
  doc.setLineWidth(0.3);
  doc.line(MX, fy, pw - MX, fy);

  const ty = fy + FTR_H / 2 + 1.5;

  // Legal — left
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...B.silver);
  doc.text(B.legal, MX, ty);

  // Brand name — centre in orange
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...B.orange);
  doc.text(B.name, pw / 2, ty, { align: "center" });

  // Page X / Y — right
  const segs = [
    { t: "Page ", f: "normal", c: B.silver },
    { t: `${cur}`, f: "bold", c: B.ink },
    { t: " / ", f: "normal", c: B.silver },
    { t: total > 0 ? `${total}` : "?", f: "bold", c: B.ink },
  ];
  doc.setFontSize(7.5);
  const tw = segs.reduce((a, s) => {
    doc.setFont("helvetica", s.f);
    return a + doc.getTextWidth(s.t);
  }, 0);
  let cx = pw - MX - tw;
  segs.forEach(({ t, f, c }) => {
    doc.setFont("helvetica", f);
    doc.setFontSize(7.5);
    doc.setTextColor(...c);
    doc.text(t, cx, ty);
    cx += doc.getTextWidth(t);
  });
}

// ─── Meta-info panel ──────────────────────────────────────────────────────────

function drawMetaPanel(doc, pw, startY, meta, cjkLoaded) {
  const {
    accountName = "—",
    accountId = "—",
    timezone = "—",
    dateType = "Created at",
    fromDate = "—",
    toDate = "—",
    reportName = "Report",
  } = meta;

  const usW = pw - MX * 2;

  // ── Section title — simple, clean ─────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...B.ink);
  doc.text(reportName, MX, startY + 6);

  // Thin orange underline only under the title text
  doc.setDrawColor(...B.orange);
  doc.setLineWidth(0.5);
  doc.line(MX, startY + 8, MX + doc.getTextWidth(reportName), startY + 8);

  // Generated timestamp — right of title line
  const ts = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...B.silver);
  doc.text(`Generated: ${ts}`, pw - MX, startY + 6, { align: "right" });

  // ── Meta fields — flat row, no cards, just label + value pairs ────────────
  const rowY = startY + 14;

  // Light background strip for the meta row
  fillRect(doc, MX, rowY - 1, usW, 14, [247, 247, 247]);

  // Draw a subtle left-edge accent bar
  fillRect(doc, MX, rowY - 1, 2, 14, B.orange);

  const fields = [
    { label: "Account Name", value: accountName },
    { label: "Account ID", value: accountId },
    { label: "Time Zone", value: timezone },
    { label: "Date Range", value: dateType },
    { label: "From Date", value: fromDate },
    { label: "To Date", value: toDate },
  ];

  const colW = usW / fields.length;
  const innerMX = MX + 4; // shift right past the accent bar

  fields.forEach(({ label, value }, i) => {
    const cx = innerMX + i * colW;
    const valStr = String(value ?? "");
    const maxW = colW - 4;

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    doc.setTextColor(...B.silver);
    doc.text(label.toUpperCase(), cx, rowY + 4);

    // Value — CJK-aware
    doc.setFontSize(8);
    doc.setTextColor(...B.ink);
    setSmartFont(doc, valStr, "bold", cjkLoaded);

    const lines = doc.splitTextToSize(valStr, maxW);
    doc.text(lines[0], cx, rowY + 10); // single line — panel is intentionally compact

    doc.setFont("helvetica", "normal");
  });

  // ── "Details" heading ─────────────────────────────────────────
  const subY = rowY + 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...B.silver);
  doc.text("Details", MX, subY);

  // Thin rule after heading
  doc.setDrawColor(...B.border);
  doc.setLineWidth(0.25);
  doc.line(MX + doc.getTextWidth("Details") + 4, subY - 1, pw - MX, subY - 1);

  return subY + 5; // autoTable startY
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useJsonToPdf = () => {
  const generatePdf = useCallback(
    async ({
      jsonData,
      headerName = "Data Report",
      meta = {},
      includeKeys = [],
      excludeKeys = [],
      fileName = "report.pdf",
      orientation = "landscape",
    }) => {
      const [logo, cjkBase64] = await Promise.all([loadLogo(), loadCJKFont()]);

      const doc = new jsPDF({ orientation, unit: "mm", format: "a2" });
      if (typeof doc.autoTable !== "function") autoTable(doc);

      const cjkLoaded = registerCJKFont(doc, cjkBase64);
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();

      // ── Page 1 ───────────────────────────────────────────────────────────
      drawHeader(doc, pw, logo, true);
      const tableY = drawMetaPanel(doc, pw, HDR_H + 3, meta, cjkLoaded);

      // ── Table data ───────────────────────────────────────────────────────
      const data = Array.isArray(jsonData) ? jsonData : [jsonData];
      let keys = [];
      if (data.length > 0) {
        keys = Object.keys(data[0]).filter((k) =>
          includeKeys.length > 0 ? includeKeys.includes(k) && !excludeKeys.includes(k) : !excludeKeys.includes(k),
        );
      }
      const colHeaders = keys.map((k) => snakeCaseToText(k));
      const rows = data.map((row) => keys.map((k) => row[k] ?? ""));

      doc.autoTable({
        startY: tableY,
        head: [colHeaders],
        body: rows,
        styles: {
          fontSize: 7.8,
          cellPadding: 2.8,
          overflow: "linebreak",
          lineColor: B.rowBorder,
          lineWidth: 0.15,
          textColor: B.ink,
          font: "helvetica",
          fontStyle: "normal",
        },
        headStyles: {
          fillColor: B.headBg,
          textColor: B.white,
          fontStyle: "bold",
          fontSize: 7.8,
          cellPadding: 3,
          font: "helvetica",
        },
        alternateRowStyles: { fillColor: B.rowAlt },
        columnStyles: {
          0: { textColor: B.slate },
        },
        didParseCell: ({ cell, section }) => {
          if (!cjkLoaded || section === "head") return;
          const raw = String(cell.raw ?? "");
          if (hasCJK(raw)) {
            cell.styles.font = CJK_FONT_NAME;
            cell.styles.fontStyle = CJK_FONT_STYLE;
          }
        },
        // ── KEY FIX: margin.top accounts for the "continued" label on page 2+ ──
        // autoTable re-uses the same margin for all pages.
        // We use the larger TABLE_TOP_P2 value so the table never starts
        // above the continued label on pages 2+.
        // On page 1 the table starts at tableY (which is already below the
        // meta panel), so the extra top margin is irrelevant there.
        margin: {
          top: TABLE_TOP_P2, // enough room for compact header + continued label
          left: MX,
          right: MX,
          bottom: FTR_H + 4,
        },
        didDrawPage: ({ pageNumber }) => {
          if (pageNumber === 1) {
            // Page 1 header already drawn above; just draw footer
            drawFooter(doc, pw, ph, pageNumber, 0);
            return;
          }

          // Page 2+ — compact header (no address line)
          drawHeader(doc, pw, logo, false);

          // "continued" label sits cleanly in the gap between the header rule
          // and the table top margin — no overlap possible
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(...B.silver);
          doc.text(`${headerName}  ·  continued`, MX, HDR_H_P2 + CONT_LABEL_H / 2 + 1);

          drawFooter(doc, pw, ph, pageNumber, 0);
        },
      });

      // Second pass — real page totals
      const total = doc.internal.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        drawFooter(doc, pw, ph, i, total);
      }

      doc.save(fileName);
    },
    [],
  );

  return { generatePdf };
};

export default useJsonToPdf;
