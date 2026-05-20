/** Official InTechRoot contact details — use only these values site-wide. */
export const COMPANY_CONTACT = {
  address: "#606, 6733 Mississauga Rd, Mississauga, ON L5N 6J5",
  email: "info@intechroot.com",
  phone: "(647) 313-5931",
  phoneTel: "+16473135931",
};

export const CONSULTATION_MAILTO = `mailto:${COMPANY_CONTACT.email}?subject=${encodeURIComponent(
  "Schedule a consultation — InTechRoot",
)}&body=${encodeURIComponent(
  "Hi InTechRoot team,\n\nI would like to schedule a consultation.\n\nName:\nCompany:\nPreferred date/time:\nBrief overview:\n\nThank you,\n",
)}`;
