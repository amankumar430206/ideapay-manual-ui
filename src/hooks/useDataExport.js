import { useCallback, useState } from "react";

// Custom hook for data export functionality
export const useDataExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Convert JSON to CSV
  const jsonToCsv = useCallback((data) => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Data must be a non-empty array");
    }

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(",");

    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Handle special characters and quotes in CSV
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"') || value.includes("\n"))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? "";
        })
        .join(",")
    );

    return [csvHeaders, ...csvRows].join("\n");
  }, []);

  // Convert JSON to Excel-compatible CSV (with BOM for proper encoding)
  const jsonToExcel = useCallback(
    (data) => {
      const csv = jsonToCsv(data);
      // Add BOM for Excel compatibility
      return "\uFEFF" + csv;
    },
    [jsonToCsv]
  );

  // Create and trigger download
  const downloadFile = useCallback((content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // Main export function
  const exportData = useCallback(
    async (data, filename = "export", format = "csv") => {
      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error("No data to export");
      }

      setIsExporting(true);

      try {
        let content, mimeType, fileExtension;

        switch (format.toLowerCase()) {
          case "csv":
            content = jsonToCsv(data);
            mimeType = "text/csv;charset=utf-8;";
            fileExtension = "csv";
            break;

          case "excel":
          case "xlsx":
            content = jsonToExcel(data);
            mimeType = "application/vnd.ms-excel;charset=utf-8;";
            fileExtension = "csv"; // Excel-compatible CSV
            break;

          case "json":
            content = JSON.stringify(data, null, 2);
            mimeType = "application/json;charset=utf-8;";
            fileExtension = "json";
            break;

          default:
            throw new Error(`Unsupported format: ${format}`);
        }

        const finalFilename = `${filename}.${fileExtension}`;
        downloadFile(content, finalFilename, mimeType);

        return { success: true, filename: finalFilename };
      } catch (error) {
        console.error("Export error:", error);
        return { success: false, error: error.message };
      } finally {
        setIsExporting(false);
      }
    },
    [jsonToCsv, jsonToExcel, downloadFile]
  );

  return {
    exportData,
    isExporting,
  };
};
