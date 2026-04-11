export default function Input({ type, placeholder, value, onChange, label }) {
  return (
    <div>
      <label className="text-text-secondary pl-1 text-[12px]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-premium mt-2 w-full rounded-lg px-5 py-3 text-sm"
      />
    </div>
  );
}
