import Link from "next/link";

export default function ButtonPage(props) {
  const { children, url } = props;

  return (
    <Link
      href={url}
      className="block border border-neutral-900 mt-4 p-2.5 rounded text-center w-full"
    >
      {children}
    </Link>
  );
}
