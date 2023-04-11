export default function ButtonAuth(props) {
  return (
    <button className="bg-green-700 border border-green-700 mt-2 p-2.5 rounded text-center text-white">
      {props.children}
    </button>
  );
}
