export default function InputAuth(props) {
  const { name, placeholder, type } = props;

  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        className="bg-neutral-50 mt-1 p-3 rounded shadow-inner text-sm w-full"
        required
      />
    </div>
  );
}