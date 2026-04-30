export const OnlyInPc = ({ children }) => {
  return <div className="d-none d-md-block d-lg-block">{children}</div>;
};

export const OnlyInMobile = ({ children }) => {
  return <div className="d-block d-md-none d-lg-none">{children}</div>;
};

export const OnlyInTablet = ({ children }) => {
  return (
    <div className="d-none d-sm-block d-md-block d-lg-none">{children}</div>
  );
};
