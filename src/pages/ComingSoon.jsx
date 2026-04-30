import React from "react";
import { Button, ButtonGroup } from "../components/buttons/Button";
import { Section } from "../components/Section";
import ComingSoonImg from "../static/soon.png";

export const ComingSoonPage = () => {
  return (
    <Section>
      <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
        <img
          src={ComingSoonImg}
          alt="page in progress"
          style={{ height: "15rem" }}
        />
      </div>
    </Section>
  );
};
