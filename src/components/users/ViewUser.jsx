import React, { lazy } from "react";
import { DisplayData } from "../../components/DisplayData";
import { Section } from "../Section";
import { Button, ButtonGroup } from "../buttons/Button";

import { ViewUserDetails } from "./ViewUserDetails";

const ViewUser = ({ id, onClose }) => {
  return (
    <>
      <ViewUserDetails id={id} />

      <Section className={"mt-5"}>
        <ButtonGroup>
          <Button
            className="btn btn-primary"
            text={"Close"}
            type="button"
            onClick={() => onClose()}
          />
        </ButtonGroup>
      </Section>
    </>
  );
};

export default ViewUser;
