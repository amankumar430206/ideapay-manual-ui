import React from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./cards.module.scss";

export const StatsCard = ({
  title,
  text,
  valueLabel,
  value,
  image,
  loading,
}) => {
  return (
    <>
      <div className={`${styles.card} shadow-sm`}>
        <div>
          <p className={styles.card_text}>{text}</p>
          {loading ? (
            <Skeleton />
          ) : (
            <div className={styles.card_value}>
              {!!valueLabel && (
                <span className={styles.card_value_pre}>{valueLabel}</span>
              )}
              {{ value } && (
                <span className={styles.card_value_text}>{value}</span>
              )}
            </div>
          )}
        </div>
        {!!image && <img className={styles.card_img} src={image} />}
      </div>
    </>
  );
};
