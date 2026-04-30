import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SkeletonTable = ({ children }) => {
  return (
    <>
      <SkeletonTheme height={25}>
        <div className="row gx-3 gy-1">
          <div className="col-12">
            <Skeleton count={1} height={40} />
          </div>
          <div className="col-2">
            <Skeleton count={8} />
          </div>
          <div className="col-8">
            <Skeleton count={8} />
          </div>
          <div className="col-2">
            <Skeleton count={8} />
          </div>
        </div>
      </SkeletonTheme>
      {children}
    </>
  );
};

export const SkeletonTableData = ({ colSize }) => {
  return (
    <>
      <SkeletonTheme height={10}>
        <tr>
          {Array(colSize)
            .fill(1)
            ?.map((v, indx) => {
              return (
                <td key={`laoder-key-${indx}`}>
                  <Skeleton count={10} />
                </td>
              );
            })}
        </tr>
      </SkeletonTheme>
    </>
  );
};

export default SkeletonTable;
