export default function ErrorMessage(props) {
  const { children, onResend } = props;

  return (
    <p className="bg-red-50 mt-4 p-3 rounded text-center text-red-700 text-sm">
      {children} &nbsp;
      {children.includes("verifikasi akun") && (
        <button className="text-blue-700 underline" onClick={onResend}>
          Kirim ulang
        </button>
      )}
    </p>
  );
}
