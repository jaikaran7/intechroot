import { useAuthStore } from "../../store/authStore";
import { EmployeeDocumentsWorkspace } from "../../components/employees/EmployeeDocumentsWorkspace";

export default function EmployeeDocumentsPage() {
  const { employeeId } = useAuthStore();
  return <EmployeeDocumentsWorkspace employeeId={employeeId} layoutVariant="portal" />;
}
