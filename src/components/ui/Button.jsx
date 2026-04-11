import Spinner from "./Spinner";

export default function Button({
  children,
  variant = "default",
  loading,
  className = "",
  type = "button",
  disabled,
  ...props
}) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary text-white",
    ghost: "bg-transparent hover:bg-slate-800/50",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    default: "",
  };

  return (
    <button
      type={type}
      className={`${variants[variant]} ${className} flex cursor-pointer items-center justify-center gap-1`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  );
}
