import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export const SignatureCapture = ({ onSave, onClear }) => {
  const signatureRef = useRef(null);

  // Function to clear the signature pad
  const clearSignature = () => {
    signatureRef.current.clear();
    onClear();
  };

  // Function to save the signature
  const saveSignature = () => {
    const signatureImage = signatureRef.current.toDataURL();
    onSave(signatureImage);
  };

  return (
    <div className="signature-capture border my-3">
      <div className="signature-pad">
        <SignatureCanvas
          ref={signatureRef}
          penColor="purple"
          canvasProps={{
            width: 400,
            height: 150,
            className: "signature-canvas",
          }}
        />
      </div>
      <div className="button-group m-3">
        <a className="btn btn-light" onClick={clearSignature}>
          Clear
        </a>
        <a className="btn btn-primary" onClick={saveSignature}>
          Save
        </a>
      </div>
    </div>
  );
};
