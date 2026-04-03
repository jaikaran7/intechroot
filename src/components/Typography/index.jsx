export default function Typography({ as: Tag = "p", className = "", children, ...props }) {
  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
}
