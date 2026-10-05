export function Card({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  onClick,
  ...props
}) {
  const classNames = [
    'card',
    hoverable ? 'card-hoverable' : '',
    bordered ? 'card-bordered' : '',
    onClick ? 'card-clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} onClick={onClick} data-testid="card" {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`card-header ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`card-footer ${className}`}>{children}</div>;
}

export default Card;
