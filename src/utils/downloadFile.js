export const downloadFile = (data, filename) => {
  const url = URL.createObjectURL(new Blob([data]));
  downloadFileFromLink(url, filename);
};

export const downloadPDFFromBase64 = (data, filename) => {
  const link = document.createElement("a");
  link.href = `data:application/pdf;base64,${data}`;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // removing the created Link
  setTimeout(() => {
    link.remove();
  }, 1000);
};

export const downloadFileFromLink = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  // removing the created Link
  setTimeout(() => {
    link.remove();
  }, 1000);
};
