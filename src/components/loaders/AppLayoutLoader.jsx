import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Navbar } from "../Navbar";
import { SubNavbar } from "../SubNavbar";

const AppLayoutLoader = () => {
  return (
    <div>
      <Skeleton height={60} />
      <div className="container py-3">
        <SkeletonTheme height={120}>
          <div className="row">
            <div className="col-sm-12 col-md-3 col-lg-3">
              <Skeleton />
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3">
              <Skeleton />
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3">
              <Skeleton />
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3">
              <Skeleton />
            </div>
          </div>
        </SkeletonTheme>

        <div className="row g-3 mt-4">
          <SkeletonTheme height={30}>
            {Array(10)
              .fill(1)
              .map((i) => (
                <div className="col-12">
                  <Skeleton />
                </div>
              ))}
          </SkeletonTheme>
        </div>
      </div>
    </div>
  );
};

export default AppLayoutLoader;
