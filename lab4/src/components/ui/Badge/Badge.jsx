import styles from './Badge.module.css';

export function Badge({
  children,
  variant = 'default',
  liveDot = false,
  className = '',
  ...props
}) {
  const variantClass = styles[variant] || styles.default;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`.trim()} {...props}>
      {liveDot && <span className={styles.liveDot} />}
      {children}
    </span>
  );
}

export default Badge;
