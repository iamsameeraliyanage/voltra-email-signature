type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
};

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: FieldProps) {
  return (
    <label className="block">
      {/* Overlines are Regular and understated, per the brand type hierarchy. */}
      <span className="block text-[11px] font-normal uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-rule bg-surface px-3.5 py-2.5 text-sm font-medium text-ink transition-colors placeholder:font-normal placeholder:text-muted/60 hover:border-volt/50 focus:border-volt focus:outline-none focus:ring-2 focus:ring-volt/25"
      />
    </label>
  );
}
