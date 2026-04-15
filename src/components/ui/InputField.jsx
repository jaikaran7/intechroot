export default function InputField({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  disabled = false,
}) {
  const isReadOnly = typeof onChange !== "function";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold tracking-wide text-slate-300">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={isReadOnly}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-[#4cd7f6] focus:ring-2 focus:ring-[#4cd7f6]/30 disabled:cursor-not-allowed disabled:opacity-70"
      />
    </div>
  );
}
