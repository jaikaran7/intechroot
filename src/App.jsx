import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home/HomePage";
import CareersPage from "./pages/Careers/CareersPage";
import ServicesPage from "./pages/Services/ServicesPage";
import ApplyPage from "./pages/Apply/ApplyPage";

const ProtectedEmployee = lazy(() => import("./employee/components/ProtectedEmployee"));
const EmployeeDocumentsPage = lazy(() => import("./employee/pages/EmployeeDocumentsPage"));
const EmployeeDashboard = lazy(() => import("./employee/pages/EmployeeDashboard"));
const EmployeeLogin = lazy(() => import("./employee/pages/EmployeeLogin"));
const EmployeeProfilePage = lazy(() => import("./employee/pages/EmployeeProfilePage"));
const EmployeeTimesheetsPage = lazy(() => import("./employee/pages/EmployeeTimesheetsPage"));
const ApplicationSubmittedPremiumSuccess = lazy(() =>
  import("./pages/ApplyFlow/ApplicationSubmittedPremiumSuccess"),
);
const AlreadyAppliedPremiumPage = lazy(() => import("./pages/ApplyFlow/AlreadyAppliedPremiumPage"));
const SuccessPage = lazy(() => import("./pages/Success/SuccessPage"));
const ApplicantLogin = lazy(() => import("./applicant/pages/ApplicantLogin"));
const ProtectedApplicant = lazy(() => import("./applicant/components/ProtectedApplicant"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const Employees = lazy(() => import("./admin/pages/Employees"));
const EmployeeDetails = lazy(() => import("./admin/pages/EmployeeDetails"));
const EmployeeOnboarding = lazy(() => import("./admin/pages/EmployeeOnboarding"));
const Applications = lazy(() => import("./admin/pages/Applications"));
const ApplicationProfile = lazy(() => import("./admin/pages/ApplicationProfile"));
const Timesheets = lazy(() => import("./admin/pages/Timesheets"));
const Payroll = lazy(() => import("./admin/pages/Payroll"));
const JobPostings = lazy(() => import("./admin/pages/JobPostings"));
const JobDetails = lazy(() => import("./admin/pages/JobDetails"));
const Reports = lazy(() => import("./admin/pages/Reports"));
const Settings = lazy(() => import("./admin/pages/Settings"));
const CompanyWorkspace = lazy(() => import("./admin/pages/CompanyWorkspace"));
const OnboardingReview = lazy(() => import("./admin/pages/OnboardingReview"));
const EmployeeTimesheetHistory = lazy(() => import("./admin/pages/EmployeeTimesheetHistory"));

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
  const isEmployeeRoute = location.pathname.startsWith("/employee");
  const isApplicantRoute = location.pathname.startsWith("/applicant");

  return (
    <>
      {!isAdminRoute && !isEmployeeRoute && !isApplicantRoute && <Navbar />}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/application-success" element={<ApplicationSubmittedPremiumSuccess />} />
          <Route path="/already-applied" element={<AlreadyAppliedPremiumPage />} />
          <Route path="/dashboard" element={<Navigate to="/applicant/dashboard" replace />} />
          <Route path="/applicant-dashboard" element={<Navigate to="/applicant/dashboard" replace />} />
          <Route path="/success" element={<Navigate to="/applicant/login" replace />} />
          <Route path="/applicant/login" element={<ApplicantLogin />} />
          <Route
            path="/applicant/dashboard"
            element={
              <ProtectedApplicant>
                <SuccessPage />
              </ProtectedApplicant>
            }
          />
          <Route path="/about" element={<HomePage />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/employees/onboarding" element={<EmployeeOnboarding />} />
          <Route path="/admin/employees/:id" element={<EmployeeDetails />} />
          <Route path="/admin/employees/:id/timesheets" element={<EmployeeTimesheetHistory />} />
          <Route path="/admin/employees/:id/documents-submitted" element={<EmployeeDetails />} />
          <Route path="/admin/applications" element={<Applications />} />
          <Route path="/admin/applications/:id" element={<ApplicationProfile />} />
          <Route path="/admin/timesheets" element={<Timesheets />} />
          <Route path="/admin/payroll" element={<Payroll />} />
          <Route path="/admin/job-postings/:id" element={<JobDetails />} />
          <Route path="/admin/job-postings" element={<JobPostings />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/settings/company-workspace" element={<CompanyWorkspace />} />
          <Route path="/admin/employees/onboarding/review" element={<OnboardingReview />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
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
