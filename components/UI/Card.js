export default function Card(props) {
  return (
    <article className="bg-white max-w-xs mx-auto p-4 rounded shadow w-full">
      {props.children}
    </article>
  );
}
