import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home/HomePage";
import CareersPage from "./pages/Careers/CareersPage";
import ServicesPage from "./pages/Services/ServicesPage";
import ApplyRedirect from "./pages/Apply/ApplyRedirect";
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const ProtectedAdmin = lazy(() => import("./components/ProtectedAdmin"));

const ProtectedEmployee = lazy(() => import("./pages/Employee/components/ProtectedEmployee"));
const EmployeeDocumentsPage = lazy(() => import("./pages/Employee/EmployeeDocumentsPage"));
const EmployeeDashboard = lazy(() => import("./pages/Employee/EmployeeDashboard"));
const EmployeeLogin = lazy(() => import("./pages/Employee/EmployeeLogin"));
const EmployeeProfilePage = lazy(() => import("./pages/Employee/EmployeeProfilePage"));
const EmployeeTimesheetsPage = lazy(() => import("./pages/Employee/EmployeeTimesheetsPage"));
const ApplicationSubmittedPremiumSuccess = lazy(() =>
  import("./pages/ApplyFlow/ApplicationSubmittedPremiumSuccess"),
);
const AlreadyAppliedPremiumPage = lazy(() => import("./pages/ApplyFlow/AlreadyAppliedPremiumPage"));
const SuccessPage = lazy(() => import("./pages/Applicant/SuccessPage"));
const ApplicantLogin = lazy(() => import("./pages/Applicant/ApplicantLogin"));
const ApplicantOnboardingPage = lazy(() => import("./pages/Applicant/ApplicantOnboardingPage"));
const ProtectedApplicant = lazy(() => import("./pages/Applicant/components/ProtectedApplicant"));

const AdminLayout = lazy(() => import("./pages/Admin/components/AdminLayout"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard/Dashboard"));
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
const CompanyWorkspace = lazy(() => import("./pages/Admin/Settings/CompanyWorkspace"));
const OnboardingReview = lazy(() => import("./pages/Admin/Employees/OnboardingReview"));

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
          <Route path="/apply" element={<ApplyRedirect />} />
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
          <Route
            path="/applicant/onboarding/:step"
            element={
              <ProtectedApplicant>
                <ApplicantOnboardingPage />
              </ProtectedApplicant>
            }
          />
          <Route path="/about" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdmin>
                <AdminLayout />
              </ProtectedAdmin>
            }
          >
            <Route index element={<Dashboard />} />
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
            <Route path="settings/company-workspace" element={<CompanyWorkspace />} />
            <Route path="settings" element={<Settings />} />
          </Route>

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
