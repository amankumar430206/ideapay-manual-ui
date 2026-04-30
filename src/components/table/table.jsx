import React, { useEffect } from "react";
import { SkeletonTableData } from "./SkeletonTable";
import "./table.scss";

import NoDataImg from "./icons/no-data.png";
import { memo } from "react";

export const Table = memo(
  ({
    children,
    cols,
    data,
    dataSize = 0,
    pagination,
    totalPages,
    loading,
    filters,
    ...props
  }) => {
    const Filters = () => filters;
    return (
      <>
        <div className="table-responsive mb-3 mt-2 border" {...props}>
          <table className={`table table-flush m-0`}>
            <thead className="bg-light">
              <Row>
                {cols?.map((value) => {
                  return <TableHeader value={value} key={value} />;
                })}
              </Row>
            </thead>
            <tbody>
              <>
                <Filters />
                {loading ? (
                  <SkeletonTableData colSize={cols.length} />
                ) : (
                  <>
                    {dataSize ? (
                      <>{children}</>
                    ) : (
                      <>
                        <Row style={{ height: "100px" }}>
                          <Data colSpan={cols.length}>
                            <img
                              style={{ height: "10rem" }}
                              className="img-fluid"
                              src={NoDataImg}
                              alt="no data found"
                            />
                            <p className="text-muted mt-3">No Data Found</p>
                          </Data>
                        </Row>
                      </>
                    )}
                  </>
                )}
              </>
            </tbody>
            {/* custom table content */}
          </table>
        </div>
      </>
    );
  }
);

// hydrating plain data as provided in data props
export const HydrateData = ({ value }) => {
  const dataKeys = Object.keys(value);
  return (
    <Row>
      {dataKeys?.map((key) => (
        <>
          <Data key={key}>{value[key]}</Data>
        </>
      ))}
    </Row>
  );
};

export const TableHeader = ({ value }) => {
  return (
    <th className="table_th text-muted text-uppercase bg-light py-3">
      {value}
    </th>
  );
};

export const TableRow = ({ children, ...props }) => {
  return (
    <tr className="table_tr" {...props}>
      {children}
    </tr>
  );
};

export const TableData = ({ children, format = false, ...props }) => (
  <td className={`table_td py-3 ${format && "text-capitalize"}`} {...props}>
    {children}
  </td>
);

export const Row = TableRow;
export const Data = TableData;

export default Table;
