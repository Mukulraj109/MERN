import React from "react";

const Table = ({ children }) => {
  return (
    <table className="min-w-full bg-white border border-gray-200">
      {children}
    </table>
  );
};

export default Table;
