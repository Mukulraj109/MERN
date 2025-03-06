import React from "react";
export const DropdownMenu = ({ options, selected, onChange }) => {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};


