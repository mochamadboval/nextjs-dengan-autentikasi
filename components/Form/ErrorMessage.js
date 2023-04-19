export default function ErrorMessage(props) {
  return (
    <p className="bg-red-50 mt-4 p-3 rounded text-center text-red-700 text-sm">
      {props.children}
    </p>
  );
}
