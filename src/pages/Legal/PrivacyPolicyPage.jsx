import LegalPageLayout, { LegalSection } from "../../components/LegalPageLayout";
import { COMPANY_CONTACT } from "../../constants/companyContact";
import { COMPANY_NAME } from "../../constants/companyBrand";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      intro={`${COMPANY_NAME} explains how we collect, use, and protect personal information when you use our website, careers portal, and related services.`}
    >
      <LegalSection title="Information we collect">
        <p>
          We may collect information you provide directly, such as name, email, phone number, résumé, work history,
          and documents submitted through job applications or contact requests.
        </p>
        <p>
          We automatically collect limited technical data when you visit our site, including IP address, browser type,
          pages viewed, and cookie preferences where applicable.
        </p>
      </LegalSection>

      <LegalSection title="How we use information">
        <p>We use personal information to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Process employment applications and onboarding</li>
          <li>Respond to inquiries and schedule consultations</li>
          <li>Operate, secure, and improve our website and services</li>
          <li>Meet legal, regulatory, and contractual obligations</li>
        </ul>
      </LegalSection>

      <LegalSection title="Sharing and disclosure">
        <p>
          We do not sell your personal information. We may share data with service providers who assist our operations
          (such as hosting or email), when required by law, or with your consent.
        </p>
      </LegalSection>

      <LegalSection title="Retention and security">
        <p>
          We retain information only as long as needed for the purposes described in this policy or as required by law.
          We apply reasonable administrative, technical, and organizational safeguards to protect personal data.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Depending on your location, you may have rights to access, correct, delete, or restrict certain processing of
          your personal information. Contact us to make a request.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy:{" "}
          <a className="text-secondary hover:underline" href={`mailto:${COMPANY_CONTACT.email}`}>
            {COMPANY_CONTACT.email}
          </a>
          <br />
          {COMPANY_CONTACT.address}
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
