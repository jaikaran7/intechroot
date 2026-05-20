import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminRouteEnforcement from "./components/AdminRouteEnforcement";
import HomePage from "./pages/Home/HomePage";
import CareersPage from "./pages/Careers/CareersPage";
import ServicesPage from "./pages/Services/ServicesPage";
import ApplyRedirect from "./pages/Apply/ApplyRedirect";
import PrivacyPolicyPage from "./pages/Legal/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/Legal/TermsOfServicePage";
import CookieSettingsPage from "./pages/Legal/CookieSettingsPage";
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ProtectedAdmin = lazy(() => import("./components/ProtectedAdmin"));
const ProtectedAdminPanel = lazy(() => import("./components/ProtectedAdminPanel"));

const ProtectedEmployee = lazy(() => import("./pages/Employee/components/ProtectedEmployee"));
const EmployeeDocumentsPage = lazy(() => import("./pages/Employee/EmployeeDocumentsPage"));
const EmployeeDashboard = lazy(() => import("./pages/Employee/EmployeeDashboard"));
const EmployeeProfilePage = lazy(() => import("./pages/Employee/EmployeeProfilePage"));
const EmployeeTimesheetsPage = lazy(() => import("./pages/Employee/EmployeeTimesheetsPage"));
const ApplicationSubmittedPremiumSuccess = lazy(() =>
  import("./pages/ApplyFlow/ApplicationSubmittedPremiumSuccess"),
);
const AlreadyAppliedPremiumPage = lazy(() => import("./pages/ApplyFlow/AlreadyAppliedPremiumPage"));
const SuccessPage = lazy(() => import("./pages/Applicant/SuccessPage"));
const ApplicantLogin = lazy(() => import("./pages/Applicant/ApplicantLogin"));
const ApplicantForgotPassword = lazy(() => import("./pages/Applicant/ApplicantForgotPassword"));
const ApplicantResetPassword = lazy(() => import("./pages/Applicant/ApplicantResetPassword"));
const ApplicantOnboardingPage = lazy(() => import("./pages/Applicant/ApplicantOnboardingPage"));
const ProtectedApplicant = lazy(() => import("./pages/Applicant/components/ProtectedApplicant"));

const AdminLayout = lazy(() => import("./pages/Admin/components/AdminLayout"));
const AdminLockedDashboard = lazy(() => import("./pages/Admin/AdminLockedDashboard"));
const AdminPanelTimesheets = lazy(() => import("./pages/Admin/AdminPanelTimesheets"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard/Dashboard"));
const Admins = lazy(() => import("./pages/Admin/Admins/Admins"));
const AdminDirectoryList = lazy(() => import("./pages/Admin/Admins/AdminDirectoryList"));
const AdminDetails = lazy(() => import("./pages/Admin/Admins/AdminDetails"));
const Employees = lazy(() => import("./pages/Admin/Employees/Employees"));
const EmployeeDetails = lazy(() => import("./pages/Admin/Employees/EmployeeDetails"));
const EmployeeOnboarding = lazy(() => import("./pages/Admin/Employees/EmployeeOnboarding"));
const Applications = lazy(() => import("./pages/Admin/Applications/Applications"));
const ApplicationProfile = lazy(() => import("./pages/Admin/Applications/ApplicationProfile"));
const Timesheets = lazy(() => import("./pages/Admin/Timesheets/Timesheets"));
const Payroll = lazy(() => import("./pages/Admin/Settings/Payroll"));
const JobPostings = lazy(() => import("./pages/Admin/JobPostings/JobPostings"));
const JobDetails = lazy(() => import("./pages/Admin/JobPostings/JobDetails"));
const Reports = lazy(() => import("./pages/Admin/Settings/Reports"));
const Settings = lazy(() => import("./pages/Admin/Settings/Settings"));
const OnboardingReview = lazy(() => import("./pages/Admin/Employees/OnboardingReview"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

function RouteFallback() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "40vh",
        color: "#64748b",
        fontSize: "0.95rem",
      }}
    >
      Loading…
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminPanelRoute = location.pathname.startsWith("/admin-panel");
  const isEmployeeRoute = location.pathname.startsWith("/employee");
  const isApplicantRoute = location.pathname.startsWith("/applicant");
  const hideMarketingNavbar =
    isAdminRoute || isAdminPanelRoute || isEmployeeRoute || isApplicantRoute || location.pathname === "/forgot-password";

  return (
    <>
      <AdminRouteEnforcement />
      {!hideMarketingNavbar && <Navbar />}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/apply" element={<ApplyRedirect />} />
          <Route path="/application-success" element={<ApplicationSubmittedPremiumSuccess />} />
          <Route path="/already-applied" element={<AlreadyAppliedPremiumPage />} />
          <Route path="/dashboard" element={<Navigate to="/applicant/dashboard" replace />} />
          <Route path="/applicant-dashboard" element={<Navigate to="/applicant/dashboard" replace />} />
          <Route path="/success" element={<Navigate to="/applicant/login" replace />} />
          <Route path="/applicant/login" element={<ApplicantLogin />} />
          <Route path="/applicant/forgot-password" element={<ApplicantForgotPassword />} />
          <Route path="/applicant/reset-password" element={<ApplicantResetPassword />} />
          <Route
            path="/applicant/dashboard"
            element={
              <ProtectedApplicant>
                <SuccessPage />
              </ProtectedApplicant>
            }
          />
          <Route
            path="/applicant/onboarding/:step"
            element={
              <ProtectedApplicant>
                <ApplicantOnboardingPage />
              </ProtectedApplicant>
            }
          />
          <Route path="/about" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/cookies" element={<CookieSettingsPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/admin-dashboard.html" element={<Navigate to="/admin-panel/dashboard" replace />} />
          <Route
            path="/admin-panel/dashboard"
            element={
              <ProtectedAdminPanel>
                <AdminLockedDashboard />
              </ProtectedAdminPanel>
            }
          />
          <Route
            path="/admin-panel/timesheets"
            element={
              <ProtectedAdminPanel>
                <AdminPanelTimesheets />
              </ProtectedAdminPanel>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdmin>
                <AdminLayout />
              </ProtectedAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="admins" element={<Admins />} />
            <Route path="admins/client" element={<AdminDirectoryList kind="client" />} />
            <Route path="admins/hr" element={<AdminDirectoryList kind="hr" />} />
            <Route path="admins/:id" element={<AdminDetails />} />
            <Route path="employees/onboarding/review" element={<OnboardingReview />} />
            <Route path="employees/onboarding" element={<EmployeeOnboarding />} />
            <Route path="employees/:id/timesheets" element={<EmployeeDetails />} />
            <Route path="employees/:id/documents-submitted" element={<EmployeeDetails />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="employees" element={<Employees />} />
            <Route path="applications/:id" element={<ApplicationProfile />} />
            <Route path="applications" element={<Applications />} />
            <Route path="timesheets" element={<Timesheets />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="job-postings/:id" element={<JobDetails />} />
            <Route path="job-postings" element={<JobPostings />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings/company-workspace" element={<Navigate to="/admin/settings" replace />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/employee/login" element={<Navigate to="/login" replace />} />
          <Route path="/employee/dashboard" element={<ProtectedEmployee><EmployeeDashboard /></ProtectedEmployee>} />
          <Route path="/employee/profile" element={<ProtectedEmployee><EmployeeProfilePage /></ProtectedEmployee>} />
          <Route path="/employee/timesheets" element={<ProtectedEmployee><EmployeeTimesheetsPage /></ProtectedEmployee>} />
          <Route path="/employee/documents" element={<ProtectedEmployee><EmployeeDocumentsPage /></ProtectedEmployee>} />
          <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
