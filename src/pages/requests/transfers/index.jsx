import React from "react";
import { Button, ButtonGroup } from "../../components/buttons/Button";

export const TransferPage = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h4 className="display-6">Transfers</h4>
        <ButtonGroup>
          <Button className="btn btn-primary" text={"+ Create Account"} />
        </ButtonGroup>
      </div>

      <section className="my"></section>
    </div>
  );
};

export default TransferPage;
