import React from "react";

const Input = ({ name, ...props }) => {
  return (
    <div className="relative mb-2">
      <div>{name}</div>
      <input
        {...props}
        className=" w-full pl-10 py-2 bg-opacity-50 rounded-lg bg-[#908b8f]"
      />
    </div>
  );
};

export default Input;
