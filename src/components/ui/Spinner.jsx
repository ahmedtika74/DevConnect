export default function Spinner({ size = "md", color = "primary" }) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-8",
  };

  const colors = {
    primary: "border-primary/30 border-t-primary",
    white: "border-white/30 border-t-white",
    secondary: "border-secondary/30 border-t-secondary",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full ${sizes[size]} ${colors[color]}`}
      ></div>
    </div>
  );
}
