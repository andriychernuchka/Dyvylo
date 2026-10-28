import styles from './Card.module.css';

export function Card({
  children,
  hoverable = false,
  clickable = false,
  className = '',
  onClick,
  ...props
}) {
  const classes = [
    styles.card,
    hoverable ? styles.hoverable : '',
    clickable ? styles.clickable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`${styles.header} ${className}`.trim()}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`${styles.body} ${className}`.trim()}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`${styles.footer} ${className}`.trim()}>{children}</div>;
}

export default Card;
