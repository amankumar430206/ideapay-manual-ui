import clsx from "clsx";
import Image from "next/image";
import React from "react";

import styles from "./icon.module.scss";

const sizes = {
  small: 16,
  regular: 20,
  medium: 24,
  large: 28,
};

const Icon = ({ src, size, light, ...props }) => {
  if (size === "sm")
    return (
      <Image
        className={`${styles.icon} ${light ? styles.light : ""}`}
        src={src}
        width={sizes.small}
        {...props}
      />
    );
  if (size === "lg")
    return (
      <Image
        className={`${styles.icon} ${light ? styles.light : ""}`}
        src={src}
        width={sizes.large}
        {...props}
      />
    );

  return (
    <Image
      className={`${styles.icon} ${light ? styles.light : ""}`}
      src={src}
      width={sizes.regular}
      {...props}
    />
  );
};

export const SvgIcon = ({ children }) => {
  return <span>{children}</span>;
};

export default Icon;
