import { COMPANY_CONTACT } from "../constants/companyContact";

export default function CompanyContactBlock({ className = "", linkClassName = "hover:text-[#4059aa] transition-colors" }) {
  const { address, email, phone, phoneTel } = COMPANY_CONTACT;

  return (
    <address className={`not-italic space-y-3 text-sm text-[#7587a7] dark:text-[#c4c6ce] ${className}`}>
      <p className="leading-relaxed">{address}</p>
      <a className={`block break-all ${linkClassName}`} href={`mailto:${email}`}>
        {email}
      </a>
      <a className={`block ${linkClassName}`} href={`tel:${phoneTel}`}>
        {phone}
      </a>
    </address>
  );
}
