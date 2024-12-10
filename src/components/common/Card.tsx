interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>{children}</div>
);

export default Card;