import { useState } from "react";

export const useToggle = () => {
  const [isToggle, setToggle] = useState(false);

  const handleToggle = () => setToggle(!isToggle);

  return {
    isToggle,
    handleToggle,
  };
};
