export function Input({ type = "text", value, onChange, placeholder, className }) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />
    );
  }
  