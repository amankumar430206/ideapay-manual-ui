import Skeleton from "react-loading-skeleton";

export const DisplayData = ({
  data = [
    {
      text: "Some Key",
      value: "Ssome Abosolute Value for the provided key",
    },
  ],
}) => {
  return (
    <>
      <div className="row g-4">
        {data.map((d) => {
          return (
            <div className="col-sm-12 col-md-6 col-lg-4">
              <h6 className="text-muted text-capitalize">{d.text}</h6>
              <h6>{d.value}</h6>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const DisplayContent = ({
  data = [
    {
      text: "Some Key",
      value: "Ssome Abosolute Value for the provided key",
    },
  ],
}) => {
  return (
    <>
      <div className="row g-4">
        {data.map((d) => {
          return (
            <div className="col-sm-12 col-md-6 col-lg-4">
              <h6 className="text-muted">{d.text}</h6>
              <p className="mb-0">{d.value}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const DisplayDataColumn = ({
  data = [
    {
      text: "Some Key",
      value: "",
    },
  ],
}) => {
  return (
    <>
      <ul className="list-group mt-3">
        {data.map((item) => (
          <li className="list-group-item p-0 d-flex">
            <span
              style={{ width: "50%" }}
              className="px-3 py-2 text-wrap border-0 border-end rounded-0 text-capitalize alert alert-light m-0"
            >
              {item.text}
            </span>
            <p className="bg-white py-2 ms-3 px-3 text-wrap w-100 text-muted m-0">
              {item.value}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export const SkeletonDisplayData = ({}) => {
  return (
    <>
      <div className="row g-4">
        {Array(9)
          .fill(1)
          .map((d) => {
            return (
              <div className="col-sm-12 col-md-6 col-lg-4">
                <Skeleton />
                <Skeleton />
              </div>
            );
          })}
      </div>
    </>
  );
};
