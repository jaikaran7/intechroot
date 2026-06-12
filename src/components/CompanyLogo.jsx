import { Link } from "react-router-dom";
import { COMPANY_LOGO_SRC, COMPANY_NAME, COMPANY_NAME_LOGO } from "../constants/companyBrand";

export default function CompanyLogo({
  to = "/",
  variant = "lockup",
  markClassName = "h-10 w-10 rounded-xl object-cover shadow-lg",
  textClassName = "tracking-[0.15em] text-lg font-headline font-black text-primary dark:text-white",
  linkClassName = "inline-flex items-center gap-3",
  showText = true,
  className,
  ...imgProps
}) {
  const resolvedMarkClassName = className || markClassName;

  const mark = (
    <img
      src={COMPANY_LOGO_SRC}
      alt={`${COMPANY_NAME} logo`}
      className={resolvedMarkClassName}
      {...imgProps}
    />
  );

  const content =
    variant === "mark" ? (
      mark
    ) : (
      <>
        {mark}
        {showText ? <span className={textClassName}>{COMPANY_NAME_LOGO}</span> : null}
      </>
    );

  if (to == null) return content;

  return (
    <Link to={to} className={linkClassName}>
      {content}
    </Link>
  );
}
