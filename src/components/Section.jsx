import React from "react";

export const Section = ({ children, className, ...props }) => {
  return (
    <>
      <section className={`mb-3 ${className}`} {...props}>
        {children}
      </section>
    </>
  );
};
