import jsPDF from "jspdf";
import Logo from "../static/rbp-full-logo-dark.png";

export const writeJSONToPdf = ({ jsonData }) => {
  const doc = new jsPDF();
  doc.setFontSize(10); // Change this value to set the desired font size
  let yOffset = 10;

  for (const key in jsonData) {
    if (Object.hasOwnProperty.call(jsonData, key)) {
      doc.text(key, 10, yOffset);
      doc.text(jsonData[key], 10, yOffset + 5); // Adjust the yOffset for the value
      yOffset += 15; // Increment yOffset to move to the next key-value pair
    }
  }

  doc.save("AccountActivation.pdf");
  return doc;
};

export const generateAccountActivationPdf = ({ jsonData }) => {
  return new Promise((resolve) => {
    const doc = new jsPDF();
    doc.setFontSize(10); // Change this value to set the desired font size
    let yOffset = 50; // Adjust vertical offset to accommodate the logo

    // Add logo to the top center
    const imgWidth = 60; // Adjust the width of the logo as needed
    const imgHeight = 8; // Adjust the height of the logo as needed
    const centerX = doc.internal.pageSize.getWidth() / 2 - imgWidth / 2;
    doc.addImage(Logo, "PNG", centerX, 20, imgWidth, imgHeight);

    // Add JSON data below the logo
    for (const key in jsonData) {
      if (Object.hasOwnProperty.call(jsonData, key)) {
        doc.text(key, 10, yOffset);
        doc.text(jsonData[key], 10, yOffset + 5);
        yOffset += 20;
      }
    }

    doc.save("AccountActivation.pdf");

    const blob = doc.output("blob"); // Convert the PDF document to a Blob object
    resolve(blob);
  });
};

export const writeJSONToPdfTable = ({ jsonData }) => {
  const doc = new jsPDF();
  let yOffset = 10;

  // Set font size and header text
  doc.setFontSize(10);
  yOffset += 10;

  // Draw table rows
  for (const key in jsonData) {
    if (Object.hasOwnProperty.call(jsonData, key)) {
      doc.text(key, 10, yOffset);
      doc.text(jsonData[key], 80, yOffset);
      yOffset += 10; // Increment yOffset to move to the next line
    }
  }
  doc.save("AccountActivation.pdf");
  return doc;
};
