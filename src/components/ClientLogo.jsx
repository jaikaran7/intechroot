export default function ClientLogo({ client, className = "", variant = "dark" }) {
  const variantClass =
    variant === "dark"
      ? "trusted-client-logo trusted-client-logo--dark"
      : "trusted-client-logo trusted-client-logo--light";

  return (
    <img
      src={client.logo}
      alt={`${client.name} logo`}
      className={`${variantClass} ${className}`.trim()}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}
