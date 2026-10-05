export function Badge({
  children,
  variant = 'default',
  liveDot = false,
  className = '',
  ...props
}) {
  const classNames = ['badge', `badge-${variant}`, className].filter(Boolean).join(' ');

  return (
    <span className={classNames} data-testid="badge" {...props}>
      {liveDot && <span className="status-dot status-dot-live" />}
      {children}
    </span>
  );
}

export default Badge;
