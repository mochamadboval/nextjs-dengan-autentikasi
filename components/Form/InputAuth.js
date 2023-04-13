import { forwardRef } from "react";

const InputAuth = forwardRef(function InputAuth(props, ref) {
  const { comparePassword, name, placeholder, type } = props;

  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        ref={ref}
        onChange={comparePassword && comparePassword}
        className="bg-neutral-50 mt-1 p-3 rounded shadow-inner text-sm w-full"
        required
      />
    </div>
  );
});

export default InputAuth;
