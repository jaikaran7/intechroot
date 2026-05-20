import LegalPageLayout, { LegalSection } from "../../components/LegalPageLayout";
import { Link } from "react-router-dom";
import { COMPANY_CONTACT } from "../../constants/companyContact";
import { COMPANY_NAME } from "../../constants/companyBrand";
import { LEGAL_PATHS } from "../../constants/legalRoutes";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      intro={`These terms govern your use of the ${COMPANY_NAME} website and related online services. By accessing our site, you agree to these terms.`}
    >
      <LegalSection title="Use of the website">
        <p>
          You may use this website for lawful purposes only. You must not attempt to disrupt the site, access systems
          without authorization, or misuse content, trademarks, or materials published by {COMPANY_NAME}.
        </p>
      </LegalSection>

      <LegalSection title="Careers and applications">
        <p>
          Job listings and application materials are provided for recruitment purposes. Submitting an application does
          not create an employment contract. We may verify information you provide and contact you regarding your
          application status.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          All content on this site—including text, graphics, logos, and design—is owned by {COMPANY_NAME} or its
          licensors and is protected by applicable intellectual property laws. You may not copy or redistribute content
          without written permission.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer">
        <p>
          The website and services are provided on an &ldquo;as is&rdquo; basis. We do not guarantee uninterrupted
          availability or that all information is complete or current. To the fullest extent permitted by law,{" "}
          {COMPANY_NAME} is not liable for indirect or consequential damages arising from use of this site.
        </p>
      </LegalSection>

      <LegalSection title="Third-party links">
        <p>
          Our site may link to third-party websites. We are not responsible for their content, policies, or practices.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms from time to time. Continued use of the site after changes are posted constitutes
          acceptance of the revised terms. See also our{" "}
          <Link className="text-secondary hover:underline" to={LEGAL_PATHS.privacy}>
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For questions about these terms:{" "}
          <a className="text-secondary hover:underline" href={`mailto:${COMPANY_CONTACT.email}`}>
            {COMPANY_CONTACT.email}
          </a>
          <br />
          {COMPANY_CONTACT.phone} · {COMPANY_CONTACT.address}
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
