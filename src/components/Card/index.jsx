export default function Card({ className = "", children, ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
