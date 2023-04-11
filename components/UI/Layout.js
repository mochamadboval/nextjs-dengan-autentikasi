export default function Layout(props) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {props.children}
    </div>
  );
}
