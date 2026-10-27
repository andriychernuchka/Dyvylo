export function Input({
  label,
  error,
  icon,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-field-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={inputId}
          type={type}
          className={`input-field ${icon ? 'with-icon' : ''}`}
          data-testid="input-field"
          {...props}
        />
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
}

export default Input;
