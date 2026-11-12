import styles from './Input.module.css';

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
    <div
      className={`${styles.inputGroup} ${error ? styles.hasError : ''} ${className}`.trim()}
    >
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.wrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={inputId}
          type={type}
          className={`${styles.input} ${icon ? styles.withIcon : ''}`.trim()}
          {...props}
        />
      </div>
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

export default Input;
