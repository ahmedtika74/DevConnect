export default function Avatar({ src, alt, size = "md" }) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-24 w-24",
    xxl: "h-32 w-32",
  };

  return (
    <div className={`${sizes[size]} overflow-hidden rounded-full`}>
      <img
        src={src || "UserAvatar.png"}
        alt={alt || "User avatar"}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
