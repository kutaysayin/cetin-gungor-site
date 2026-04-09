interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea" | "select" | "date" | "datetime-local" | "number" | "url" | "password";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  maxLength?: number;
  disabled?: boolean;
  rows?: number;
}

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
  placeholder,
  options,
  maxLength,
  disabled,
  rows = 4,
}: FormFieldProps) {
  const baseClasses =
    "w-full px-3 py-2 border rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed";
  const borderClass = error ? "border-red-400" : "border-neutral-200";

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {type === "textarea" ? (
        <>
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            disabled={disabled}
            rows={rows}
            className={`${baseClasses} ${borderClass} resize-y`}
          />
          {maxLength && (
            <p className="text-xs text-neutral-400 text-right">
              {String(value).length}/{maxLength}
            </p>
          )}
        </>
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${baseClasses} ${borderClass}`}
        >
          <option value="">{placeholder ?? "Seciniz..."}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          disabled={disabled}
          className={`${baseClasses} ${borderClass}`}
        />
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
