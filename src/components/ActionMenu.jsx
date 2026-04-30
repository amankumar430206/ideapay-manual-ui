import React from "react";
import { MoreVertical } from "react-feather";
/**
 * 
 * @param {options} 
 * Options Schema ==========
 * const options = [
    {
      name: "",
      onClick: () => null,
    },
  ];
  ===========================
 * @returns <ActionMenu/>
 */

export const ActionMenu = ({
  name = "Actions",
  disabled = false,
  options = [
    {
      name: "Default Item",
      show: true,
      onClick: () => null,
    },
  ],
}) => {
  return (
    <div className="dropdown">
      <button
        disabled={disabled}
        className="btn btn-light px-2"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span>{name}</span>
        <MoreVertical color="grey" size={12} />
      </button>
      {!disabled && (
        <ul className="dropdown-menu shadow rounded-3">
          {options.map(({ name, onClick, show = true }, index) => {
            return (
              <>
                {show ? (
                  <li key={name} className="">
                    <a
                      className="dropdown-item py-2 text-capitalize"
                      onClick={onClick}
                    >
                      {name}
                    </a>
                  </li>
                ) : null}
              </>
            );
          })}
        </ul>
      )}
    </div>
  );
};
