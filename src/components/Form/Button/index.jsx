export default function Button({ className = "", type = "button", children, ...props }) {
  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  );
}
