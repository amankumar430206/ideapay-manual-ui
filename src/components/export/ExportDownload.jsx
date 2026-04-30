import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useDataExport } from "../../hooks/useDataExport";
import useJsonToPdf from "../../hooks/useJsonToPdf";

const DEFAULT_HEADER_META = {
  accountName: "",
  accountId: "",
  timezone: "",
  dateType: "Created at",
  fromDate: "",
  toDate: "",
};

export const ExportDownload = ({
  label = "Export",
  data = [],
  pdfExportConfig = { includeKeys: [], excludeKeys: [] },
  filename = "export",
  formats = ["excel", "pdf", "csv", "json"],
  className = "",
  buttonVariant = "light",
  size = "md",
  showDropdown = true,
  onExportStart,
  onExportComplete,
  disabled = false,
  meta = DEFAULT_HEADER_META,
}) => {
  const { exportData, isExporting } = useDataExport();
  const [selectedFormat, setSelectedFormat] = useState(formats[0] || "csv");
  const { generatePdf } = useJsonToPdf();

  // Memoize data validation
  const isDataValid = useMemo(() => {
    return data && Array.isArray(data) && data.length > 0;
  }, [data]);

  const handleGeneratePdf = () => {
    generatePdf({
      jsonData: data,
      headerName: "Report",
      includeKeys: pdfExportConfig.includeKeys, // Optional: only include these keys
      excludeKeys: pdfExportConfig.excludeKeys, // Optional: exclude these keys
      fileName: filename,
      meta: meta || DEFAULT_HEADER_META,
    });
  };

  const handleExport = useCallback(
    async (format = selectedFormat) => {
      if (!isDataValid) {
        alert("No valid data to export");
        return;
      }

      onExportStart?.(format);

      const result = await exportData(data, filename, format);

      if (result.success) {
        toast("Download / Export Completed Successfully", {
          type: "success",
        });
        onExportComplete?.(result);
      } else {
        toast("Download / Export Failed", {
          type: "error",
        });
        onExportComplete?.(result);
      }
    },
    [data, filename, selectedFormat, isDataValid, exportData, onExportStart, onExportComplete],
  );

  const buttonSizeClass = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  }[size];

  const isDisabled = disabled || isExporting || !isDataValid;

  if (!showDropdown || formats.length === 1) {
    // Simple button mode
    return (
      <button
        className={`btn btn-${buttonVariant} text-muted ${buttonSizeClass} ${className}`}
        onClick={() => handleExport()}
        disabled={isDisabled}
        type="button"
      >
        {isExporting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Exporting...
          </>
        ) : (
          <>
            <i className="bi bi-download"></i>
            {label}
          </>
        )}
      </button>
    );
  }

  // Dropdown mode
  return (
    <div className={`btn-group ${className}`}>
      <button
        className={`btn btn-${buttonVariant} ${buttonSizeClass}`}
        onClick={() => handleExport()}
        disabled={isDisabled}
        type="button"
      >
        {isExporting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Exporting...
          </>
        ) : (
          <>
            <i className="bi bi-download me-2"></i>
            {label}
          </>
        )}
      </button>

      <button
        type="button"
        className={`btn btn-${buttonVariant} text-white ${buttonSizeClass} dropdown-toggle dropdown-toggle-split`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        disabled={isDisabled}
      >
        <span className="visually-hidden">Toggle Dropdown</span>
      </button>

      <ul className="dropdown-menu">
        {formats.map((format) => (
          <li key={format}>
            <button
              className={`dropdown-item ${format === selectedFormat ? "active" : ""}`}
              onClick={() => {
                if (format === "pdf") {
                  handleGeneratePdf();
                } else {
                  setSelectedFormat(format);
                  handleExport(format);
                }
              }}
              type="button"
            >
              <i className={`bi bi-filetype-${format} me-2`}></i>
              {format.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExportDownload;
